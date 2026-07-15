'use client';

import { ImagePlus, ImageIcon } from 'lucide-react';

import { referenceImages } from './config';

export function ReferenceLibrary() {
  return (
    <section className="rounded-[26px] border border-white/[0.09] bg-white/[0.025] p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">
            Reference Library
          </h3>

          <p className="mt-1 text-xs leading-5 text-white/35">
            Reference images help keep your companion visually consistent.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/[0.08]"
        >
          <ImagePlus className="size-4" />
          Upload
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {referenceImages.map((image) => (
          <div
            key={image.id}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-fuchsia-400/30"
          >
            <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-fuchsia-500/10 to-violet-500/5">
              <ImageIcon className="size-10 text-white/20" />
            </div>

            <div className="p-4">
              <h4 className="text-sm font-semibold text-white">
                {image.title}
              </h4>

              <p className="mt-1 text-xs text-white/40">
                {image.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}