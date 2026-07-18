'use client';

import { useState } from 'react';

import { defaultCompanionDraft, studioSections } from './config';
import { StudioCanvas } from './StudioCanvas';
import { StudioHeader } from './StudioHeader';
import { StudioPreview } from './StudioPreview';
import { StudioSidebar } from './StudioSidebar';
import type { StudioSectionId } from './types';

export function CreatorStudioShell() {
  const [activeSection, setActiveSection] = useState<StudioSectionId>('identity');

  return (
    <div className="-m-5 overflow-hidden border-white/[0.08] bg-[#09070d] sm:-m-8 lg:-m-10 lg:border lg:border-t-0">
      <StudioHeader companionName={defaultCompanionDraft.name} />

      <div className="grid min-h-[calc(100vh-10rem)] lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_340px]">
        <StudioSidebar
          sections={studioSections}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          companionName={defaultCompanionDraft.name}
        />

        <StudioCanvas activeSection={activeSection} />

        <div className="lg:col-span-2 xl:col-span-1">
          <StudioPreview companion={defaultCompanionDraft} />
        </div>
      </div>
    </div>
  );
}
