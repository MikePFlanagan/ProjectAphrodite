'use client';

import { useMemo, useState } from 'react';

import {
  createDefaultEntityDna,
  type EntityDNA,
  type EntityFamily,
} from '../../../lib/entity-dna';
import { AssetGallery } from './AssetGallery';
import { AssetTypePicker } from './AssetTypePicker';
import { CharacterLockPanel } from './CharacterLock';
import { CreationJourney } from './CreationJourney';
import { CreatorAssistant } from './CreatorAssistant';
import { CoreIdentityFields } from './CoreIdentityFields';
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

function getDefaultSpecies(
  family: EntityFamily,
): string {
  switch (family) {
    case 'human':
      return 'human';
    case 'animal':
      return '';
    case 'fantasy':
      return '';
    case 'robot':
      return 'robot';
    case 'alien':
      return 'alien';
    case 'mascot':
      return '';
    case 'custom':
      return '';
  }
}

export function AppearanceStudio() {
  const initialPromptValues = useMemo(
    () => createInitialPromptValues(),
    [],
  );

  const [assetType, setAssetType] =
    useState<AppearanceAssetType>('portrait');

  const [entityDna, setEntityDna] =
    useState<EntityDNA>(() =>
      createDefaultEntityDna('human'),
    );

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

  function handleFamilyChange(
    family: EntityFamily,
  ) {
    setEntityDna((current) => ({
      ...current,
      family,
      identity: {
        ...current.identity,
        species: getDefaultSpecies(family),
        age:
          family === 'human'
            ? Math.max(current.identity.age ?? 18, 18)
            : current.identity.age,
        sex:
          family === 'robot'
            ? 'not-applicable'
            : current.identity.sex,
      },
      metadata: {
        ...current.metadata,
        updatedAt: new Date().toISOString(),
      },
    }));
  }

  function handleIdentityChange(
    field: keyof EntityDNA['identity'],
    value: string | number | null,
  ) {
    setEntityDna((current) => ({
      ...current,
      identity: {
        ...current.identity,
        [field]: value,
      },
      metadata: {
        ...current.metadata,
        updatedAt: new Date().toISOString(),
      },
    }));
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
          <CoreIdentityFields
            entityDna={entityDna}
            onFamilyChange={handleFamilyChange}
            onIdentityChange={handleIdentityChange}
          />

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
            entityDna={entityDna}
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
