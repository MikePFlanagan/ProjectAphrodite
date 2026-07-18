import { NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@aphrodite/database';
import { defaultPersonality, type Personality } from '@aphrodite/entity-dna';
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
  personality: z.object({
    warmth: z.number().int().min(0).max(100),
    humor: z.number().int().min(0).max(100),
    confidence: z.number().int().min(0).max(100),
    curiosity: z.number().int().min(0).max(100),
    emotionalExpressiveness: z.number().int().min(0).max(100),
    responseLength: z.enum(['concise', 'balanced', 'expansive']),
    conversationStyle: z.enum(['supportive', 'playful', 'direct', 'reflective']),
    instructions: z.string().trim().max(2000),
  }),
});

const defaultDraft = {
  name: 'New Companion',
  tagline: 'An original Aphrodite companion',
  description: 'A warm, curious companion ready to grow through meaningful conversations.',
  greeting: "Hi. I'm excited to meet you and begin creating something meaningful together.",
  category: 'FRIENDLY' as const,
  traits: ['Warm', 'Curious', 'Creative'],
  personality: defaultPersonality,
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
        name: defaultDraft.name,
        tagline: defaultDraft.tagline,
        description: defaultDraft.description,
        greeting: defaultDraft.greeting,
        category: defaultDraft.category,
        traits: defaultDraft.traits,
        personality: {
          warmth: defaultDraft.personality.warmth,
          humor: defaultDraft.personality.humor,
          confidence: defaultDraft.personality.confidence,
          curiosity: defaultDraft.personality.curiosity,
          emotionalExpressiveness: defaultDraft.personality.emotionalExpressiveness,
          responseLength: defaultDraft.personality.responseLength,
          conversationStyle: defaultDraft.personality.conversationStyle,
          instructions: defaultDraft.personality.instructions,
        },
        slug: `draft-${session.user.id}-${Date.now()}`,
        avatarUrl: '',
        personalityPrompt: buildPersonalityPrompt(defaultDraft.traits, defaultDraft.personality),
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
    data: {
      ...parsed.data,
      personalityPrompt: buildPersonalityPrompt(parsed.data.traits, parsed.data.personality),
    },
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
  personality: unknown;
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
    personality: normalizePersonality(draft.personality),
  };
}

function normalizePersonality(value: unknown): Personality {
  const parsed = draftSchema.shape.personality.safeParse(value);
  return parsed.success ? parsed.data : defaultPersonality;
}

function buildPersonalityPrompt(traits: string[], personality: Personality) {
  const dimensions = [
    `warmth ${personality.warmth}/100`,
    `humor ${personality.humor}/100`,
    `confidence ${personality.confidence}/100`,
    `curiosity ${personality.curiosity}/100`,
    `emotional expressiveness ${personality.emotionalExpressiveness}/100`,
  ].join(', ');

  return [
    `Core traits: ${traits.join(', ') || 'Not specified'}.`,
    `Behavior dimensions: ${dimensions}.`,
    `Use a ${personality.conversationStyle} conversation style with ${personality.responseLength} responses.`,
    personality.instructions ? `Creator instructions: ${personality.instructions}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}
