'use client';

import { useMemo, useState } from 'react';

import { AssetGallery } from './AssetGallery';
import { AssetTypePicker } from './AssetTypePicker';
import { CharacterLockPanel } from './CharacterLock';
import { CreationJourney } from './CreationJourney';
import { CreatorAssistant } from './CreatorAssistant';
import { PromptBuilder } from './PromptBuilder';
import { ReferenceLibrary } from './ReferenceLibrary';
import { VisualPreviewCanvas } from './VisualPreviewCanvas';
import {
  characterLocks as initialCharacterLocks,
  promptFields,
} from './config';
import type {
  AppearanceAssetType,
  CharacterLock,
} from './types';

type PromptValues = Record<string, string>;

function createInitialPromptValues(): PromptValues {
  return Object.fromEntries(
    promptFields.map((field) => [field.id, '']),
  );
}

export function AppearanceStudio() {
  const initialPromptValues = useMemo(
    () => createInitialPromptValues(),
    [],
  );

  const [assetType, setAssetType] =
    useState<AppearanceAssetType>('portrait');

  const [promptValues, setPromptValues] =
    useState<PromptValues>(initialPromptValues);

  const [locks, setLocks] = useState<CharacterLock[]>(
    initialCharacterLocks,
  );

  function handlePromptChange(
    fieldId: string,
    value: string,
  ) {
    setPromptValues((current) => ({
      ...current,
      [fieldId]: value,
    }));
  }

  function handlePromptReset() {
    setPromptValues(initialPromptValues);
  }

  function handleLockToggle(lockId: string) {
    setLocks((current) =>
      current.map((lock) =>
        lock.id === lockId
          ? {
              ...lock,
              enabled: !lock.enabled,
            }
          : lock,
      ),
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <AssetTypePicker
        value={assetType}
        onChange={setAssetType}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,1fr)]">
        <div className="min-w-0 space-y-6">
          <PromptBuilder
            values={promptValues}
            onChange={handlePromptChange}
            onReset={handlePromptReset}
          />

          <ReferenceLibrary />

          <AssetGallery />
        </div>

        <aside className="min-w-0 space-y-6">
          <VisualPreviewCanvas
            key={assetType}
            assetType={assetType}
            promptValues={promptValues}
            locks={locks}
          />

          <CharacterLockPanel
            locks={locks}
            onToggle={handleLockToggle}
          />

          <CreationJourney />

          <CreatorAssistant />
        </aside>
      </div>
    </div>
  );
}