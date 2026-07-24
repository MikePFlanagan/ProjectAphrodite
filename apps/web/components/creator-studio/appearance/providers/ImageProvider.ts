import type { AppearanceAssetType, CharacterLock } from '../types';

export type ImageGenerationRequest = {
  assetType: AppearanceAssetType;
  promptValues: Record<string, string>;
  locks: CharacterLock[];
  variation: number;
};

export type ImageGenerationResult = {
  assetType: AppearanceAssetType;
  promptValues: Record<string, string>;
  locks: CharacterLock[];
  variation: number;
  id: string;
  createdAt: string;
  prompt: string;
  palette: [string, string, string];
};

export interface ImageProvider {
  generate(request: ImageGenerationRequest): Promise<ImageGenerationResult>;
}
