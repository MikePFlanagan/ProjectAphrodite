import { Compass, Sparkles } from 'lucide-react';

const links = [
  { href: '#characters', label: 'Explore' },
  { href: '#pricing', label: 'Pricing' },
];

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-[#100c17]/70 px-3 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-4" aria-label="Primary navigation">
        <a href="#top" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-white">
          <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-400 to-violet-500 shadow-[0_0_22px_rgba(196,102,255,0.52)]"><Sparkles className="size-4" /></span>
          Aphrodite
        </a>
        <div className="hidden items-center gap-7 text-sm text-white/60 md:flex">
          {links.map((link) => <a key={link.href} href={link.href} className="transition hover:text-white">{link.label}</a>)}
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3">
          <a href="#login" className="hidden px-3 py-2 text-sm text-white/65 transition hover:text-white sm:block">Login</a>
          <a href="#create" className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-[#160d1e] transition hover:bg-fuchsia-100 sm:text-sm"><Compass className="size-3.5" /> Create account</a>
        </div>
      </nav>
    </header>
  );
}
