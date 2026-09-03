import { db } from '@aphrodite/database';
import type { ContentCharacterContext } from './types';

export async function buildCharacterContext(
  characterId: string,
  userId: string,
): Promise<ContentCharacterContext | null> {
  const character = await db.character.findFirst({
    where: { id: characterId, creatorId: userId },
    select: {
      id: true,
      name: true,
      tagline: true,
      description: true,
      avatarUrl: true,
      category: true,
      traits: true,
      personality: true,
      personalityPrompt: true,
    },
  });

  if (!character) return null;

  return {
    id: character.id,
    name: character.name,
    tagline: character.tagline,
    description: character.description,
    avatarUrl: character.avatarUrl,
    category: character.category,
    traits: character.traits,
    personality: character.personality as Record<string, unknown>,
    personalityPrompt: character.personalityPrompt,
  };
}
