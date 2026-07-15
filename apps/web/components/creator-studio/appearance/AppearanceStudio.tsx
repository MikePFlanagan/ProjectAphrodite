'use client';

import { useState } from 'react';

import { AssetTypePicker } from './AssetTypePicker';
import type { AppearanceAssetType } from './types';

export function AppearanceStudio() {
  const [assetType, setAssetType] =
    useState<AppearanceAssetType>('portrait');

  return (
    <div className="mt-8 space-y-6">
      <AssetTypePicker
        value={assetType}
        onChange={setAssetType}
      />

      <section className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
        <p className="text-sm font-semibold capitalize text-white">
          {assetType.replace('-', ' ')} workspace
        </p>

        <p className="mt-2 text-sm text-white/35">
          The remaining Appearance Studio components
          will be added here next.
        </p>
      </section>
    </div>
  );
}
   
