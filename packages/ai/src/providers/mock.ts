import type { ChatContext } from '../types/chat-context';

export type MockResponseInput = {
  context: ChatContext;
  userMessage: string;
};

export function createMockResponse({
  context,
  userMessage,
}: MockResponseInput): string {
  const normalizedMessage = userMessage.trim().toLowerCase();
  const { user, character } = context;

  if (normalizedMessage.includes('what is my name')) {
    return `Your name is ${user.name}.`;
  }

  if (
    normalizedMessage.includes('hello') ||
    normalizedMessage === 'hi' ||
    normalizedMessage.startsWith('hi ')
  ) {
    return `Hello, ${user.name}. I'm ${character.name}.`;
  }

  if (normalizedMessage.includes('who are you')) {
    return `I'm ${character.name}, ${user.name}. ${character.tagline}`;
  }

  return `Hi ${user.name}!

I'm ${character.name}.

You said:

"${userMessage}"

This response came from the mock provider.`;
}
