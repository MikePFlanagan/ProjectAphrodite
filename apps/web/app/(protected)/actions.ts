'use server';
import { db } from '@aphrodite/database';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/require-auth';

export async function createConversationAction(formData: FormData) {
  const user = await requireUser();
  const characterId = String(formData.get('characterId') ?? '');
  const character = await db.character.findFirst({
    where: { id: characterId, isPublished: true },
  });
  if (!character) throw new Error('Character not found.');

  const conversation = await db.$transaction(async (transaction) => {
    await transaction.relationship.upsert({
      where: { userId_characterId: { userId: user.id, characterId: character.id } },
      update: {},
      create: { userId: user.id, characterId: character.id },
    });
    return transaction.conversation.create({
      data: {
        userId: user.id,
        characterId: character.id,
        messages: { create: { role: 'ASSISTANT', content: character.greeting } },
      },
    });
  });

  redirect(`/chat/${conversation.id}`);
}
