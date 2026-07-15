'use client';

import { Check, Lock } from 'lucide-react';

import type { CharacterLock } from './types';

type CharacterLockProps = {
  locks: CharacterLock[];
  onToggle: (lockId: string) => void;
};

export function CharacterLockPanel({
  locks,
  onToggle,
}: CharacterLockProps) {
  const enabledCount = locks.filter(
    (lock) => lock.enabled,
  ).length;

  return (
    <section className="rounded-[24px] border border-white/[0.09] bg-white/[0.025] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-fuchsia-200" />

            <h3 className="text-sm font-semibold text-white">
              Preserve Identity
            </h3>
          </div>

          <p className="mt-2 text-xs leading-5 text-white/32">
            Choose which details should remain consistent
            across new generations.
          </p>
        </div>

        <span className="rounded-full border border-white/[0.08] bg-black/15 px-2.5 py-1 text-[10px] font-semibold text-white/35">
          {enabledCount}/{locks.length}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {locks.map((lock) => (
          <button
            key={lock.id}
            type="button"
            onClick={() => onToggle(lock.id)}
            aria-pressed={lock.enabled}
            className="flex w-full items-center justify-between rounded-xl border border-white/[0.07] bg-black/15 px-3 py-2.5 text-left transition hover:border-white/[0.13] hover:bg-white/[0.035]"
          >
            <span className="text-xs text-white/58">
              {lock.label}
            </span>

            <span
              className={`grid size-5 place-items-center rounded-md border transition ${
                lock.enabled
                  ? 'border-fuchsia-200/20 bg-fuchsia-300/[0.12] text-fuchsia-100'
                  : 'border-white/10 bg-white/[0.025] text-transparent'
              }`}
            >
              <Check className="size-3" />
            </span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-[11px] leading-5 text-white/25">
        These controls are visual placeholders for now.
        Provider-level identity preservation comes later.
      </p>
    </section>
  );
}
