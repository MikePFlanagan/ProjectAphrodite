import type { RelationshipDelta } from './types';

export function evaluateRelationship(
  userMessage: string,
): RelationshipDelta {
  const text = userMessage.toLowerCase();

  const delta: RelationshipDelta = {};

  if (
    text.includes('thank you') ||
    text.includes('thanks')
  ) {
    delta.trust = (delta.trust ?? 0) + 1;
    delta.respect = (delta.respect ?? 0) + 1;
  }

  if (
    text.includes('joke') ||
    text.includes('funny') ||
    text.includes('lol') ||
    text.includes('haha')
  ) {
    delta.playfulness =
      (delta.playfulness ?? 0) + 1;
  }

  if (
    text.includes('help me') ||
    text.includes('advice')
  ) {
    delta.comfort =
      (delta.comfort ?? 0) + 1;
  }

  if (
    text.includes('learn') ||
    text.includes('teach me') ||
    text.includes('how do')
  ) {
    delta.curiosity =
      (delta.curiosity ?? 0) + 1;
  }

  if (
    text.includes('sad') ||
    text.includes('anxious') ||
    text.includes('depressed') ||
    text.includes('lonely')
  ) {
    delta.comfort =
      (delta.comfort ?? 0) + 2;

    delta.affection =
      (delta.affection ?? 0) + 1;
  }

  return delta;
}
