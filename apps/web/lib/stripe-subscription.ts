import type Stripe from 'stripe';

import { db } from '@aphrodite/database';

import { premiumPriceId } from '@/lib/stripe';

function subscriptionStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case 'active':
      return 'ACTIVE' as const;
    case 'trialing':
      return 'TRIALING' as const;
    case 'past_due':
    case 'unpaid':
    case 'paused':
      return 'PAST_DUE' as const;
    case 'incomplete':
      return 'INCOMPLETE' as const;
    case 'canceled':
    case 'incomplete_expired':
      return 'CANCELED' as const;
  }
}

function customerId(subscription: Stripe.Subscription) {
  return typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;
}

function periodEnd(subscription: Stripe.Subscription) {
  const timestamp = Math.max(0, ...subscription.items.data.map((item) => item.current_period_end));

  return timestamp ? new Date(timestamp * 1000) : null;
}

export async function synchronizeStripeSubscription(
  subscription: Stripe.Subscription,
  providedUserId?: string | null,
) {
  const stripeCustomerId = customerId(subscription);
  const storedSubscription = await db.subscription.findFirst({
    where: {
      OR: [
        { stripeSubscriptionId: subscription.id },
        { stripeCustomerId },
        ...(providedUserId ? [{ userId: providedUserId }] : []),
      ],
    },
    select: { userId: true },
  });
  const userId =
    providedUserId ?? subscription.metadata.aphroditeUserId ?? storedSubscription?.userId;

  if (!userId) {
    throw new Error(`Unable to associate Stripe subscription ${subscription.id} with a user.`);
  }

  const stripePriceId = subscription.items.data[0]?.price.id ?? null;
  const status = subscriptionStatus(subscription.status);
  const plan =
    stripePriceId === premiumPriceId() && ['ACTIVE', 'TRIALING'].includes(status)
      ? ('PREMIUM' as const)
      : ('FREE' as const);

  await db.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan,
      status,
      stripeCustomerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId,
      currentPeriodEnd: periodEnd(subscription),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    update: {
      plan,
      status,
      stripeCustomerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId,
      currentPeriodEnd: periodEnd(subscription),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}
