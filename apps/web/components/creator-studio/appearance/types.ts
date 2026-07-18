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
