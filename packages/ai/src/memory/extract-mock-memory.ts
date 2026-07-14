import { categorizeMemoryKey } from './categorize';
import { deduplicateMemoryCandidates } from './merge';
import { memoryPatterns } from './patterns';
import type { MemoryCandidate } from './types';

export type {
  MemoryCandidate,
} from './types';

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
    const match = statement.match(
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
      category: categorizeMemoryKey(
        memoryPattern.key,
      ),
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
