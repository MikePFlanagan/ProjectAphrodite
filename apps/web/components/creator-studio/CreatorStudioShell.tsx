'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { defaultCompanionDraft, studioSections } from './config';
import { StudioCanvas } from './StudioCanvas';
import { StudioHeader } from './StudioHeader';
import { StudioPreview } from './StudioPreview';
import { StudioSidebar } from './StudioSidebar';
import type { CompanionDraft, DraftSaveStatus, StudioSectionId } from './types';

export function CreatorStudioShell() {
  const [activeSection, setActiveSection] = useState<StudioSectionId>('identity');
  const [companion, setCompanion] = useState<CompanionDraft>(defaultCompanionDraft);
  const [saveStatus, setSaveStatus] = useState<DraftSaveStatus>('loading');
  const lastSavedRef = useRef('');
  const companionRef = useRef(companion);

  useEffect(() => {
    companionRef.current = companion;
  }, [companion]);

  useEffect(() => {
    let active = true;

    async function loadDraft() {
      try {
        const response = await fetch('/api/creator/draft');
        if (!response.ok) throw new Error('Could not load draft.');
        const data = (await response.json()) as { draft: CompanionDraft };
        if (!active) return;
        setCompanion(data.draft);
        companionRef.current = data.draft;
        lastSavedRef.current = serializeDraft(data.draft);
        setSaveStatus('saved');
      } catch {
        if (active) setSaveStatus('error');
      }
    }

    void loadDraft();
    return () => {
      active = false;
    };
  }, []);

  const saveDraft = useCallback(async () => {
    const draft = companionRef.current;
    const serialized = serializeDraft(draft);
    if (!draft.id || serialized === lastSavedRef.current) return;

    setSaveStatus('saving');
    try {
      const response = await fetch('/api/creator/draft', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!response.ok) throw new Error('Could not save draft.');
      lastSavedRef.current = serialized;
      setSaveStatus(serializeDraft(companionRef.current) === serialized ? 'saved' : 'saving');
    } catch {
      setSaveStatus('error');
    }
  }, []);

  useEffect(() => {
    if (!companion.id || serializeDraft(companion) === lastSavedRef.current) return;
    setSaveStatus('saving');
    const timeout = window.setTimeout(() => void saveDraft(), 700);
    return () => window.clearTimeout(timeout);
  }, [companion, saveDraft]);

  return (
    <div className="-m-5 overflow-hidden border-white/[0.08] bg-[#09070d] sm:-m-8 lg:-m-10 lg:border lg:border-t-0">
      <StudioHeader
        companionName={companion.name}
        saveStatus={saveStatus}
        onSave={saveDraft}
        onPreview={() =>
          document.getElementById('companion-preview')?.scrollIntoView({ behavior: 'smooth' })
        }
      />

      <div className="grid min-h-[calc(100vh-10rem)] lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_340px]">
        <StudioSidebar
          sections={studioSections}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          companionName={companion.name}
        />

        <StudioCanvas
          activeSection={activeSection}
          companion={companion}
          onCompanionChange={setCompanion}
        />

        <div id="companion-preview" className="scroll-mt-24 lg:col-span-2 xl:col-span-1">
          <StudioPreview companion={companion} />
        </div>
      </div>
    </div>
  );
}

function serializeDraft(draft: CompanionDraft) {
  return JSON.stringify({
    name: draft.name,
    slug: draft.slug,
    tagline: draft.tagline,
    description: draft.description,
    greeting: draft.greeting,
    category: draft.category,
    traits: draft.traits,
    personality: draft.personality,
    voice: draft.voice,
  });
}
