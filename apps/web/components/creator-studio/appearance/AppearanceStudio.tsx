'use client';

import { useState } from 'react';

import { AssetTypePicker } from './AssetTypePicker';
import { CharacterLockPanel } from './CharacterLock';
import { PromptBuilder } from './PromptBuilder';
import { ReferenceLibrary } from './ReferenceLibrary';
import { characterLocks } from './config';
import type { AppearanceAssetType, CharacterLock } from './types';

export function AppearanceStudio() {
  const [assetType, setAssetType] = useState<AppearanceAssetType>('portrait');
  const [promptValues, setPromptValues] = useState<Record<string, string>>({});
  const [locks, setLocks] = useState<CharacterLock[]>(characterLocks);

  function updatePrompt(field: string, value: string) {
    setPromptValues((current) => ({ ...current, [field]: value }));
  }

  function toggleLock(lockId: string) {
    setLocks((current) =>
      current.map((lock) => (lock.id === lockId ? { ...lock, enabled: !lock.enabled } : lock)),
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <AssetTypePicker value={assetType} onChange={setAssetType} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <div className="min-w-0 space-y-6">
          <PromptBuilder values={promptValues} onChange={updatePrompt} />
          <ReferenceLibrary />
        </div>
        <aside className="min-w-0">
          <CharacterLockPanel locks={locks} onToggle={toggleLock} />
        </aside>
      </div>

      <section className="rounded-3xl border border-dashed border-fuchsia-200/15 bg-fuchsia-300/[0.035] p-6 text-center">
        <p className="text-sm font-semibold capitalize text-white">
          {assetType.replace('-', ' ')} generation comes next
        </p>
        <p className="mt-2 text-sm text-white/35">
          Provider execution and generated asset history remain isolated follow-up bricks.
        </p>
      </section>
    </div>
  );
}
