export type AppearanceAssetType =
  'portrait' | 'full-body' | 'expression' | 'outfit' | 'scene' | 'video';

export interface AppearanceAssetTypeOption {
  id: AppearanceAssetType;
  label: string;
  description: string;
}

export interface PromptField {
  id: string;
  label: string;
  placeholder: string;
}

export interface CharacterLock {
  id: string;
  label: string;
  enabled: boolean;
}

export interface ReferenceImage {
  id: string;
  title: string;
  description: string;
}
