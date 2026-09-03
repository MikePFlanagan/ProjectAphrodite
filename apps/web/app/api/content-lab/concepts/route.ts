import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@aphrodite/database';
import { auth } from '@/auth';
import { buildCharacterContext } from '@/lib/content-lab/character-context';
import { transformToOriginalConcept } from '@/lib/content-lab/originality-transformer';
import type { ContentDNA } from '@/lib/content-lab/types';

const createSchema = z.object({
  characterId: z.string().cuid(),
  analysisId: z.string().cuid().optional(),
  experimentId: z.string().cuid().optional(),
  objective: z.string().max(500),
  platform: z.string().max(50),
  constraints: z.string().max(2000).optional(),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const characterId = new URL(request.url).searchParams.get('characterId') ?? undefined;
  const concepts = await db.contentConcept.findMany({
    where: { userId: session.user.id, ...(characterId ? { characterId } : {}) },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json({ concepts });
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

  let contentDna: ContentDNA = {};
  if (parsed.data.analysisId) {
    const analysis = await db.contentAnalysis.findFirst({
      where: { id: parsed.data.analysisId, userId: session.user.id, status: 'COMPLETED' },
    });
    if (analysis) {
      contentDna = (analysis.contentDna as ContentDNA) ?? {};
    }
  }

  const result = transformToOriginalConcept({
    contentDna,
    character,
    objective: parsed.data.objective,
    platform: parsed.data.platform,
    constraints: parsed.data.constraints,
  });

  const concept = await db.contentConcept.create({
    data: {
      userId: session.user.id,
      characterId: parsed.data.characterId,
      analysisId: parsed.data.analysisId,
      experimentId: parsed.data.experimentId,
      title: result.title,
      concept: result.concept,
      hook: result.hook,
      script: result.script,
      scenePlan: result.scenePlan,
      shotList: result.scenePlan,
      caption: result.caption,
      hashtags: result.hashtags,
      estimatedDuration: result.estimatedDuration,
      generationPrompt: result.generationPrompt,
      negativePrompt: result.negativePrompt,
      platform: result.platform,
      objective: result.objective,
      originalityNotes: result.originalityNotes,
      borrowedElements: result.borrowedElements,
    },
  });

  return NextResponse.json({ concept }, { status: 201 });
}
