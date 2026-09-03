import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@aphrodite/database';
import { auth } from '@/auth';
import { getProvider, listProviders } from '@/lib/content-lab/generation-providers';

const createSchema = z.object({
  conceptId: z.string().cuid(),
  provider: z.string().max(50),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'providers') {
    return NextResponse.json({ providers: listProviders() });
  }

  const conceptId = url.searchParams.get('conceptId') ?? undefined;
  const jobs = await db.contentGenerationJob.findMany({
    where: { userId: session.user.id, ...(conceptId ? { conceptId } : {}) },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json({ jobs });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  const concept = await db.contentConcept.findFirst({
    where: { id: parsed.data.conceptId, userId: session.user.id },
  });
  if (!concept) return NextResponse.json({ error: 'Concept not found' }, { status: 404 });

  const provider = getProvider(parsed.data.provider);
  if (!provider || !provider.isConfigured()) {
    return NextResponse.json(
      { error: `Provider "${parsed.data.provider}" is not configured` },
      { status: 400 },
    );
  }

  const job = await db.contentGenerationJob.create({
    data: {
      userId: session.user.id,
      characterId: concept.characterId,
      conceptId: concept.id,
      provider: parsed.data.provider,
      status: 'QUEUED',
      request: {
        prompt: concept.generationPrompt,
        negativePrompt: concept.negativePrompt,
        duration: concept.estimatedDuration,
      },
    },
  });

  try {
    const result = await provider.createJob({
      prompt: concept.generationPrompt ?? '',
      negativePrompt: concept.negativePrompt ?? undefined,
      duration: concept.estimatedDuration ?? undefined,
    });

    await db.contentGenerationJob.update({
      where: { id: job.id },
      data: {
        providerJobId: result.providerJobId,
        status:
          result.status === 'completed'
            ? 'COMPLETED'
            : result.status === 'failed'
              ? 'FAILED'
              : 'PROCESSING',
        result: result.resultUrl
          ? { url: result.resultUrl }
          : result.metadata
            ? JSON.parse(JSON.stringify(result.metadata))
            : undefined,
        startedAt: new Date(),
        ...(result.status === 'completed' || result.status === 'failed'
          ? { completedAt: new Date() }
          : {}),
      },
    });
  } catch (err) {
    await db.contentGenerationJob.update({
      where: { id: job.id },
      data: { status: 'FAILED', error: err instanceof Error ? err.message : 'Unknown error' },
    });
  }

  const updated = await db.contentGenerationJob.findUnique({ where: { id: job.id } });
  return NextResponse.json({ job: updated }, { status: 201 });
}
