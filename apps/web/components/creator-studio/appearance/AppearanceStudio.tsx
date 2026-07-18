'use client';

import { useState } from 'react';

import { AssetTypePicker } from './AssetTypePicker';
import { CharacterLockPanel } from './CharacterLock';
import { GenerationPreview } from './GenerationPreview';
import { PromptBuilder } from './PromptBuilder';
import { ReferenceLibrary } from './ReferenceLibrary';
import { characterLocks } from './config';
import { generateMockPreview, type MockGenerationResult } from './providers/MockImageProvider';
import type { AppearanceAssetType, CharacterLock } from './types';

export function AppearanceStudio() {
  const [assetType, setAssetType] = useState<AppearanceAssetType>('portrait');
  const [promptValues, setPromptValues] = useState<Record<string, string>>({});
  const [locks, setLocks] = useState<CharacterLock[]>(characterLocks);
  const [result, setResult] = useState<MockGenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  function updatePrompt(field: string, value: string) {
    setPromptValues((current) => ({ ...current, [field]: value }));
  }

  function toggleLock(lockId: string) {
    setLocks((current) =>
      current.map((lock) => (lock.id === lockId ? { ...lock, enabled: !lock.enabled } : lock)),
    );
  }

  const canGenerate = Object.values(promptValues).some((value) => value.trim().length > 0);

  async function handleGenerate() {
    if (!canGenerate || isGenerating) return;

    setIsGenerating(true);
    try {
      setResult(await generateMockPreview({ assetType, promptValues, locks }));
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <AssetTypePicker value={assetType} onChange={setAssetType} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <div className="min-w-0 space-y-6">
          <PromptBuilder values={promptValues} onChange={updatePrompt} />
          <ReferenceLibrary />
        </div>
        <aside className="min-w-0 space-y-6">
          <GenerationPreview
            result={result}
            isGenerating={isGenerating}
            canGenerate={canGenerate}
            onGenerate={handleGenerate}
          />
          <CharacterLockPanel locks={locks} onToggle={toggleLock} />
        </aside>
      </div>
    </div>
  );
}
