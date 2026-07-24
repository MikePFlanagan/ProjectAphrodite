import { NextResponse } from 'next/server';

import { db } from '@aphrodite/database';

import { auth } from '@/auth';
import {
  applicationUrl,
  getStripe,
  isBillingConfigured,
  isTrustedBillingRequest,
  premiumPriceId,
} from '@/lib/stripe';

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isTrustedBillingRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  }

  if (!isBillingConfigured()) {
    return NextResponse.redirect(`${applicationUrl()}/billing?billing=unavailable`, 303);
  }

  const stripe = getStripe();
  const appUrl = applicationUrl();
  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
  });

  try {
    let stripeCustomerId = subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name ?? undefined,
        metadata: { aphroditeUserId: session.user.id },
      });
      stripeCustomerId = customer.id;

      await db.subscription.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          stripeCustomerId,
        },
        update: { stripeCustomerId },
      });
    }

    if (
      subscription?.stripeSubscriptionId &&
      ['ACTIVE', 'TRIALING', 'PAST_DUE'].includes(subscription.status)
    ) {
      const portal = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${appUrl}/billing`,
      });
      return NextResponse.redirect(portal.url, 303);
    }

    const checkout = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeCustomerId,
      client_reference_id: session.user.id,
      line_items: [{ price: premiumPriceId(), quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${appUrl}/billing?checkout=success`,
      cancel_url: `${appUrl}/billing?checkout=canceled`,
      metadata: { aphroditeUserId: session.user.id },
      subscription_data: {
        metadata: { aphroditeUserId: session.user.id },
      },
    });

    if (!checkout.url) {
      throw new Error('Stripe did not return a Checkout URL.');
    }

    return NextResponse.redirect(checkout.url, 303);
  } catch (error) {
    console.error('Unable to start Stripe Checkout:', error);
    return NextResponse.redirect(`${appUrl}/billing?billing=unavailable`, 303);
  }
}
