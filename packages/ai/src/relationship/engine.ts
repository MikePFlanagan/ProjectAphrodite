export type RelationshipScores = {
  trust: number;
  comfort: number;
  curiosity: number;
  playfulness: number;
  affection: number;
  respect: number;
};

export type RelationshipDelta = Partial<RelationshipScores>;

const positivePatterns = [/\bthank(s| you)?\b/i, /\bappreciate\b/i, /\bkind\b/i, /\bhelpful\b/i];
const curiousPatterns = [/\?/, /\bwhy\b/i, /\bhow\b/i, /\btell me\b/i];
const playfulPatterns = [/\b(joke|fun|play|haha|lol)\b/i];
const negativePatterns = [/\b(hate|stupid|idiot|shut up)\b/i];

export function evaluateRelationship(message: string): RelationshipDelta {
  const positive = positivePatterns.some((pattern) => pattern.test(message));
  const curious = curiousPatterns.some((pattern) => pattern.test(message));
  const playful = playfulPatterns.some((pattern) => pattern.test(message));
  const negative = negativePatterns.some((pattern) => pattern.test(message));

  if (negative) return { trust: -3, comfort: -3, affection: -2, respect: -4 };

  return {
    trust: positive ? 2 : 0,
    comfort: positive ? 2 : 1,
    curiosity: curious ? 2 : 0,
    playfulness: playful ? 3 : 0,
    affection: positive ? 1 : 0,
    respect: positive ? 2 : 0,
  };
}

export function updateRelationship(
  current: RelationshipScores,
  delta: RelationshipDelta,
): RelationshipScores {
  return Object.fromEntries(
    Object.entries(current).map(([key, value]) => [
      key,
      Math.max(0, Math.min(100, value + (delta[key as keyof RelationshipScores] ?? 0))),
    ]),
  ) as unknown as RelationshipScores;
}

export function relationshipLabel(scores: RelationshipScores) {
  const average = Object.values(scores).reduce((sum, score) => sum + score, 0) / 6;
  if (average >= 75) return 'Close';
  if (average >= 60) return 'Growing';
  if (average >= 40) return 'Acquainted';
  return 'Distant';
}
