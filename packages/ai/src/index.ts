export {
  createOpenAIProvider,
  getOpenAIModel,
} from './providers/openai';

export {
  createMockResponse,
  type MockResponseInput,
} from './providers/mock';

export {
  categorizeMemoryKey,
  extractMockMemories,
  type MemoryCandidate,
  type MemoryCategory,
} from './memory';

export {
  buildCharacterSystemPrompt,
  type CharacterPromptInput,
} from './prompts/character';

export type {
  ChatContext,
  ChatMemory,
} from './types/chat-context';

export * from './relationship';
