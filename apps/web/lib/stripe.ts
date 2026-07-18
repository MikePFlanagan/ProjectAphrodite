import Stripe from 'stripe';

let stripeClient: Stripe | undefined;

function requiredEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required for billing.`);
  }

  return value;
}

export function getStripe() {
  stripeClient ??= new Stripe(requiredEnvironmentVariable('STRIPE_SECRET_KEY'), {
    appInfo: {
      name: 'Project Aphrodite',
      version: '0.4.0',
    },
  });

  return stripeClient;
}

export function stripeWebhookSecret() {
  return requiredEnvironmentVariable('STRIPE_WEBHOOK_SECRET');
}

export function premiumPriceId() {
  return requiredEnvironmentVariable('STRIPE_PREMIUM_PRICE_ID');
}

export function applicationUrl() {
  return new URL(requiredEnvironmentVariable('NEXTAUTH_URL')).origin;
}

export function isTrustedBillingRequest(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(applicationUrl()).origin;
}
