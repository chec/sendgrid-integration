# SendGrid integration

This integration does the following things:

* Disable default Chec emails (on `integrations.create` event, first run only)
* Create transactional email templates in SendGrid, unless a template ID was provided for each email type
* Assemble data for transactional emails and send them using the SendGrid API

## Using this repo

This repository runs in combination with the [integration-helper](https://github.com/chec/integration-helper). That
repository provides context (e.g. merchant, API connectivity, integration info) and then runs the code in this
repository.

### Building

When you make changes to this repository you will need to rebuild the dist files. For this, we use
[`@vercel/ncc`](https://github.com/vercel/ncc):

```
npm run build
```

## Email types

* Customers: new order. Sent when a new order is placed, this is the order receipt the customer receives.
* Customers: item shipped
* Customers: login token

## Events

| Event | Action | Template |
| -------------------------- | ----------------------------------- | ---------------------- |
| `readiness.probe`          | API checking on readiness           | -                      |
| `integrations.create`      | Initial setup                       | -                      |
| `orders.create`            | Send customer receipt               | "Order receipt"        |
| `orders.physical.shipment` | Send customer shipment notification | "Item shipped"         |
| TBC (CHEC-1794)            | Send customer login token           | "Customer login token" |

## Initial setup

When the integration first runs, it will run an initial setup phase. This is triggered by the event being
"integrations.create", which only runs for an integration at the time it is created. We can assume the integration
has been provisioned at this point, however DNS may not be available for it yet.

The initial setup process does the following:

* Disable default Chec emails for each of the templates covered in this integration
* For email template, create a transactional template in SendGrid using default markup and dummy data, unless
  a template ID for each template was provided in the integration's config
* Once templates are created in SendGrid, update the integration's config in the Chec API with the new template IDs

### Templates

See the `templates` directory, and the corresponding webhook event name (e.g. `orders.create`) for an HTML template
and JSON test data dump for each transactional template. These can be updated at any time, just make sure you've
tested them in the SendGrid Design Library first. Updating these files will not affect any existing integrations
that have been installed, only new ones.

## Standard runs

During a standard run of this integration, the following will happen:

* Identify the email template ID for the corresponding event type (see table above)
* Assemble the data to power the template (take the webhook payload and add the merchant information to it)
* Send the email using SendGrid's API

## License

This repository is proprietary.
