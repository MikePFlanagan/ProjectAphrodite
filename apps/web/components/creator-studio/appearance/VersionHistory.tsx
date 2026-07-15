'use client';

import { History, RotateCcw } from 'lucide-react';

import { mockVersions } from './config';

export function VersionHistory() {
  return (
    <section className="rounded-[24px] border border-white/[0.09] bg-white/[0.025] p-4">
      <div className="flex items-center gap-2">
        <History className="size-4 text-white/45" />

        <h3 className="text-sm font-semibold text-white">
          Version History
        </h3>
      </div>

      <p className="mt-2 text-xs leading-5 text-white/32">
        Every generation is saved so you can restore or compare previous
        versions.
      </p>

      <div className="mt-4 space-y-2">
        {mockVersions.map((version) => (
          <div
            key={version.id}
            className="rounded-xl border border-white/[0.07] bg-black/15 p-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white/65">
                  {version.label}
                </p>

                <p className="mt-1 text-[10px] text-white/28">
                  {version.current ? 'Current Version' : 'Previous Version'}
                </p>
              </div>

              {version.current ? (
                <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                  Current
                </span>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-white/45 transition hover:text-white"
                >
                  <RotateCcw className="size-3" />
                  Restore
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}