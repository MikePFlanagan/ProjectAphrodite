import {
  DEFAULT_RELATIONSHIP,
  type Relationship,
  type RelationshipDelta,
} from './types';

import { clampRelationshipScore } from './scores';

export function createRelationship(): Relationship {
  return {
    ...DEFAULT_RELATIONSHIP,
  };
}

export function updateRelationship(
  relationship: Relationship,
  delta: RelationshipDelta,
): Relationship {
  return {
    trust: clampRelationshipScore(
      relationship.trust +
        (delta.trust ?? 0),
    ),

    comfort: clampRelationshipScore(
      relationship.comfort +
        (delta.comfort ?? 0),
    ),

    curiosity: clampRelationshipScore(
      relationship.curiosity +
        (delta.curiosity ?? 0),
    ),

    playfulness: clampRelationshipScore(
      relationship.playfulness +
        (delta.playfulness ?? 0),
    ),

    affection: clampRelationshipScore(
      relationship.affection +
        (delta.affection ?? 0),
    ),

    respect: clampRelationshipScore(
      relationship.respect +
        (delta.respect ?? 0),
    ),
  };
}
