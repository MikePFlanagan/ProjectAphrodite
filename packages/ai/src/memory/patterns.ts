export type MemoryPattern = {
  pattern: RegExp;
  key: string;
  importance: number;
};

export const memoryPatterns: MemoryPattern[] = [
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
