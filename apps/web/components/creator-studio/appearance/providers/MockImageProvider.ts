import type { AppearanceAssetType } from '../types';

export type MockGenerationResult = {
  id: string;
  assetType: AppearanceAssetType;
  imageUrl: string;
  createdAt: string;
};

const mockPreviewImages: Record<
  AppearanceAssetType,
  string[]
> = {
  portrait: [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85',
  ],
  'full-body': [
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85',
  ],
  expression: [
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85',
  ],
  outfit: [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85',
  ],
  scene: [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=85',
  ],
  video: [
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85',
  ],
};

function chooseRandomImage(
  assetType: AppearanceAssetType,
  previousUrl?: string,
): string {
  const candidates = mockPreviewImages[assetType];

  const alternatives = candidates.filter(
    (imageUrl) => imageUrl !== previousUrl,
  );

  const pool =
    alternatives.length > 0 ? alternatives : candidates;

  const selected =
    pool[Math.floor(Math.random() * pool.length)];

  if (!selected) {
    throw new Error(
      `No mock preview images configured for ${assetType}.`,
    );
  }

  return selected;
}

export async function generateMockPreview(
  assetType: AppearanceAssetType,
  previousUrl?: string,
): Promise<MockGenerationResult> {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 1800);
  });

  return {
    id: crypto.randomUUID(),
    assetType,
    imageUrl: chooseRandomImage(assetType, previousUrl),
    createdAt: new Date().toISOString(),
  };
}
