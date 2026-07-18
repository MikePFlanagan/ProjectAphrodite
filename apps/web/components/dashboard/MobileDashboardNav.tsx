import Link from 'next/link';
import { Compass, Heart, LayoutDashboard, MessagesSquare } from 'lucide-react';
export function MobileDashboardNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-2xl border border-white/10 bg-[#160f1e]/90 p-2 backdrop-blur-lg lg:hidden">
      <Link
        href="/dashboard"
        aria-label="Dashboard"
        className="grid size-10 place-items-center text-white/70"
      >
        <LayoutDashboard className="size-5" />
      </Link>
      <Link
        href="/explore"
        aria-label="Explore"
        className="grid size-10 place-items-center text-white/70"
      >
        <Compass className="size-5" />
      </Link>
      <Link
        href="/conversations"
        aria-label="Conversations"
        className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-400 to-violet-500 text-white"
      >
        <MessagesSquare className="size-5" />
      </Link>
      <Link
        href="/favorites"
        aria-label="Favorites"
        className="grid size-10 place-items-center text-white/70"
      >
        <Heart className="size-5" />
      </Link>
    </nav>
  );
}
