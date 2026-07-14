'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BadgeDollarSign,
  Compass,
  Heart,
  LayoutDashboard,
  MessageCirclePlus,
  Settings,
  Sparkles,
  Stars,
} from 'lucide-react';

const navigation = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/explore',
    label: 'Explore',
    icon: Compass,
  },
  {
    href: '/favorites',
    label: 'Favorites',
    icon: Heart,
  },
  {
    href: '/creator',
    label: 'Creator Studio',
    icon: Stars,
  },
  {
    href: '/billing',
    label: 'Billing',
    icon: BadgeDollarSign,
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col border-r border-white/[0.08] bg-[#0d0a12] lg:flex">
      <div className="flex h-20 items-center border-b border-white/[0.08] px-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-400 via-violet-500 to-indigo-500 shadow-[0_0_30px_rgba(217,70,239,0.22)]">
            <Sparkles className="size-5 text-white" />
          </span>

          <div>
            <p className="font-semibold tracking-tight text-white">
              Aphrodite
            </p>
            <p className="text-xs text-white/35">
              AI companion workspace
            </p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <Link
          href="/explore"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#160d1e] shadow-[0_10px_35px_rgba(255,255,255,0.08)] transition hover:bg-fuchsia-100"
        >
          <MessageCirclePlus className="size-4" />
          Start a new conversation
        </Link>

        <nav className="mt-7 space-y-1">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/25">
            Workspace
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active
                    ? 'bg-fuchsia-300/[0.12] text-fuchsia-100'
                    : 'text-white/48 hover:bg-white/[0.045] hover:text-white'
                }`}
              >
                <span
                  className={`grid size-8 place-items-center rounded-lg transition ${
                    active
                      ? 'bg-fuchsia-300/[0.12]'
                      : 'bg-white/[0.025] group-hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className="size-4" />
                </span>

                <span>{item.label}</span>

                {active ? (
                  <span className="ml-auto size-1.5 rounded-full bg-fuchsia-300 shadow-[0_0_10px_rgba(240,171,252,0.8)]" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between px-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/25">
              Recent chats
            </p>

            <Link
              href="/dashboard"
              className="text-xs text-fuchsia-200/60 transition hover:text-fuchsia-100"
            >
              View all
            </Link>
          </div>

          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm text-white/45">
              Your conversations will appear here.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.08] p-4">
        <div className="rounded-2xl border border-fuchsia-200/15 bg-gradient-to-br from-fuchsia-300/[0.09] to-violet-400/[0.04] p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-fuchsia-200" />
            <p className="text-sm font-medium text-white">
              Free plan
            </p>
          </div>

          <p className="mt-2 text-xs leading-5 text-white/40">
            Explore companions and begin meaningful conversations.
          </p>

          <Link
            href="/billing"
            className="mt-4 block rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2 text-center text-xs font-semibold text-white/75 transition hover:bg-white/[0.1] hover:text-white"
          >
            View plans
          </Link>
        </div>
      </div>
    </aside>
  );
}
