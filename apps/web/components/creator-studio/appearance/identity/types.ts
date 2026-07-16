import type { AppearanceAssetType } from '../types';

export const identityTraitKeys = [
  'face',
  'hair',
  'eyes',
  'body',
  'age',
  'style',
] as const;

export type IdentityTraitKey =
  (typeof identityTraitKeys)[number];

export type IdentityTraitSource =
  | 'prompt'
  | 'reference'
  | 'prompt-and-reference';

export type IdentityStatus =
  | 'draft'
  | 'approved'
  | 'superseded';

export type ReferenceAssetRole =
  | 'primary-face-reference'
  | 'side-profile-reference'
  | 'back-view-reference'
  | 'full-body-reference'
  | 'style-reference'
  | 'outfit-reference';

export type IdentityTrait = {
  key: IdentityTraitKey;
  label: string;
  enabled: boolean;
  captured: boolean;
  value: string | null;
  source: IdentityTraitSource;
  updatedAt: string | null;
};

export type IdentityReferenceAsset = {
  id: string;
  role: ReferenceAssetRole;
  version: number;
  imageUrl: string;
  createdAt: string;
};

export type IdentityGenerationMetadata = {
  provider: string;
  model: string;
  seed: number | null;
  promptVersion: number;
  assetType: AppearanceAssetType;
  generatedAt: string;
};

export type CharacterIdentitySnapshot = {
  schemaVersion: '1.0';
  characterId: string;
  identityVersion: number;
  status: IdentityStatus;
  traits: Record<IdentityTraitKey, IdentityTrait>;
  referenceAssets: IdentityReferenceAsset[];
  generationMetadata: IdentityGenerationMetadata;
  createdAt: string;
  approvedAt: string | null;
};

export type IdentityPromptValues = {
  sex?: string;
  age?: string;
  subject?: string;
  hair?: string;
  eyes?: string;
  clothing?: string;
  pose?: string;
  lighting?: string;
  environment?: string;
  style?: string;
};
