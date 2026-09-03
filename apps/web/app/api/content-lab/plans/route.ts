import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@aphrodite/database';
import { auth } from '@/auth';
import { buildCharacterContext } from '@/lib/content-lab/character-context';
import { transformToOriginalConcept } from '@/lib/content-lab/originality-transformer';

const createSchema = z.object({
  characterId: z.string().cuid(),
  title: z.string().max(200),
  platforms: z.array(z.string().max(50)).min(1),
  days: z.number().int().min(1).max(90),
  postsPerDay: z.number().int().min(1).max(10),
  objectives: z.string().max(2000).optional(),
  constraints: z.string().max(2000).optional(),
  archetypes: z.array(z.string().max(50)).optional(),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const characterId = new URL(request.url).searchParams.get('characterId') ?? undefined;
  const plans = await db.contentPlan.findMany({
    where: { userId: session.user.id, ...(characterId ? { characterId } : {}) },
    include: { items: { orderBy: { sortOrder: 'asc' }, take: 50 } },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  return NextResponse.json({ plans });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Invalid data', details: parsed.error.flatten() },
      { status: 400 },
    );

  const character = await buildCharacterContext(parsed.data.characterId, session.user.id);
  if (!character) return NextResponse.json({ error: 'Character not found' }, { status: 404 });

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + parsed.data.days);

  const plan = await db.contentPlan.create({
    data: {
      userId: session.user.id,
      characterId: parsed.data.characterId,
      title: parsed.data.title,
      platforms: parsed.data.platforms,
      startDate,
      endDate,
      objectives: parsed.data.objectives,
      constraints: parsed.data.constraints,
    },
  });

  const archetypes = parsed.data.archetypes?.length
    ? parsed.data.archetypes
    : ['lifestyle', 'curiosity', 'transformation', 'story', 'tutorial'];

  const items = [];
  let sortOrder = 0;
  for (let day = 0; day < parsed.data.days; day++) {
    for (let post = 0; post < parsed.data.postsPerDay; post++) {
      const scheduledAt = new Date(startDate);
      scheduledAt.setDate(scheduledAt.getDate() + day);
      scheduledAt.setHours(9 + post * 4, 0, 0, 0);

      const archetype = archetypes[sortOrder % archetypes.length]!;
      const platform = parsed.data.platforms[post % parsed.data.platforms.length]!;

      const concept = transformToOriginalConcept({
        contentDna: { archetype },
        character,
        objective: parsed.data.objectives ?? 'engagement',
        platform,
        constraints: parsed.data.constraints,
      });

      const saved = await db.contentConcept.create({
        data: {
          userId: session.user.id,
          characterId: parsed.data.characterId,
          title: concept.title,
          concept: concept.concept,
          hook: concept.hook,
          script: concept.script,
          scenePlan: concept.scenePlan,
          shotList: concept.scenePlan,
          caption: concept.caption,
          hashtags: concept.hashtags,
          estimatedDuration: concept.estimatedDuration,
          generationPrompt: concept.generationPrompt,
          negativePrompt: concept.negativePrompt,
          platform,
          objective: parsed.data.objectives,
          originalityNotes: concept.originalityNotes,
          borrowedElements: concept.borrowedElements,
        },
      });

      items.push({
        planId: plan.id,
        conceptId: saved.id,
        scheduledAt,
        platform,
        archetype,
        hookSummary: concept.hook.slice(0, 200),
        status: 'IDEA' as const,
        sortOrder: sortOrder++,
      });
    }
  }

  await db.contentPlanItem.createMany({ data: items });

  const full = await db.contentPlan.findUnique({
    where: { id: plan.id },
    include: { items: { orderBy: { sortOrder: 'asc' }, include: { concept: true } } },
  });

  return NextResponse.json({ plan: full }, { status: 201 });
}
