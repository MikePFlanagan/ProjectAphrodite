import { z } from 'zod';

// ─── Content DNA Schema ─────────────────────────────────────────────────────

export const hookAnalysisSchema = z.object({
  hookType: z.string().optional(),
  hookTiming: z.string().optional(),
  openingVisual: z.string().optional(),
  openingText: z.string().optional(),
  curiosityMechanism: z.string().optional(),
});

export const pacingAnalysisSchema = z.object({
  duration: z.number().optional(),
  sceneCount: z.number().optional(),
  cutFrequency: z.string().optional(),
  averageSceneLength: z.number().optional(),
  pacingChanges: z.array(z.string()).optional(),
});

export const visualStructureSchema = z.object({
  shotTypes: z.array(z.string()).optional(),
  framing: z.string().optional(),
  cameraMovement: z.string().optional(),
  subjectPositioning: z.string().optional(),
  environmentCategory: z.string().optional(),
  transitions: z.array(z.string()).optional(),
});

export const narrativeSchema = z.object({
  setup: z.string().optional(),
  escalation: z.string().optional(),
  reveal: z.string().optional(),
  payoff: z.string().optional(),
  cta: z.string().optional(),
  loopBehavior: z.string().optional(),
});

export const textStrategySchema = z.object({
  captionStyle: z.string().optional(),
  textDensity: z.string().optional(),
  onScreenTextTiming: z.string().optional(),
  ctaLanguageCategory: z.string().optional(),
});

export const audioStrategySchema = z.object({
  hasSpeech: z.boolean().optional(),
  hasMusic: z.boolean().optional(),
  beatDrivenEditing: z.boolean().optional(),
  hasVoiceOver: z.boolean().optional(),
  hasSilenceInterrupts: z.boolean().optional(),
});

export const engagementSchema = z.object({
  engagementRate: z.number().optional(),
  shareRate: z.number().optional(),
  saveRate: z.number().optional(),
  viewsPerHour: z.number().optional(),
});

export const confidenceSchema = z.object({
  overall: z.number().min(0).max(1).optional(),
  hook: z.number().min(0).max(1).optional(),
  pacing: z.number().min(0).max(1).optional(),
  narrative: z.number().min(0).max(1).optional(),
  visual: z.number().min(0).max(1).optional(),
});

export const contentDnaSchema = z.object({
  hook: hookAnalysisSchema.optional(),
  pacing: pacingAnalysisSchema.optional(),
  narrative: narrativeSchema.optional(),
  cinematography: visualStructureSchema.optional(),
  textStrategy: textStrategySchema.optional(),
  audioStrategy: audioStrategySchema.optional(),
  engagementSignals: engagementSchema.optional(),
  archetype: z.string().optional(),
  confidence: confidenceSchema.optional(),
});

export type ContentDNA = z.infer<typeof contentDnaSchema>;

// ─── Scene / Storyboard ─────────────────────────────────────────────────────

export const sceneSchema = z.object({
  sceneNumber: z.number(),
  startTime: z.number(),
  endTime: z.number(),
  purpose: z.string(),
  shotType: z.string().optional(),
  framing: z.string().optional(),
  subjectAction: z.string().optional(),
  environment: z.string().optional(),
  dialogue: z.string().optional(),
  onScreenText: z.string().optional(),
  transition: z.string().optional(),
  generationPrompt: z.string().optional(),
  continuityNotes: z.string().optional(),
});

export type Scene = z.infer<typeof sceneSchema>;

// ─── Content Character Context ──────────────────────────────────────────────

export interface ContentCharacterContext {
  id: string;
  name: string;
  tagline: string;
  description: string;
  avatarUrl: string;
  category: string;
  traits: string[];
  personality: Record<string, unknown>;
  personalityPrompt: string;
}

// ─── Platforms ──────────────────────────────────────────────────────────────

export const PLATFORMS = [
  'tiktok',
  'instagram-reels',
  'instagram-stories',
  'instagram-feed',
  'youtube-shorts',
  'youtube',
  'twitter',
  'other',
] as const;

export type Platform = (typeof PLATFORMS)[number];

// ─── Generation Provider ────────────────────────────────────────────────────

export interface GenerationProviderInfo {
  id: string;
  name: string;
  status: 'configured' | 'unconfigured' | 'unavailable';
  capabilities: string[];
}

export interface VideoGenerationProvider {
  readonly id: string;
  readonly name: string;
  isConfigured(): boolean;
  createJob(request: GenerationRequest): Promise<GenerationJobResult>;
  getJobStatus(providerJobId: string): Promise<GenerationJobResult>;
  cancelJob?(providerJobId: string): Promise<void>;
}

export interface GenerationRequest {
  prompt: string;
  negativePrompt?: string;
  duration?: number;
  aspectRatio?: string;
  style?: string;
  metadata?: Record<string, unknown>;
}

export interface GenerationJobResult {
  providerJobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  resultUrl?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}
