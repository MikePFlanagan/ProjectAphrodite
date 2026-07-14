import type { MemoryCategory } from './types';

const categoryByKey: Record<string, MemoryCategory> = {
  birthday: 'personal',

  favorite_color: 'preferences',
  favorite_movie: 'preferences',
  favorite_food: 'preferences',
  likes: 'preferences',
  dislikes: 'preferences',

  occupation: 'career',

  current_goal: 'goals',

  location: 'location',

  pet_name: 'pets',
};

export function categorizeMemoryKey(
  key: string,
): MemoryCategory {
  return categoryByKey[key] ?? 'other';
}
