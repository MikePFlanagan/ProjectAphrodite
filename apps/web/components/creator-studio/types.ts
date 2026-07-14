import type { LucideIcon } from 'lucide-react';

export type StudioSectionId =
  | 'identity'
  | 'appearance'
  | 'personality'
  | 'voice'
  | 'knowledge'
  | 'gallery'
  | 'publish';

export type StudioSection = {
  id: StudioSectionId;
  title: string;
  description: string;
  icon: LucideIcon;
  completed: boolean;
};

export type CompanionDraft = {
  name: string;
  tagline: string;
  greeting: string;
  category: string;
  traits: string[];
};
