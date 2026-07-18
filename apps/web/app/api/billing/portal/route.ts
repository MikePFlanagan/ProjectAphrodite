import { NextResponse } from 'next/server';

import { db } from '@aphrodite/database';

import { auth } from '@/auth';
import { applicationUrl, getStripe, isTrustedBillingRequest } from '@/lib/stripe';

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isTrustedBillingRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  }

  const appUrl = applicationUrl();
  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!subscription?.stripeCustomerId) {
    return NextResponse.redirect(`${appUrl}/billing?billing=no-customer`, 303);
  }

  try {
    const portal = await getStripe().billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${appUrl}/billing`,
    });
    return NextResponse.redirect(portal.url, 303);
  } catch (error) {
    console.error('Unable to open Stripe billing portal:', error);
    return NextResponse.redirect(`${appUrl}/billing?billing=unavailable`, 303);
  }
}
