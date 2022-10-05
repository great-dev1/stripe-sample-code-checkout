// This is your test secret API key.
const stripe = require('stripe')('sk_test_51LoqrXJW0rgLqrhCQT1MWOpbF9ERWSpIQoClwZMZwakjFCkB7M0wdfn0w2vrIgB2OLgppwecuO55xukHl4hXvrOK00lHM2BA5p');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:8080';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
      // {
      //   price: 'price_1LpGVaJW0rgLqrhCf7vZykOY',
      //   quantity: 1,
      // },
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 45000,
        },
        quantity: 2,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_5e659459f7d91882046edab8be75422cda1d45a425c9472ff841e1d59e56960a";

app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.listen(8080, () => console.log('Running on port 8080'));
