const { verifyWebhook } = require('@chec/webhook-verifier');

module.exports = async function handler(request, context) {
  console.log('Verifying payload...');
  try {
      verifyWebhook(request.body, context.webhookSigningKey);
  } catch (error) {
      console.error(error);
      return {
          statusCode: 500,
          body: JSON.stringify({
              error: error.message,
          })
      }
  }
  console.log('Signature verified.');

  console.log('Running integration');

  const data = {
    "id": "...",
    "created": 12345,
    "event": "orders.create",
    "response_code": 201,
    "payload": {"version":"v1.5","sandbox":false,"id":"ord_bO6J5a8L17oEjp","checkout_token_id":"chkt_OwmNG6nbbEZjxo","cart_id":"cart_9l6pkrRdrm8xRo","customer_reference":"LNGRG-183006","created":1634768366,"status":"open","status_payment":"paid","status_fulfillment":"not_fulfilled","currency":{"code":"USD","symbol":"$"},"order_value":{"raw":1415.71,"formatted":"1,415.71","formatted_with_symbol":"$1,415.71","formatted_with_code":"1,415.71 USD"},"conditionals":{"collected_fullname":true,"collected_shipping_address":true,"collected_billing_address":false,"collected_extra_fields":true,"collected_tax":true,"collected_eu_vat_moss_evidence":false,"has_physical_fulfillment":true,"has_digital_fulfillment":false,"has_extend_fulfillment":false,"has_webhook_fulfillment":false,"has_extend_apps":false,"has_pay_what_you_want":false,"has_discounts":false,"has_subscription_items":false,"is_free":false,"is_fulfilled":false},"meta":[],"redirect":false,"collected":{"fullname":true,"shipping_address":true,"billing_address":false,"extra_fields":true,"tax":true,"eu_vat_moss_evidence":false},"has":{"physical_fulfillment":true,"digital_fulfillment":false,"extend_fulfillment":false,"webhook_fulfillment":false,"extend_apps":false,"pay_what_you_want":false,"discounts":false,"subscription_items":false},"is":{"free":false,"fulfilled":false},"order":{"subtotal":{"raw":1222,"formatted":"1,222.00","formatted_with_symbol":"$1,222.00","formatted_with_code":"1,222.00 USD"},"total":{"raw":1321,"formatted":"1,321.00","formatted_with_symbol":"$1,321.00","formatted_with_code":"1,321.00 USD"},"total_with_tax":{"raw":1415.71,"formatted":"1,415.71","formatted_with_symbol":"$1,415.71","formatted_with_code":"1,415.71 USD"},"total_paid":{"raw":1415.71,"formatted":"1,415.71","formatted_with_symbol":"$1,415.71","formatted_with_code":"1,415.71 USD"},"adjustments":{"taxable":{"raw":0,"formatted":"0.00","formatted_with_symbol":"$0.00","formatted_with_code":"0.00 USD"},"untaxable":{"raw":0,"formatted":"0.00","formatted_with_symbol":"$0.00","formatted_with_code":"0.00 USD"},"total":{"raw":0,"formatted":"0.00","formatted_with_symbol":"$0.00","formatted_with_code":"0.00 USD"}},"pay_what_you_want":{"enabled":false,"minimum":null,"customer_set_price":null},"shipping":{"id":"ship_8XO3wp7rxlYAzQ","description":"Delivery Fee","provider":"chec","price":{"raw":99,"formatted":"99.00","formatted_with_symbol":"$99.00","formatted_with_code":"99.00 USD"}},"line_items":[{"id":"item_bO6J5a8O8AoEjp","product_id":"prod_4OANwRLdk5vYL8","product_name":"Fiddle Leaf Fig Tree - Extra Large","product_sku":null,"quantity":2,"price":{"raw":599,"formatted":"599.00","formatted_with_symbol":"$599.00","formatted_with_code":"599.00 USD"},"line_total":{"raw":1198,"formatted":"1,198.00","formatted_with_symbol":"$1,198.00","formatted_with_code":"1,198.00 USD"},"line_total_with_tax":{"raw":1290.85,"formatted":"1,290.85","formatted_with_symbol":"$1,290.85","formatted_with_code":"1,290.85 USD"},"variant":{"id":"vrnt_J0egY5ePpo3QnA","sku":null,"description":null,"price":{"raw":599,"formatted":"599.00","formatted_with_symbol":"$599.00","formatted_with_code":"599.00 USD"}},"selected_options":[{"group_id":"vgrp_VKXmwDE6eorgDA","group_name":"Pot Style","option_id":"optn_O3bR5Xymglnzdj","option_name":"Black Mid-Century Ceramic & Light Wood Stand"}],"tax":{"is_taxable":true,"amount":{"raw":92.85,"formatted":"92.85","formatted_with_symbol":"$92.85","formatted_with_code":"92.85 USD"},"taxable_amount":{"raw":1198,"formatted":"1,198.00","formatted_with_symbol":"$1,198.00","formatted_with_code":"1,198.00 USD"},"rate":0.08,"rate_percentage":"8%","breakdown":[{"amount":{"raw":71.88,"formatted":"71.88","formatted_with_symbol":"$71.88","formatted_with_code":"71.88 USD"},"rate":0.06,"rate_percentage":"6%","type":"state"},{"amount":{"raw":0,"formatted":"0.00","formatted_with_symbol":"$0.00","formatted_with_code":"0.00 USD"},"rate":0,"rate_percentage":"0%","type":"city"},{"amount":{"raw":3,"formatted":"3.00","formatted_with_symbol":"$3.00","formatted_with_code":"3.00 USD"},"rate":0,"rate_percentage":"0%","type":"county"},{"amount":{"raw":17.97,"formatted":"17.97","formatted_with_symbol":"$17.97","formatted_with_code":"17.97 USD"},"rate":0.02,"rate_percentage":"2%","type":"district"}]},"image":{"id":"ast_Kvg9l6mOq51bB7","url":"https:\/\/cdn.chec.io\/merchants\/10892\/images\/538996fe9e6a7fdc717b2e713b60ee44f30822e75a0e061eec4c9|fid.jpg","description":null,"is_image":true,"filename":"","file_size":323759,"file_extension":"","image_dimensions":{"width":2000,"height":1332},"meta":[],"created_at":1510868528,"updated_at":1605932937}},{"id":"item_A12JwrBOBywPjn","product_id":"prod_4WJvlKZMx5bYV1","product_name":"Moisture Meter","product_sku":null,"quantity":1,"price":{"raw":24,"formatted":"24.00","formatted_with_symbol":"$24.00","formatted_with_code":"24.00 USD"},"line_total":{"raw":24,"formatted":"24.00","formatted_with_symbol":"$24.00","formatted_with_code":"24.00 USD"},"line_total_with_tax":{"raw":25.86,"formatted":"25.86","formatted_with_symbol":"$25.86","formatted_with_code":"25.86 USD"},"variant":{"id":"vrnt_BkyN5YD0bRo0b6","sku":null,"description":null,"price":{"raw":24,"formatted":"24.00","formatted_with_symbol":"$24.00","formatted_with_code":"24.00 USD"}},"selected_options":[{"group_id":"vgrp_eN1ql9q9Blz3ym","group_name":"Pot Style","option_id":"optn_4OANwRQ6blvYL8","option_name":"Small"}],"tax":{"is_taxable":true,"amount":{"raw":1.86,"formatted":"1.86","formatted_with_symbol":"$1.86","formatted_with_code":"1.86 USD"},"taxable_amount":{"raw":24,"formatted":"24.00","formatted_with_symbol":"$24.00","formatted_with_code":"24.00 USD"},"rate":0.08,"rate_percentage":"8%","breakdown":[{"amount":{"raw":1.44,"formatted":"1.44","formatted_with_symbol":"$1.44","formatted_with_code":"1.44 USD"},"rate":0.06,"rate_percentage":"6%","type":"state"},{"amount":{"raw":0,"formatted":"0.00","formatted_with_symbol":"$0.00","formatted_with_code":"0.00 USD"},"rate":0,"rate_percentage":"0%","type":"city"},{"amount":{"raw":0.06,"formatted":"0.06","formatted_with_symbol":"$0.06","formatted_with_code":"0.06 USD"},"rate":0,"rate_percentage":"0%","type":"county"},{"amount":{"raw":0.36,"formatted":"0.36","formatted_with_symbol":"$0.36","formatted_with_code":"0.36 USD"},"rate":0.02,"rate_percentage":"2%","type":"district"}]},"image":null}],"discount":[],"giftcard":[]},"shipping":{"name":"Jeff Waddle","street":"73342 Tamarisk Street","street_2":null,"town_city":"Palm Desert","postal_zip_code":"92260","county_state":"CA","country":"US","meta":null},"billing":[],"transactions":[{"id":"trns_ypbroExPR8w8n4","type":"charge","status":"complete","status_reason":"complete","charge_date":1634768370,"gateway":"stripe","gateway_name":"Stripe","gateway_transaction_id":"ch_3Jmn88EzwC22Img60VGBIkgc","gateway_customer_id":"cus_KRgVDZnEnRzEty","gateway_reference":"3373","notes":"","amount":{"raw":1415.71,"formatted":"1,415.71","formatted_with_symbol":"1,415.71","formatted_with_code":"1,415.71 usd"},"payment_source_type":"card","payment_source":{"brand":"mastercard","country":"US","billing_zip_postal_code":"10027"},"meta":null,"created":1634768370,"updated":1634768370,"dunning":{"is_dunning":false,"failed_attempts":0,"last_failed_attempt":null,"next_attempt":null}}],"fulfillment":{"physical":{"items":[{"id":"ful_r2LM5QGy1mwZV1","shipping_method_id":"ship_8XO3wp7rxlYAzQ","line_item_id":"item_bO6J5a8O8AoEjp","product_id":"prod_4OANwRLdk5vYL8","shipping_description":"Delivery Fee","provider":"chec","provider_type":"native_shipping","product_name":"Fiddle Leaf Fig Tree - Extra Large","status":"not_fulfilled","quantity":{"total":2,"fulfilled":0,"remaining":2},"quantity_fulfilled":0,"quantity_remaining":2,"last_updated":1634768367,"linked_shipments":[],"selected_options":[{"group_id":"vgrp_VKXmwDE6eorgDA","group_name":"Pot Style","option_id":"optn_O3bR5Xymglnzdj","option_name":"Black Mid-Century Ceramic & Light Wood Stand"}]},{"id":"ful_NXELwj1qKel3A4","shipping_method_id":"ship_8XO3wp7rxlYAzQ","line_item_id":"item_A12JwrBOBywPjn","product_id":"prod_4WJvlKZMx5bYV1","shipping_description":"Delivery Fee","provider":"chec","provider_type":"native_shipping","product_name":"Moisture Meter","status":"not_fulfilled","quantity":{"total":1,"fulfilled":0,"remaining":1},"quantity_fulfilled":0,"quantity_remaining":1,"last_updated":1634768367,"linked_shipments":[],"selected_options":[{"group_id":"vgrp_eN1ql9q9Blz3ym","group_name":"Pot Style","option_id":"optn_4OANwRQ6blvYL8","option_name":"Small"}]}],"shipments":[]},"digital":{"downloads":[]}},"customer":{"id":"cstmr_7ZAMo1Q9ZxoNJ4","external_id":null,"firstname":"Jeff","lastname":"Waddle","email":"jdwinnyc@gmail.com","phone":null,"meta":[],"created":1634768264,"updated":1634768264},"extra_fields":[{"id":"extr_7RyWOwmapwnEa2","name":"This is a Gift","type":"checkbox","required":false,"value":null},{"id":"extr_1ypbroEm7o8n4e","name":"Your Gift Message","type":"text","required":false,"value":null},{"id":"extr_dKvg9l6Xro1bB7","name":"Delivery Date","type":"date","required":false,"value":"2021-10-26"},{"id":"extr_GNqKE50vLwdgBL","name":"Preferred Delivery Time","type":"options","required":false,"value":null},{"id":"extr_LkpnNwAm9wmXB3","name":"Delivery Instructions","type":"text","required":false,"value":null},{"id":"extr_L8XO3wpJW5YAzQ","name":"Phone Number","type":"text","required":true,"value":"6466445191"},{"id":"extr_LbO6J5a985EjpK","name":"market","type":"hidden","required":false,"value":"us-us"},{"id":"extr_xA12JwrWMoPjnk","name":"hear_about_us","type":"hidden","required":false,"value":null},{"id":"extr_bOp1YoV9DwXLv9","name":"utm_medium","type":"hidden","required":false,"value":null},{"id":"extr_M4WJvlKL9wbYV1","name":"utm_source","type":"hidden","required":false,"value":null},{"id":"extr_3zkK6oLGewXn0Q","name":"utm_content","type":"hidden","required":false,"value":null},{"id":"extr_aDWy4oGaql6Jx2","name":"utm_campaign","type":"hidden","required":false,"value":null},{"id":"extr_7RyWOwm2MonEa2","name":"affiliate_id","type":"hidden","required":false,"value":null},{"id":"extr_1ypbroEA8o8n4e","name":"referrer","type":"hidden","required":false,"value":null},{"id":"extr_dKvg9l6n2l1bB7","name":"county","type":"hidden","required":false,"value":null},{"id":"extr_GNqKE50n1wdgBL","name":"notes","type":"hidden","required":false,"value":null},{"id":"extr_L8XO3wpJA5YAzQ","name":"shipping_method","type":"hidden","required":false,"value":"shipping"},{"id":"extr_aDWy4oG3Yo6Jx2","name":"is_gift_card","type":"hidden","required":false,"value":null},{"id":"extr_jVKXmwDZV5rgDA","name":"has_insurance","type":"hidden","required":false,"value":null},{"id":"extr_R4OANwRjzwvYL8","name":"serviceLevel","type":"hidden","required":false,"value":null},{"id":"extr_31q0o3Lz45DdjR","name":"shipping_date","type":"date","required":false,"value":null},{"id":"extr_8XO3wpdA7wYAzQ","name":"is_shipping_scheduled","type":"hidden","required":false,"value":"false"},{"id":"extr_NXELwjdge53A4p","name":"this-is-a-b2c-order","type":"checkbox","required":false,"value":null},{"id":"extr_aZWNoyvRE580JA","name":"company_name","type":"text","required":false,"value":null}],"client_details":{"ip_address":"2603:8001:2740:865c:5dca:b828:bd55:4446","country_code":"US","country_name":"United States","region_code":"","region_name":"","city":"","postal_zip_code":"","_copyright":"This location was calculated using GeoLite2 data created by MaxMind - http:\/\/www.maxmind.com"},"tax":{"amount":{"raw":94.71,"formatted":"94.71","formatted_with_symbol":"$94.71","formatted_with_code":"94.71 USD"},"included_in_price":false,"provider":"chec","provider_type":"native","breakdown":[{"amount":{"raw":73.32,"formatted":"73.32","formatted_with_symbol":"$73.32","formatted_with_code":"73.32 USD"},"type":"state"},{"amount":{"raw":0,"formatted":"0.00","formatted_with_symbol":"$0.00","formatted_with_code":"0.00 USD"},"type":"city"},{"amount":{"raw":3.06,"formatted":"3.06","formatted_with_symbol":"$3.06","formatted_with_code":"3.06 USD"},"type":"county"},{"amount":{"raw":18.33,"formatted":"18.33","formatted_with_symbol":"$18.33","formatted_with_code":"18.33 USD"},"type":"district"}],"zone":{"country":"US","region":"CA","postal_zip_code":"92260","ip_address":null}},"adjustments":[]},
    "merchant": {
      "id": 17931,
      "status": "active",
      "country": "US",
      "currency": {
        "symbol": "£",
        "code": "GBP"
      },
      "has": {
        "logo": true,
        "cover": false,
        "analytics": false,
        "enabled_hosted_checkouts": true,
        "enabled_hosted_storefront": true,
        "business_description": true
      },
      "support_email": "robbie@chec.io",
      "logo_shape": null,
      "intercom": true,
      "analytics": {
        "google": {
          "settings": {
            "tracking_id": null,
            "linked_domains": null
          }
        }
      },
      "address": {
        "street": "123 fae",
        "city": "test",
        "region": "AL",
        "country": "US",
        "postal_zip_code": "94107",
        "public": true
      },
      "billing": {
        "has_payment_method": true,
        "plan": "Pro",
        "features": {
          "rays": 3,
          "variants": 600
        },
        "usage": {
          "rays": 1
        }
      },
      "primary_interest": null,
      "statistics": {
        "orders": 70,
        "test_orders": 2,
        "products": 37,
        "shipping_zones": 4,
        "tax_rates": 1,
        "rays": 1,
        "has_payment_gateway": true
      },
      "notifications": {
        "token": "0rmHwOz8yiY4UyBIqol2gZIZEbCk6wo32H5yrRGT",
        "dashboard": "quiet"
      },
      "cors_domains": [],
      "business_name": "RobbieViaFace",
      "business_description": "<p><\/p>",
      "logo": "https:\/\/cdn-stage.chec.io\/merchants\/17931\/assets\/hy2vj16uu22vSVtE|mo un ta ins.webp",
      "cover": null,
      "images": {
        "logo": {
          "id": "ast_NXELwj19Qpl3A4",
          "url": "https:\/\/cdn-stage.chec.io\/merchants\/17931\/assets\/hy2vj16uu22vSVtE|mo un ta ins.webp",
          "description": null,
          "is_image": true,
          "filename": "mo un ta ins.webp",
          "file_size": 30320,
          "file_extension": "webp",
          "image_dimensions": {
            "width": 550,
            "height": 368
          },
          "meta": [],
          "created_at": 1631554267,
          "updated_at": 1631554270
        },
        "cover": null
      }
    }
  };



  return {
    statusCode: 200,
    body: JSON.stringify(await context.merchant()),
  };
}
