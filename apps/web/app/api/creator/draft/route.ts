import { NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@aphrodite/database';
import { auth } from '@/auth';

const categorySchema = z.enum([
  'ROMANTIC',
  'FRIENDLY',
  'MENTOR',
  'ADVENTURE',
  'FANTASY',
  'SCI_FI',
  'LIFESTYLE',
]);

const draftSchema = z.object({
  name: z.string().trim().min(1).max(60),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  tagline: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(600),
  greeting: z.string().trim().min(1).max(500),
  category: categorySchema,
  traits: z.array(z.string().trim().min(1).max(30)).max(6),
});

const defaultDraft = {
  name: 'New Companion',
  tagline: 'An original Aphrodite companion',
  description: 'A warm, curious companion ready to grow through meaningful conversations.',
  greeting: "Hi. I'm excited to meet you and begin creating something meaningful together.",
  category: 'FRIENDLY' as const,
  traits: ['Warm', 'Curious', 'Creative'],
};

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let draft = await db.character.findFirst({
    where: { creatorId: session.user.id, isPublished: false },
    orderBy: { updatedAt: 'desc' },
  });

  if (!draft) {
    draft = await db.character.create({
      data: {
        ...defaultDraft,
        slug: `draft-${session.user.id}-${Date.now()}`,
        avatarUrl: '',
        personalityPrompt: defaultDraft.traits.join(', '),
        creatorId: session.user.id,
      },
    });
  }

  return NextResponse.json({ draft: toDraftResponse(draft) });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = draftSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid character draft.' }, { status: 400 });

  const draft = await db.character.findFirst({
    where: { creatorId: session.user.id, isPublished: false },
    orderBy: { updatedAt: 'desc' },
  });
  if (!draft) return NextResponse.json({ error: 'Draft not found.' }, { status: 404 });

  const slugOwner = await db.character.findFirst({
    where: { slug: parsed.data.slug, id: { not: draft.id } },
    select: { id: true },
  });
  if (slugOwner)
    return NextResponse.json({ error: 'That URL slug is already in use.' }, { status: 409 });

  const updated = await db.character.update({
    where: { id: draft.id },
    data: { ...parsed.data, personalityPrompt: parsed.data.traits.join(', ') },
  });

  return NextResponse.json({ draft: toDraftResponse(updated) });
}

function toDraftResponse(draft: {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  greeting: string;
  category: string;
  traits: string[];
}) {
  return {
    id: draft.id,
    name: draft.name,
    slug: draft.slug,
    tagline: draft.tagline,
    description: draft.description,
    greeting: draft.greeting,
    category: draft.category,
    traits: draft.traits,
  };
}
