import { Check, Eye, MoreHorizontal, Save, Sparkles } from 'lucide-react';

type StudioHeaderProps = {
  companionName: string;
};

export function StudioHeader({ companionName }: StudioHeaderProps) {
  return (
    <header className="bg-[#0c0910]/88 flex flex-col gap-5 border-b border-white/[0.08] px-5 py-5 backdrop-blur-xl sm:px-7 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-fuchsia-200/60">
          <Sparkles className="size-3.5" />
          Creator Studio
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="truncate text-2xl font-semibold tracking-[-0.04em] text-white">
            {companionName}
          </h1>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-emerald-100/70">
            <Check className="size-3" />
            Draft saved
          </span>
        </div>

        <p className="mt-1 text-sm text-white/35">
          Build the identity, appearance, and intelligence of your companion.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-label="More studio actions"
          className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.035] text-white/45 transition hover:bg-white/[0.07] hover:text-white"
        >
          <MoreHorizontal className="size-4" />
        </button>

        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/65 transition hover:bg-white/[0.08] hover:text-white"
        >
          <Eye className="size-4" />
          Preview chat
        </button>

        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100"
        >
          <Save className="size-4" />
          Save draft
        </button>
      </div>
    </header>
  );
}
