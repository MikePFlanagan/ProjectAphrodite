import type { LucideIcon } from 'lucide-react';
import type { Personality } from '@aphrodite/entity-dna';

export type StudioSectionId =
  'identity' | 'appearance' | 'personality' | 'voice' | 'knowledge' | 'gallery' | 'publish';

export type StudioSection = {
  id: StudioSectionId;
  title: string;
  description: string;
  icon: LucideIcon;
  completed: boolean;
};

export type CompanionDraft = {
  id?: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  greeting: string;
  category: string;
  traits: string[];
  personality: Personality;
  voice: VoiceProfile;
};

export type VoiceProvider = 'browser' | 'local' | 'telnyx';

export type VoiceProfile = {
  provider: VoiceProvider;
  voiceId: string;
  rate: number;
  pitch: number;
};

export type DraftSaveStatus = 'loading' | 'saving' | 'saved' | 'error';
