import { Check, CreditCard, Sparkles } from 'lucide-react';

import { db } from '@aphrodite/database';

import { dailyMessageLimit, effectivePlan } from '@/lib/chat-usage';
import { requireUser } from '@/lib/require-auth';

const notices: Record<string, string> = {
  success: 'Checkout completed. Your plan will update as soon as Stripe confirms it.',
  canceled: 'Checkout was canceled. No changes were made to your plan.',
  unavailable: 'Billing is temporarily unavailable. Please try again in a moment.',
  'no-customer': 'Start a Premium subscription before opening the billing portal.',
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; billing?: string }>;
}) {
  const user = await requireUser();
  const subscription = await db.subscription.findUnique({ where: { userId: user.id } });
  const plan = effectivePlan(subscription);
  const params = await searchParams;
  const notice = notices[params.checkout ?? params.billing ?? ''];
  const isPremium = plan === 'PREMIUM';

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/[0.09] bg-gradient-to-br from-fuchsia-400/[0.1] to-white/[0.025] p-8 sm:p-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200/60">
          <CreditCard className="size-4" />
          Billing
        </div>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
              Your Aphrodite plan
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
              Upgrade through Stripe Checkout and manage payment details or cancellation in the
              secure billing portal.
            </p>
          </div>
          <div className="rounded-2xl border border-fuchsia-200/15 bg-fuchsia-300/[0.08] px-4 py-3 text-sm text-fuchsia-100">
            {plan} · {dailyMessageLimit(plan).toLocaleString()} messages/day
          </div>
        </div>
        {notice && (
          <p className="mt-6 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-white/70">
            {notice}
          </p>
        )}
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <PlanCard
          name="Free"
          price="$0"
          description="A generous starting point for discovering companions."
          features={['50 messages per day', 'All published companions', 'Saved conversations']}
          current={plan === 'FREE'}
        />
        <PlanCard
          name="Premium"
          price="$19"
          description="More room for longer, richer conversations."
          features={['500 messages per day', 'All Free features', 'Secure self-service billing']}
          current={isPremium}
          featured
          action={
            <form
              action={isPremium ? '/api/billing/portal' : '/api/billing/checkout'}
              method="post"
            >
              <button className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#170d20] transition hover:bg-fuchsia-100">
                <Sparkles className="size-4" />
                {isPremium ? 'Manage subscription' : 'Upgrade with Stripe'}
              </button>
            </form>
          }
        />
      </div>

      {subscription?.currentPeriodEnd && (
        <p className="text-center text-xs text-white/35">
          {subscription.cancelAtPeriodEnd ? 'Access ends' : 'Current period renews'} on{' '}
          {subscription.currentPeriodEnd.toLocaleDateString()}.
        </p>
      )}
    </div>
  );
}

function PlanCard({
  name,
  price,
  description,
  features,
  current,
  featured = false,
  action,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  current: boolean;
  featured?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-[28px] border p-7 ${
        featured
          ? 'border-fuchsia-200/20 bg-fuchsia-300/[0.07]'
          : 'border-white/[0.09] bg-white/[0.03]'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">{name}</h2>
        {current && (
          <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-200">
            Current
          </span>
        )}
      </div>
      <p className="mt-5 text-4xl font-semibold tracking-[-0.05em]">
        {price}
        <span className="ml-1 text-sm font-normal tracking-normal text-white/35">/ month</span>
      </p>
      <p className="mt-3 text-sm leading-6 text-white/45">{description}</p>
      <ul className="mt-6 space-y-3 text-sm text-white/65">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <Check className="size-4 text-fuchsia-200" />
            {feature}
          </li>
        ))}
      </ul>
      {action}
    </section>
  );
}
