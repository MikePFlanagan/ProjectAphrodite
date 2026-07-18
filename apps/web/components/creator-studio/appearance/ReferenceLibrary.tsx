import { ImageIcon } from 'lucide-react';

import { referenceImages } from './config';

export function ReferenceLibrary() {
  return (
    <section className="rounded-[26px] border border-white/[0.09] bg-white/[0.025] p-6">
      <h3 className="text-base font-semibold text-white">Reference Library</h3>
      <p className="mt-1 text-xs leading-5 text-white/35">
        Reference slots define the views used to keep a companion visually consistent.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {referenceImages.map((image) => (
          <div
            key={image.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
          >
            <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-fuchsia-500/10 to-violet-500/5">
              <ImageIcon className="size-10 text-white/20" />
            </div>
            <div className="p-4">
              <h4 className="text-sm font-semibold text-white">{image.title}</h4>
              <p className="mt-1 text-xs text-white/40">{image.description}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[11px] text-white/25">Image upload arrives with asset persistence.</p>
    </section>
  );
}
