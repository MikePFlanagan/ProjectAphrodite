import Link from 'next/link';
import {
  ArrowRight,
  Brain,
  CreditCard,
  UserRound,
} from 'lucide-react';

import { requireUser } from '@/lib/require-auth';

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold tracking-[0.18em] text-fuchsia-200/70">
        ACCOUNT
      </p>

      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
        Settings
      </h1>

      <p className="mt-3 text-sm leading-6 text-white/45">
        Manage your profile, billing, and what your companions remember.
      </p>

      <div className="mt-10 space-y-4">
        <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-white/[0.05] text-white/65">
              <UserRound className="size-4" />
            </div>

            <div>
              <p className="text-sm font-medium">Profile</p>
              <p className="text-xs text-white/35">
                Your account identity
              </p>
            </div>
          </div>

          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex justify-between border-b border-white/8 pb-3">
              <dt className="text-white/45">Name</dt>
              <dd>{user.name ?? 'Not set'}</dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-white/45">Email</dt>
              <dd>{user.email}</dd>
            </div>
          </dl>
        </section>

        <Link
          href="/settings/memory"
          className="group flex items-center justify-between rounded-2xl border border-fuchsia-200/15 bg-gradient-to-br from-fuchsia-300/[0.08] to-violet-400/[0.035] p-5 transition hover:border-fuchsia-200/25 hover:bg-fuchsia-300/[0.1]"
        >
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-fuchsia-300/[0.1] text-fuchsia-100">
              <Brain className="size-4" />
            </div>

            <div>
              <p className="text-sm font-medium text-white">
                Memory Center
              </p>

              <p className="mt-1 text-xs text-white/40">
                Review what companions remember about you
              </p>
            </div>
          </div>

          <ArrowRight className="size-4 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-white" />
        </Link>

        <section
          id="billing"
          className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
        >
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-white/[0.05] text-white/65">
              <CreditCard className="size-4" />
            </div>

            <div>
              <p className="text-sm font-medium">Billing</p>
              <p className="text-xs text-white/35">
                Subscription and payment settings
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-white/45">
            Subscription management will be added in a future billing phase.
          </p>
        </section>
      </div>
    </div>
  );
}
