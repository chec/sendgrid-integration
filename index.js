const { readFileSync } = require('fs');
const { resolve } = require('path');
const { verifyWebhook } = require('@chec/webhook-verifier');
const sendGridMail = require('@sendgrid/mail');
const sendGridClient = require('@sendgrid/client');

/**
 * Return a template ID for the corresponding webhook event. These templates should exist, as they would've
 * been created where they don't exist when the integration was created.
 *
 * @param {string} event
 * @param {object} integration
 * @returns {string}
 */
function getTemplateId(event, integration) {
  const templateId = integration.config.templates[event] || '';
  if (!templateId) {
    throw new Error(`Template ID is not available for event: ${event}`);
  }
  return templateId;
}

/**
 * Creates a template, and a template version in SendGrid, then returns the ID of the template version.
 *
 * @param {string} event
 * @param {string} name
 * @param {string} subject
 * @returns {Promise<Object>}
 */
async function createTemplate(event, name, subject) {
  // Load the template HTML and sample JSON data
  const templateHtml = readFileSync(`${resolve(__dirname)}/templates/${event}/template.html`).toString();
  const testData = readFileSync(`${resolve(__dirname)}/templates/${event}/testData.json`).toString();

  // Queue each set of API calls, they can run concurrently.
  const [templateResponse] = await sendGridClient.request({
    body: { name, generation: 'dynamic' },
    method: 'POST',
    url: '/v3/templates',
  });

  // Get template ID, then create
  const { id } = templateResponse.body;

  // Create a version for the template, which includes the HTML and JSON data
  await sendGridClient.request({
    body: {
      name,
      subject,
      html_content: templateHtml,
      test_data: testData,
      editor: 'code',
    },
    method: 'POST',
    url: `/v3/templates/${id}/versions`,
  });

  return {
    event,
    // This is the ID we actually need
    id,
  };
}

module.exports = async function handler(request, context) {
  // Verify webhook authenticity
  verifyWebhook(request.body, context.webhookSigningKey);

  // If it's a readiness probe, tell it we're good.
  if (request.body.event === 'readiness.probe') {
    return {
      statusCode: 204,
      body: '',
    };
  }

  // Fetch merchant and integration info
  const merchant = await context.merchant();
  const merchantId = merchant.id;
  const integration = await context.integration();

  // Assemble payload for SendGrid transactional templates
  const data = {
    ...request.body,
    merchant,
  };

  // Set up SendGrid mail client
  const sendGridApiKey = integration.config.api_key || null;
  if (!sendGridApiKey) {
    throw new Error('SendGrid API key not available. Please check your configuration.');
  }
  sendGridMail.setApiKey(sendGridApiKey);

  let result = {};

  // Work out what to do
  switch (data.event) {
    // Runs once when an integration is first installed. Use this to control initial setup steps such as disabling
    // default emails in the Chec API, etc.
    case 'integrations.ready':
      // Disable default emails in Chec
      context.api.put(`/v1/merchants/${merchantId}/notifications`, {
        customer: {
          login_token: false,
          orders: false,
          shipments: false,
        },
      });

      // Create transactional templates in SendGrid
      sendGridClient.setApiKey(sendGridApiKey);

      // Loop each event type
      const promises = [];
      [
        {
          event: 'customers.login.token',
          name: 'Customers: login token',
          subject: 'Log in to your account',
        },
        {
          event: 'orders.create',
          name: 'Orders: receipt',
          subject: 'Your order: {{ payload.customer_reference }}',
        },
        {
          event: 'orders.physical.shipment',
          name: 'Orders: item shipped',
          subject: 'Your order has shipped!',
        },
      ].forEach(({ event, name, subject }) => {
        promises.push(createTemplate(event, name, subject));
      });

      // Wait for all of the templates to be built, then collect their IDs
      const templateIds = await Promise.all(promises);
      // Format for the API
      const integrationConfig = {
        ...integration.config,
        // Converts from [{event: 'foo', id: 'a-b-c'},...] to {foo: 'a-b-c', ...}
        templates: templateIds.reduce((acc, value) => (acc[value.event] = value.id, acc), {}),
      };
      // Update in the API
      result = await context.api.put(`/v1/integrations/${integration.id}`, {
        config: integrationConfig,
      });
      break;

    // Send "new order" email to customer
    case 'orders.create':
      await sendGridMail.send({
        to: data.payload.customer.email,
        from: {
          email: data.merchant.support_email, // must be verified in SendGrid before it can be used
          name: data.merchant.name,
        },
        subject: `Your order: ${data.payload.customer_reference}`,
        dynamic_template_data: data,
        template_id: getTemplateId(data.event, integration),
      });
      result = { sent: true };
      break;

    // Send "item shipped" email to customer
    case 'orders.physical.shipment':
      await sendGridMail.send({
        to: data.payload.customer.email,
        from: data.merchant.support_email, // must be verified in SendGrid before it can be used
        subject: 'Your order has a new shipment!',
        dynamic_template_data: data,
        template_id: getTemplateId(data.event, integration),
      });
      result = { sent: true };
      break;

    // Send "customer login token" email to customer
    case 'customers.login.token':
      await sendGridMail.send({
        to: data.payload.email,
        from: data.merchant.support_email, // must be verified in SendGrid before it can be used
        subject: 'Log in to your account',
        dynamic_template_data: data,
        template_id: getTemplateId(data.event, integration),
      })
      result = { sent: true };
      break;

    default:
      throw new Error('Invalid `event` type provided.');
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
}
