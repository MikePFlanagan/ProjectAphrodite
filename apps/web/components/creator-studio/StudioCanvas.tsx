import { ArrowRight, Construction, Sparkles } from 'lucide-react';

import { sectionPlaceholderContent } from './config';
import type { StudioSectionId } from './types';

type StudioCanvasProps = {
  activeSection: StudioSectionId;
};

export function StudioCanvas({ activeSection }: StudioCanvasProps) {
  const content = sectionPlaceholderContent[activeSection];

  const Icon = content.icon;

  return (
    <main className="min-w-0 bg-[#09070d] p-5 sm:p-7 xl:p-8">
      <section className="mx-auto max-w-3xl">
        <div className="flex items-start gap-4">
          <div className="border-fuchsia-200/12 grid size-12 shrink-0 place-items-center rounded-2xl border bg-fuchsia-300/[0.075] text-fuchsia-100">
            <Icon className="size-5" />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fuchsia-200/55">
              {content.eyebrow}
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
              {content.title}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">{content.description}</p>
          </div>
        </div>

        {activeSection === 'identity' ? (
          <IdentityCanvasPlaceholder />
        ) : activeSection === 'appearance' ? (
          <AppearanceCanvasPlaceholder />
        ) : (
          <GenericCanvasPlaceholder sectionTitle={content.title} />
        )}
      </section>
    </main>
  );
}

function IdentityCanvasPlaceholder() {
  return (
    <div className="mt-8 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <PlaceholderField label="Character name" value="New Companion" />

        <PlaceholderField label="Category" value="Friendly" />
      </div>

      <PlaceholderField label="Tagline" value="An original Aphrodite companion" />

      <div className="rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-5">
        <p className="text-xs font-medium text-white/55">Description</p>

        <div className="text-white/32 mt-3 min-h-28 rounded-xl border border-white/[0.08] bg-black/15 p-4 text-sm leading-6">
          Tell creators and users what makes this companion distinct.
        </div>
      </div>

      <div className="rounded-[22px] border border-dashed border-fuchsia-200/15 bg-fuchsia-300/[0.035] p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-fuchsia-200" />

          <div>
            <p className="text-sm font-medium text-white">Identity editor comes next</p>

            <p className="mt-1 text-xs leading-5 text-white/35">
              The next milestone turns these placeholders into live fields connected to the
              companion preview.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppearanceCanvasPlaceholder() {
  return (
    <div className="mt-8">
      <div className="border-fuchsia-200/12 rounded-[26px] border bg-gradient-to-br from-fuchsia-300/[0.07] via-violet-300/[0.025] to-transparent p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-fuchsia-200/50">
          Full creation workflow
        </p>

        <h3 className="mt-2 text-xl font-semibold text-white">Appearance Generator</h3>

        <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
          This canvas will contain the complete generation interface: modes, models, uploads,
          prompt, aspect ratio, output count, generation history, and results.
        </p>

        <button
          type="button"
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/65"
        >
          Planned for Creator Studio Alpha
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

function GenericCanvasPlaceholder({ sectionTitle }: { sectionTitle: string }) {
  return (
    <div className="mt-8 grid min-h-[420px] place-items-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.018] p-8 text-center">
      <div>
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-white/[0.04] text-white/40">
          <Construction className="size-5" />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-white">{sectionTitle}</h3>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/35">
          The Creator Studio shell is ready. This specialized editor will plug into the canvas in a
          later milestone.
        </p>
      </div>
    </div>
  );
}

function PlaceholderField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-5">
      <p className="text-xs font-medium text-white/55">{label}</p>

      <div className="mt-3 rounded-xl border border-white/[0.08] bg-black/15 px-4 py-3 text-sm text-white/50">
        {value}
      </div>
    </div>
  );
}
