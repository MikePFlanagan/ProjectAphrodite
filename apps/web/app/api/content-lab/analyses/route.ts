import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@aphrodite/database';
import { auth } from '@/auth';
import { runAnalysis, getAnalysesForUser } from '@/lib/content-lab/analysis-service';

const createSchema = z.object({
  referenceId: z.string().cuid(),
  characterId: z.string().cuid().optional(),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const characterId = new URL(request.url).searchParams.get('characterId') ?? undefined;
  const analyses = await getAnalysesForUser(session.user.id, characterId);
  return NextResponse.json({ analyses });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  const ref = await db.contentReference.findFirst({
    where: { id: parsed.data.referenceId, userId: session.user.id },
    select: { id: true },
  });
  if (!ref) return NextResponse.json({ error: 'Reference not found' }, { status: 404 });

  const analysis = await db.contentAnalysis.create({
    data: {
      userId: session.user.id,
      characterId: parsed.data.characterId,
      referenceId: parsed.data.referenceId,
      status: 'PENDING',
    },
  });

  runAnalysis(analysis.id).catch(() => {});

  return NextResponse.json({ analysis }, { status: 201 });
}
