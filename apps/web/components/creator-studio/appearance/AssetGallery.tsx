'use client';

import {
  ChevronRight,
  ImageIcon,
  Plus,
} from 'lucide-react';

import { mockAssets } from './config';

export function AssetGallery() {
  return (
    <section className="rounded-[24px] border border-white/[0.09] bg-white/[0.025] p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Asset Gallery
          </h3>

          <p className="mt-1 text-xs text-white/35">
            Generated companion assets.
          </p>
        </div>

        <button
          type="button"
          aria-label="Add asset"
          className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/50 transition hover:bg-white/[0.08]"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {mockAssets.map((asset) => (
          <button
            key={asset.id}
            type="button"
            className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-black/15 p-3 text-left transition hover:border-white/[0.13] hover:bg-white/[0.035]"
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-fuchsia-500/15 to-violet-500/5">
              <ImageIcon className="size-4 text-white/25" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white/70">
                {asset.title}
              </p>

              <p className="mt-1 text-[10px] text-white/30">
                Version {asset.version}
              </p>
            </div>

            {asset.status === 'current' ? (
              <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                Current
              </span>
            ) : null}

            <ChevronRight className="size-4 text-white/20 transition group-hover:text-white/55" />
          </button>
        ))}
      </div>
    </section>
  );
}