import type { LanguageModel } from 'ai';
import { z } from 'zod';

export const companionMessageSchema = z.object({ companionId: z.string().cuid(), content: z.string().min(1).max(8_000) });
export type CompanionMessageInput = z.infer<typeof companionMessageSchema>;

export interface CompanionAI {
  model: LanguageModel;
  systemPrompt: (input: { companionName: string; boundaries: string[] }) => string;
}
