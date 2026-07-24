'use client';

import { useEffect, useState } from 'react';

import { AssetTypePicker } from './AssetTypePicker';
import { CharacterLockPanel } from './CharacterLock';
import { GenerationPreview } from './GenerationPreview';
import { GenerationHistory } from './GenerationHistory';
import { PromptBuilder } from './PromptBuilder';
import { ReferenceLibrary } from './ReferenceLibrary';
import { characterLocks } from './config';
import type { ImageGenerationResult } from './providers/ImageProvider';
import { localMockProvider } from './providers/LocalMockProvider';
import type { AppearanceAssetType, CharacterLock } from './types';

export function AppearanceStudio({ draftId }: { draftId?: string }) {
  const [assetType, setAssetType] = useState<AppearanceAssetType>('portrait');
  const [promptValues, setPromptValues] = useState<Record<string, string>>({});
  const [locks, setLocks] = useState<CharacterLock[]>(characterLocks);
  const [results, setResults] = useState<ImageGenerationResult[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      if (!draftId) return;
      try {
        const response = await fetch(`/api/creator/assets?draftId=${encodeURIComponent(draftId)}`);
        if (!response.ok) throw new Error('Could not load saved assets.');
        const data = (await response.json()) as { assets: ImageGenerationResult[] };
        if (!active) return;
        setResults(data.assets);
        setSelectedId(data.assets[0]?.id ?? null);
      } catch {
        if (active)
          setHistoryError(
            'Saved assets could not be loaded. You can still generate new variations.',
          );
      } finally {
        if (active) setIsLoadingHistory(false);
      }
    }

    void loadHistory();
    return () => {
      active = false;
    };
  }, [draftId]);

  function updatePrompt(field: string, value: string) {
    setPromptValues((current) => ({ ...current, [field]: value }));
  }

  function toggleLock(lockId: string) {
    setLocks((current) =>
      current.map((lock) => (lock.id === lockId ? { ...lock, enabled: !lock.enabled } : lock)),
    );
  }

  const canGenerate =
    Boolean(draftId) && Object.values(promptValues).some((value) => value.trim().length > 0);
  const selectedResult = results.find((result) => result.id === selectedId) ?? null;

  async function handleGenerate() {
    if (!draftId || !canGenerate || isGenerating) return;

    setIsGenerating(true);
    try {
      const nextResult = await localMockProvider.generate({
        assetType,
        promptValues,
        locks,
        variation: results.length + 1,
      });
      const response = await fetch('/api/creator/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nextResult, draftId }),
      });
      if (!response.ok) throw new Error('Could not save generated asset.');
      const data = (await response.json()) as { asset: ImageGenerationResult };
      setResults((current) => [data.asset, ...current]);
      setSelectedId(data.asset.id);
      setHistoryError(null);
    } catch {
      setHistoryError('That variation could not be saved. Please try again.');
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
          <GenerationHistory
            results={results}
            selectedId={selectedId}
            isLoading={isLoadingHistory}
            error={historyError}
            onSelect={(result) => setSelectedId(result.id)}
          />
        </div>
        <aside className="min-w-0 space-y-6">
          <GenerationPreview
            result={selectedResult}
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
