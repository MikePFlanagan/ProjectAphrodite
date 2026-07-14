import {
  BookOpen,
  Images,
  Palette,
  Send,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  Volume2,
} from 'lucide-react';

import type {
  CompanionDraft,
  StudioSection,
} from './types';

export const studioSections: StudioSection[] = [
  {
    id: 'identity',
    title: 'Identity',
    description: 'Name, story, greeting, and category',
    icon: UserRound,
    completed: true,
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Generate and manage visual identity',
    icon: Palette,
    completed: false,
  },
  {
    id: 'personality',
    title: 'Personality',
    description: 'Traits, behavior, and conversation style',
    icon: SlidersHorizontal,
    completed: false,
  },
  {
    id: 'voice',
    title: 'Voice',
    description: 'Voice model, tone, and delivery',
    icon: Volume2,
    completed: false,
  },
  {
    id: 'knowledge',
    title: 'Knowledge',
    description: 'Lore, documents, and instructions',
    icon: BookOpen,
    completed: false,
  },
  {
    id: 'gallery',
    title: 'Gallery',
    description: 'Character images, videos, and assets',
    icon: Images,
    completed: false,
  },
  {
    id: 'publish',
    title: 'Publish',
    description: 'Review visibility and release settings',
    icon: Send,
    completed: false,
  },
];

export const defaultCompanionDraft: CompanionDraft = {
  name: 'New Companion',
  tagline: 'An original Aphrodite companion',
  greeting:
    "Hi. I'm excited to meet you and begin creating something meaningful together.",
  category: 'Friendly',
  traits: ['Warm', 'Curious', 'Creative'],
};

export const sectionPlaceholderContent = {
  identity: {
    eyebrow: 'Character foundation',
    title: 'Define their identity',
    description:
      'Shape the essential details that make this companion recognizable and distinct.',
    icon: UserRound,
  },
  appearance: {
    eyebrow: 'Visual generation',
    title: 'Create their appearance',
    description:
      'Generate, edit, and organize consistent character imagery using the complete creation workflow.',
    icon: Palette,
  },
  personality: {
    eyebrow: 'Behavior design',
    title: 'Shape their personality',
    description:
      'Control warmth, humor, confidence, curiosity, boundaries, and advanced instructions.',
    icon: SlidersHorizontal,
  },
  voice: {
    eyebrow: 'Voice design',
    title: 'Choose how they sound',
    description:
      'Select a voice provider, tune delivery, and preview the companion speaking.',
    icon: Volume2,
  },
  knowledge: {
    eyebrow: 'Knowledge system',
    title: 'Give them knowledge',
    description:
      'Add documents, lore, facts, background information, and specialized instructions.',
    icon: BookOpen,
  },
  gallery: {
    eyebrow: 'Asset library',
    title: 'Manage their gallery',
    description:
      'Organize portraits, expressions, outfits, scenes, videos, and approved character assets.',
    icon: Images,
  },
  publish: {
    eyebrow: 'Release workflow',
    title: 'Prepare to publish',
    description:
      'Review the companion, configure visibility, and prepare distribution settings.',
    icon: Send,
  },
} as const;

export const studioBrandIcon = Sparkles;
