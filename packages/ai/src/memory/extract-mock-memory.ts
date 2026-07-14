import { deduplicateMemoryCandidates } from './merge';
import { memoryPatterns } from './patterns';

export type MemoryCandidate = {
  key: string;
  value: string;
  importance: number;
};

export function extractMockMemories(
  userMessage: string,
): MemoryCandidate[] {
  const statements = splitIntoStatements(userMessage);

  const candidates = statements
    .map(extractMemoryFromStatement)
    .filter(
      (candidate): candidate is MemoryCandidate =>
        candidate !== null,
    );

  return deduplicateMemoryCandidates(candidates);
}

function splitIntoStatements(
  userMessage: string,
): string[] {
  return userMessage
    .split(/\r?\n|(?<=[.!?])\s+/)
    .map((statement) => statement.trim())
    .filter(Boolean);
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

function cleanMemoryValue(value: string): string {
  return value
    .replace(/^["']|["']$/g, '')
    .replace(/[.!?]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}
