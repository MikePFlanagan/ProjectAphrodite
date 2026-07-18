import Link from 'next/link';

import { MemoryManager } from '@/components/settings/MemoryManager';
import { requireUser } from '@/lib/require-auth';

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold tracking-[0.18em] text-fuchsia-200/70">ACCOUNT</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">Settings</h1>
      <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
        <p className="text-sm font-medium">Profile</p>
        <dl className="mt-5 space-y-4 text-sm">
          <div className="border-white/8 flex justify-between border-b pb-3">
            <dt className="text-white/45">Name</dt>
            <dd>{user.name ?? 'Not set'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/45">Email</dt>
            <dd>{user.email}</dd>
          </div>
        </dl>
      </section>
      <MemoryManager />
      <section
        id="billing"
        className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5"
      >
        <p className="text-sm font-medium">Billing</p>
        <p className="mt-2 text-sm text-white/45">
          View your plan, upgrade, or securely manage payment details through Stripe.
        </p>
        <Link
          href="/billing"
          className="mt-4 inline-flex rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/[0.06]"
        >
          Open billing
        </Link>
      </section>
    </div>
  );
}
