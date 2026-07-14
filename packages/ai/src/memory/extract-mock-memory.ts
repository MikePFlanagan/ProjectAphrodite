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
    pattern: /\bmy favorite (?:food|meal) is\s+(.+?)[.!?]*$/i,
    key: 'favorite_food',
    importance: 5,
  },
  {
    pattern: /\bmy birthday is\s+(.+?)[.!?]*$/i,
    key: 'birthday',
    importance: 9,
  },
  {
    pattern: /\bi work as (?:an? )?(.+?)[.!?]*$/i,
    key: 'occupation',
    importance: 7,
  },
  {
    pattern: /\bmy job is\s+(.+?)[.!?]*$/i,
    key: 'occupation',
    importance: 7,
  },
  {
    pattern: /\bi live in\s+(.+?)[.!?]*$/i,
    key: 'location',
    importance: 6,
  },
  {
    pattern: /\bmy goal is to\s+(.+?)[.!?]*$/i,
    key: 'current_goal',
    importance: 8,
  },
  {
    pattern: /\bi want to\s+(.+?)[.!?]*$/i,
    key: 'current_goal',
    importance: 7,
  },
  {
    pattern: /\bi like\s+(.+?)[.!?]*$/i,
    key: 'likes',
    importance: 4,
  },
  {
    pattern: /\bi enjoy\s+(.+?)[.!?]*$/i,
    key: 'likes',
    importance: 4,
  },
  {
    pattern: /\bi dislike\s+(.+?)[.!?]*$/i,
    key: 'dislikes',
    importance: 4,
  },
  {
    pattern: /\bi hate\s+(.+?)[.!?]*$/i,
    key: 'dislikes',
    importance: 5,
  },
  {
    pattern: /\bmy (?:dog|cat|pet) is named\s+(.+?)[.!?]*$/i,
    key: 'pet_name',
    importance: 7,
  },
  {
    pattern: /\bmy (?:dog|cat|pet)'?s name is\s+(.+?)[.!?]*$/i,
    key: 'pet_name',
    importance: 7,
  },
];

export function extractMockMemories(
  userMessage: string,
): MemoryCandidate[] {
  const statements = userMessage
    .split(/\r?\n|(?<=[.!?])\s+/)
    .map((statement) => statement.trim())
    .filter(Boolean);

  const candidates = statements
    .map(extractMemoryFromStatement)
    .filter(
      (candidate): candidate is MemoryCandidate =>
        candidate !== null,
    );

  return deduplicateCandidates(candidates);
}

function extractMemoryFromStatement(
  statement: string,
): MemoryCandidate | null {
  for (const memoryPattern of memoryPatterns) {
    const match = statement.match(memoryPattern.pattern);
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

function deduplicateCandidates(
  candidates: MemoryCandidate[],
): MemoryCandidate[] {
  const candidatesByKey = new Map<
    string,
    MemoryCandidate
  >();

  for (const candidate of candidates) {
    candidatesByKey.set(candidate.key, candidate);
  }

  return [...candidatesByKey.values()];
}

function cleanMemoryValue(value: string): string {
  return value
    .replace(/^["']|["']$/g, '')
    .replace(/[.!?]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}
