'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { db } from '@aphrodite/database';

import { requireUser } from '@/lib/require-auth';

export type ProfileState = { error?: string; success?: string };

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(60),
});

export async function updateProfileAction(
  _: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({ name: formData.get('name') });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Enter a valid name.' };
  }

  await db.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name },
  });
  revalidatePath('/settings');
  revalidatePath('/dashboard');
  return { success: 'Profile updated.' };
}
