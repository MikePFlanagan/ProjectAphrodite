export type MemoryCategory =
  | 'personal'
  | 'preferences'
  | 'career'
  | 'goals'
  | 'location'
  | 'pets'
  | 'relationships'
  | 'lifestyle'
  | 'other';

export type MemoryCandidate = {
  key: string;
  value: string;
  importance: number;
  category: MemoryCategory;
};
