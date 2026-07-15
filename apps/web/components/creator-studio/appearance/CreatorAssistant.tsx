'use client';

import {
  Lightbulb,
  Sparkles,
  Wand2,
} from 'lucide-react';

const suggestions = [
  'Add a reference portrait for better consistency.',
  'Lock facial features before creating more outfits.',
  'Create a neutral portrait before experimenting.',
  'Keep hairstyles consistent across generations.',
];

export function CreatorAssistant() {
  return (
    <section className="rounded-[24px] border border-fuchsia-200/10 bg-gradient-to-br from-fuchsia-500/[0.06] to-violet-500/[0.03] p-5">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-fuchsia-300/[0.10]">
          <Sparkles className="size-5 text-fuchsia-100" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            Creator Assistant
          </h3>

          <p className="mt-1 text-xs text-white/40">
            Helpful suggestions while creating your companion.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {suggestions.map((tip) => (
          <div
            key={tip}
            className="flex gap-3 rounded-xl border border-white/[0.08] bg-black/15 p-3"
          >
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-300" />

            <p className="text-xs leading-5 text-white/60">
              {tip}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-fuchsia-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-fuchsia-400"
      >
        <Wand2 className="size-4" />
        Suggest Improvements
      </button>
    </section>
  );
}