'use client';

import { useState } from 'react';

import { AssetTypePicker } from './AssetTypePicker';
import { PromptBuilder } from './PromptBuilder';
import type { AppearanceAssetType } from './types';

export function AppearanceStudio() {
  const [assetType, setAssetType] = useState<AppearanceAssetType>('portrait');
  const [promptValues, setPromptValues] = useState<Record<string, string>>({});

  function updatePrompt(field: string, value: string) {
    setPromptValues((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="mt-8 space-y-6">
      <AssetTypePicker value={assetType} onChange={setAssetType} />
      <PromptBuilder values={promptValues} onChange={updatePrompt} />

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
