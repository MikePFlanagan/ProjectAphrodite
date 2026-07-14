export type Relationship = {
  trust: number;
  comfort: number;
  curiosity: number;
  playfulness: number;
  affection: number;
  respect: number;
};

export type RelationshipDelta = Partial<Relationship>;

export const DEFAULT_RELATIONSHIP: Relationship = {
  trust: 50,
  comfort: 50,
  curiosity: 50,
  playfulness: 50,
  affection: 50,
  respect: 50,
};
