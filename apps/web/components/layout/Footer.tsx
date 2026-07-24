import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10 sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 font-medium text-white/75">
          <Sparkles className="size-4 text-fuchsia-300" /> Aphrodite
        </div>
        <div className="flex gap-5">
          <a href="/privacy" className="transition hover:text-white">
            Privacy
          </a>
          <a href="/terms" className="transition hover:text-white">
            Terms
          </a>
          <a href="/signup" className="transition hover:text-white">
            Get started
          </a>
        </div>
        <p>© {new Date().getFullYear()} Project Aphrodite</p>
      </div>
    </footer>
  );
}
