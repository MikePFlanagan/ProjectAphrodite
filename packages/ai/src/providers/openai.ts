import { createOpenAI } from '@ai-sdk/openai';

export function createOpenAIProvider(apiKey = process.env.OPENAI_API_KEY) {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  return createOpenAI({
    apiKey,
  });
}

export function getOpenAIModel(modelName = process.env.OPENAI_MODEL ?? 'gpt-5-mini') {
  const provider = createOpenAIProvider();

  return provider(modelName);
}
