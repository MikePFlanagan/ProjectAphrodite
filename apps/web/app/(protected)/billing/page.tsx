import { CreditCard, Sparkles } from 'lucide-react';

export default function BillingPage() {
  return (
    <section className="rounded-[32px] border border-white/[0.09] bg-gradient-to-br from-fuchsia-400/[0.1] to-white/[0.025] p-8 sm:p-10">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200/60">
        <CreditCard className="size-4" />
        Billing
      </div>

      <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
        Premium plans are coming next.
      </h1>

      <p className="mt-4 max-w-xl text-sm leading-6 text-white/45">
        Subscription management, usage limits, and premium access will live here.
      </p>

      <div className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-fuchsia-200/15 bg-fuchsia-300/[0.08] px-4 py-3 text-sm text-fuchsia-100">
        <Sparkles className="size-4" />
        Free plan active
      </div>
    </section>
  );
}
