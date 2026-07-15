'use client';

import { Eye, Lock, Sparkles } from 'lucide-react';

import type {
  AppearanceAssetType,
  CharacterLock,
} from './types';

type PromptValues = Record<string, string>;

type LivePreviewProps = {
  assetType: AppearanceAssetType;
  promptValues: PromptValues;
  locks: CharacterLock[];
};

export function LivePreview({
  assetType,
  promptValues,
  locks,
}: LivePreviewProps) {
  const promptPreview = Object.values(promptValues)
    .filter((value) => value.trim().length > 0)
    .join(', ');

  const enabledLocks = locks.filter(
    (lock) => lock.enabled,
  );

  return (
    <section className="overflow-hidden rounded-[26px] border border-white/[0.09] bg-white/[0.025]">
      <header className="border-b border-white/[0.08] p-5">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-fuchsia-500/10">
            <Eye className="size-5 text-fuchsia-200" />
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">
              Live Preview
            </h3>

            <p className="mt-1 text-xs text-white/40">
              See exactly what Aphrodite understands before generation.
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-6 p-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
            Asset Type
          </p>

          <div className="mt-2 rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3">
            <p className="text-sm capitalize text-white/75">
              {assetType.replace('-', ' ')}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
            Prompt Preview
          </p>

          <div className="mt-2 rounded-xl border border-white/[0.08] bg-black/20 p-4">
            <p className="text-sm leading-7 text-white/65">
              {promptPreview ||
                'Your prompt will appear here as you build your companion.'}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
            Locked Features
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {enabledLocks.length > 0 ? (
              enabledLocks.map((lock) => (
                <span
                  key={lock.id}
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/65"
                >
                  <Lock className="size-3" />
                  {lock.label}
                </span>
              ))
            ) : (
              <span className="text-xs text-white/35">
                No character locks enabled.
              </span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-emerald-300" />

            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">
              Ready to Create
            </p>
          </div>

          <p className="mt-2 text-xs leading-6 text-white/45">
            Every change updates instantly so you always know what your next
            generation will use.
          </p>
        </div>
      </div>
    </section>
  );
}