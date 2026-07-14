import type { MemoryCandidate } from './extract-mock-memory';

export function deduplicateMemoryCandidates(
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
