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
  const templateId = integration.config.sendgrid.templates[data.event] || '';
  if (!templateId) {
    throw new Error(`Template ID is not available for event: ${data.event}`);
  }
  return templateId;
}

module.exports = async function handler(request, context) {
  // Verify webhook authenticity
  verifyWebhook(request.body, context.webhookSigningKey);

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
  const sendGridApiKey = integration.config.sendgrid.api_key || null;
  if (!sendGridApiKey) {
    throw new Error('SendGrid API key not available. Please check your configuration.');
  }
  sendGridMail.setApiKey(sendGridApiKey);

  // Work out what to do
  switch (data.event) {
    // Runs once when an integration is first installed. Use this to control initial setup steps such as disabling
    // default emails in the Chec API, etc.
    case 'integrations.create':
      // Disable default emails in Chec
      context.api.put(`/v1/merchants/${merchantId}/notifications`, {
        emails: {
          'customer.login-token': { send: false },
          'customer.order.new': { send: false },
          'customer.order.shipped': { send: false },
        },
      });
      // Create transactional templates in SendGrid
      sendGridClient.setApiKey(sendGridApiKey);
      // todo
      break;

    // Send "new order" email to customer
    case 'orders.create':
      await sendGridMail.send({
        to: data.payload.customer.email,
        from: data.merchant.support_email, // must be verified in SendGrid before it can be used
        subject: `Your order: ${data.payload.customer_reference}`,
        dynamic_template_data: data,
        template_id: getTemplateId(data.event, integration),
      })
      break;

    // Send "item shipped" email to customer
    case 'orders.physical.shipment':
      await sendGridMail.send({
        to: data.payload.customer.email,
        from: data.merchant.support_email, // must be verified in SendGrid before it can be used
        subject: 'Your order has a new shipment!',
        dynamic_template_data: data,
        template_id: getTemplateId(data.event, integration),
      })
      break;

    // todo add "customer login token" with CHEC-1794

    default:
      throw new Error('Invalid `event` type provided.');
  }

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}
