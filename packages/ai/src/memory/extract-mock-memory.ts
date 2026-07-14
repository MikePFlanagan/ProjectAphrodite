export type MemoryCandidate = {
  key: string;
  value: string;
  importance: number;
};

type MemoryPattern = {
  pattern: RegExp;
  key: string;
  importance: number;
};

const memoryPatterns: MemoryPattern[] = [
  {
    pattern: /\bmy favorite colou?r is\s+(.+?)[.!?]*$/i,
    key: 'favorite_color',
    importance: 5,
  },
  {
    pattern: /\bmy favorite movie is\s+(.+?)[.!?]*$/i,
    key: 'favorite_movie',
    importance: 6,
  },
  {
    pattern: /\bmy (?:dog|pet) is named\s+(.+?)[.!?]*$/i,
    key: 'pet_name',
    importance: 7,
  },
  {
    pattern: /\bmy (?:dog|pet)'?s name is\s+(.+?)[.!?]*$/i,
    key: 'pet_name',
    importance: 7,
  },
  {
    pattern: /\bi live in\s+(.+?)[.!?]*$/i,
    key: 'location',
    importance: 6,
  },
];

export function extractMockMemory(
  userMessage: string,
): MemoryCandidate | null {
  const normalizedMessage = userMessage.trim();

  for (const memoryPattern of memoryPatterns) {
    const match = normalizedMessage.match(
      memoryPattern.pattern,
    );

    const value = match?.[1]?.trim();

    if (!value) {
      continue;
    }

    return {
      key: memoryPattern.key,
      value: cleanMemoryValue(value),
      importance: memoryPattern.importance,
    };
  }

  return null;
}

function cleanMemoryValue(value: string): string {
  return value
    .replace(/[.!?]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}
