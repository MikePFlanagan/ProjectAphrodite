'use client';

import {
  Check,
  History,
  RotateCcw,
  Sprout,
} from 'lucide-react';

import { mockVersions } from './config';

export function CreationJourney() {
  return (
    <section className="rounded-[24px] border border-white/[0.09] bg-white/[0.025] p-4">
      <div className="flex items-start gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-fuchsia-200/10 bg-fuchsia-300/[0.07] text-fuchsia-100">
          <History className="size-4" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            Creation Journey
          </h3>

          <p className="mt-1 text-xs leading-5 text-white/32">
            Earlier looks remain safely available.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {mockVersions.map((version, index) => {
          const isGenesis =
            index === mockVersions.length - 1;

          return (
            <div
              key={version.id}
              className={`rounded-xl border p-3 ${
                version.current
                  ? 'border-fuchsia-200/16 bg-fuchsia-300/[0.055]'
                  : 'border-white/[0.07] bg-black/15'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-lg ${
                      isGenesis
                        ? 'bg-emerald-300/[0.08] text-emerald-200'
                        : 'bg-white/[0.04] text-white/35'
                    }`}
                  >
                    {isGenesis ? (
                      <Sprout className="size-3.5" />
                    ) : version.current ? (
                      <Check className="size-3.5" />
                    ) : (
                      <History className="size-3.5" />
                    )}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-white/65">
                      {isGenesis
                        ? 'Genesis'
                        : version.current
                          ? 'Current Look'
                          : version.label}
                    </p>

                    <p className="mt-1 text-[10px] text-white/27">
                      {isGenesis
                        ? 'The original beginning'
                        : version.current
                          ? 'Used by your companion now'
                          : 'An earlier creation'}
                    </p>
                  </div>
                </div>

                {version.current ? (
                  <span className="rounded-full bg-emerald-300/[0.08] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-emerald-100/65">
                    Current
                  </span>
                ) : (
                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[10px] font-medium text-white/45 transition hover:border-fuchsia-200/15 hover:bg-fuchsia-300/[0.06] hover:text-white"
                  >
                    <RotateCcw className="size-3" />
                    Make current
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] leading-5 text-white/24">
        Choosing an earlier look will not remove anything created afterward.
      </p>
    </section>
  );
}