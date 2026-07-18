import type { AppearanceAssetTypeOption, PromptField } from './types';

export const appearanceAssetTypes: AppearanceAssetTypeOption[] = [
  {
    id: 'portrait',
    label: 'Portrait',
    description: 'Create a primary portrait for your companion.',
  },
  { id: 'full-body', label: 'Full Body', description: 'Generate a complete character view.' },
  { id: 'expression', label: 'Expression', description: 'Create facial expressions and emotions.' },
  { id: 'outfit', label: 'Outfit', description: 'Design clothing and wardrobe variations.' },
  { id: 'scene', label: 'Scene', description: 'Place your companion in different environments.' },
  { id: 'video', label: 'Video', description: 'Generate animated or video content.' },
];

export const promptFields: PromptField[] = [
  { id: 'subject', label: 'Subject', placeholder: 'Describe your companion...' },
  { id: 'hair', label: 'Hair', placeholder: 'Hair style and color...' },
  { id: 'eyes', label: 'Eyes', placeholder: 'Eye color and details...' },
  { id: 'clothing', label: 'Clothing', placeholder: 'Outfit...' },
  { id: 'pose', label: 'Pose', placeholder: 'Standing, sitting...' },
  { id: 'lighting', label: 'Lighting', placeholder: 'Studio lighting...' },
  { id: 'environment', label: 'Environment', placeholder: 'Beach, studio...' },
  { id: 'style', label: 'Style', placeholder: 'Photorealistic...' },
];
