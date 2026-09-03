import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@aphrodite/database';
import { auth } from '@/auth';

const createSchema = z.object({
  characterId: z.string().cuid(),
  title: z.string().max(200),
  hypothesis: z.string().max(2000).optional(),
  variable: z.string().max(100),
  variants: z.array(z.object({ name: z.string().max(100), description: z.string().max(500).optional() })).min(2).max(10),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const characterId = new URL(request.url).searchParams.get('characterId') ?? undefined;
  const experiments = await db.contentExperiment.findMany({
    where: { userId: session.user.id, ...(characterId ? { characterId } : {}) },
    include: { concepts: { select: { id: true, title: true } } },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  return NextResponse.json({ experiments });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  const owns = await db.character.findFirst({ where: { id: parsed.data.characterId, creatorId: session.user.id }, select: { id: true } });
  if (!owns) return NextResponse.json({ error: 'Character not found' }, { status: 404 });

  const experiment = await db.contentExperiment.create({
    data: {
      userId: session.user.id,
      characterId: parsed.data.characterId,
      title: parsed.data.title,
      hypothesis: parsed.data.hypothesis,
      variable: parsed.data.variable,
      variants: parsed.data.variants,
    },
  });

  return NextResponse.json({ experiment }, { status: 201 });
}
