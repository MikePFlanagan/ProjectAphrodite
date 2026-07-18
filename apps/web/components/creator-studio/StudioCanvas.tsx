import { Construction } from 'lucide-react';

import { AppearanceStudio } from './appearance/AppearanceStudio';
import { sectionPlaceholderContent } from './config';
import { IdentityEditor } from './IdentityEditor';
import type { CompanionDraft, StudioSectionId } from './types';

type StudioCanvasProps = {
  activeSection: StudioSectionId;
  companion: CompanionDraft;
  onCompanionChange: (companion: CompanionDraft) => void;
};

export function StudioCanvas({ activeSection, companion, onCompanionChange }: StudioCanvasProps) {
  const content = sectionPlaceholderContent[activeSection];

  const Icon = content.icon;

  return (
    <main className="min-w-0 bg-[#09070d] p-5 sm:p-7 xl:p-8">
      <section
        className={activeSection === 'appearance' ? 'mx-auto max-w-7xl' : 'mx-auto max-w-3xl'}
      >
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
          <IdentityEditor companion={companion} onChange={onCompanionChange} />
        ) : activeSection === 'appearance' ? (
          <AppearanceStudio draftId={companion.id} />
        ) : (
          <GenericCanvasPlaceholder sectionTitle={content.title} />
        )}
      </section>
    </main>
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
