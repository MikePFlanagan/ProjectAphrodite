import type { ChatContext } from '../types/chat-context';

export type MockResponseInput = {
  context: ChatContext;
  userMessage: string;
  memorySaved?: {
    key: string;
    value: string;
  } | null;
};

export function createMockResponse({
  context,
  userMessage,
  memorySaved,
}: MockResponseInput): string {
  const normalizedMessage =
    userMessage.trim().toLowerCase();

  const { user, character, memories } = context;

  if (memorySaved) {
    return `I'll remember that, ${user.name}: **${formatMemoryKey(
      memorySaved.key,
    )}** is **${memorySaved.value}**.`;
  }

  if (normalizedMessage.includes('what is my name')) {
    return `Your name is ${user.name}.`;
  }

  if (
    normalizedMessage.includes('what do you remember') ||
    normalizedMessage.includes('what do you know about me')
  ) {
    if (memories.length === 0) {
      return `I don't have any saved memories about you yet, ${user.name}.`;
    }

    const memoryList = memories
      .map(
        (memory) =>
          `- **${formatMemoryKey(memory.key)}:** ${memory.value}`,
      )
      .join('\n');

    return `Here is what I remember about you, ${user.name}:\n\n${memoryList}`;
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

I currently have ${memories.length} saved ${
    memories.length === 1 ? 'memory' : 'memories'
  } about you.`;
}

function formatMemoryKey(key: string): string {
  return key
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}
