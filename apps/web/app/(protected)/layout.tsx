import { Search, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { MobileDashboardNav } from '@/components/dashboard/MobileDashboardNav';
import { UserMenu } from '@/components/dashboard/UserMenu';
import { requireUser } from '@/lib/require-auth';

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-[#09070d] text-white lg:flex">
      <DashboardSidebar />

      <div className="min-w-0 flex-1 pb-24 lg:pb-0">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.08] bg-[#09070d]/85 px-5 backdrop-blur-xl sm:px-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-200/60">
              <Sparkles className="size-3.5" />
              Private workspace
            </div>

            <p className="mt-1 hidden text-sm text-white/40 sm:block">
              Conversations, companions, and everything you create.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/conversations"
              aria-label="Search"
              className="hidden size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.035] text-white/45 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white sm:grid"
            >
              <Search className="size-4" />
            </Link>

            <UserMenu name={user.name ?? 'Member'} email={user.email} />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] p-5 sm:p-8 lg:p-10">{children}</main>
      </div>

      <MobileDashboardNav />
    </div>
  );
}
