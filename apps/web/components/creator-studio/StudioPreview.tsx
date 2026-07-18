import { MessageCircle, MoreHorizontal, Sparkles } from 'lucide-react';

import type { CompanionDraft } from './types';

type StudioPreviewProps = {
  companion: CompanionDraft;
};

export function StudioPreview({ companion }: StudioPreviewProps) {
  return (
    <aside className="border-t border-white/[0.08] bg-[#0d0a12] p-5 lg:border-l lg:border-t-0 xl:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">
            Live Preview
          </p>

          <p className="mt-1 text-sm text-white/50">Companion profile</p>
        </div>

        <button
          type="button"
          aria-label="Preview options"
          className="grid size-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/35 transition hover:text-white"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#120d18] shadow-[0_26px_80px_rgba(0,0,0,0.28)]">
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-fuchsia-500/30 via-violet-500/20 to-indigo-500/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.16),transparent_42%)]" />

          <div className="absolute inset-0 grid place-items-center">
            <div className="grid size-28 place-items-center rounded-full border border-white/15 bg-black/15 text-white/65 shadow-[0_0_60px_rgba(217,70,239,0.18)] backdrop-blur-xl">
              <Sparkles className="size-10" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#120d18] to-transparent" />

          <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55 backdrop-blur-xl">
            {companion.category}
          </span>
        </div>

        <div className="p-5">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">{companion.name}</h2>

          <p className="mt-1 text-sm text-fuchsia-100/55">{companion.tagline}</p>

          <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
              <MessageCircle className="size-3.5" />
              Greeting
            </div>

            <p className="mt-3 text-sm leading-6 text-white/60">“{companion.greeting}”</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {companion.traits.map((trait) => (
              <span
                key={trait}
                className="border-fuchsia-200/12 rounded-full border bg-fuchsia-300/[0.055] px-3 py-1.5 text-xs text-fuchsia-100/65"
              >
                {trait}
              </span>
            ))}
          </div>

          <button
            type="button"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100"
          >
            <MessageCircle className="size-4" />
            Preview conversation
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-xs leading-5 text-white/25">
        The preview will update live as you edit the companion.
      </p>
    </aside>
  );
}
