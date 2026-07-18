import type Stripe from 'stripe';

import { getStripe, stripeWebhookSecret } from '@/lib/stripe';
import { synchronizeStripeSubscription } from '@/lib/stripe-subscription';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return Response.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      stripeWebhookSecret(),
    );
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error);
    return Response.json({ error: 'Invalid Stripe signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const checkout = event.data.object;
        const subscriptionId =
          typeof checkout.subscription === 'string'
            ? checkout.subscription
            : checkout.subscription?.id;

        if (checkout.mode === 'subscription' && subscriptionId) {
          const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
          await synchronizeStripeSubscription(subscription, checkout.client_reference_id);
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await synchronizeStripeSubscription(event.data.object);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(`Stripe webhook ${event.id} processing failed:`, error);
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 });
  }

  return Response.json({ received: true });
}
