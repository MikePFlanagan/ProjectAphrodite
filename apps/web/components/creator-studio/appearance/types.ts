export type AppearanceAssetType =
  | 'portrait'
  | 'full-body'
  | 'expression'
  | 'outfit'
  | 'scene'
  | 'video';

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

export interface ReferenceImage {
  id: string;
  title: string;
  description: string;
}

export interface CharacterLock {
  id: string;
  label: string;
  enabled: boolean;
}

export interface AppearanceAsset {
  id: string;
  title: string;
  version: number;
  status: 'current' | 'previous';
}

export interface AppearanceVersion {
  id: string;
  label: string;
  current: boolean;
}