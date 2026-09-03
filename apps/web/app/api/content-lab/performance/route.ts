import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@aphrodite/database';
import { auth } from '@/auth';

const createSchema = z.object({
  characterId: z.string().cuid(),
  conceptId: z.string().cuid().optional(),
  platform: z.string().max(50),
  views: z.number().int().nonnegative().optional(),
  likes: z.number().int().nonnegative().optional(),
  comments: z.number().int().nonnegative().optional(),
  shares: z.number().int().nonnegative().optional(),
  saves: z.number().int().nonnegative().optional(),
  clicks: z.number().int().nonnegative().optional(),
  followersGained: z.number().int().optional(),
  revenue: z.number().nonnegative().optional(),
  measuredAt: z.string().datetime().optional(),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const characterId = new URL(request.url).searchParams.get('characterId') ?? undefined;
  const performances = await db.contentPerformance.findMany({
    where: { userId: session.user.id, ...(characterId ? { characterId } : {}) },
    include: { concept: { select: { id: true, title: true, platform: true } } },
    orderBy: { measuredAt: 'desc' },
    take: 100,
  });
  return NextResponse.json({ performances });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  const owns = await db.character.findFirst({
    where: { id: parsed.data.characterId, creatorId: session.user.id },
    select: { id: true },
  });
  if (!owns) return NextResponse.json({ error: 'Character not found' }, { status: 404 });

  const perf = await db.contentPerformance.create({
    data: {
      userId: session.user.id,
      characterId: parsed.data.characterId,
      conceptId: parsed.data.conceptId,
      platform: parsed.data.platform,
      views: parsed.data.views,
      likes: parsed.data.likes,
      comments: parsed.data.comments,
      shares: parsed.data.shares,
      saves: parsed.data.saves,
      clicks: parsed.data.clicks,
      followersGained: parsed.data.followersGained,
      revenue: parsed.data.revenue,
      measuredAt: parsed.data.measuredAt ? new Date(parsed.data.measuredAt) : new Date(),
    },
  });

  return NextResponse.json({ performance: perf }, { status: 201 });
}
