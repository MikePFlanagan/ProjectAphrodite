export { createOpenAIProvider, getOpenAIModel } from './providers/openai';

export { buildCharacterSystemPrompt, type CharacterPromptInput } from './prompts/character';

export { createDevelopmentResponse, type DevelopmentResponseInput } from './providers/mock';

export {
  evaluateRelationship,
  relationshipLabel,
  updateRelationship,
  type RelationshipDelta,
  type RelationshipScores,
} from './relationship/engine';
