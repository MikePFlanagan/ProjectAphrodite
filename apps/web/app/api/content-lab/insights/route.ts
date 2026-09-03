import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@aphrodite/database';
import { auth } from '@/auth';
import { generateInsights, persistInsights } from '@/lib/content-lab/learning-service';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const characterId = new URL(request.url).searchParams.get('characterId');
  if (!characterId) return NextResponse.json({ error: 'characterId required' }, { status: 400 });

  const insights = await db.contentInsight.findMany({
    where: { userId: session.user.id, characterId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json({ insights });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = z.object({ characterId: z.string().cuid() }).safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  const owns = await db.character.findFirst({
    where: { id: body.data.characterId, creatorId: session.user.id },
    select: { id: true },
  });
  if (!owns) return NextResponse.json({ error: 'Character not found' }, { status: 404 });

  const insights = await generateInsights(session.user.id, body.data.characterId);

  if (insights.length > 0) {
    await persistInsights(session.user.id, body.data.characterId, insights);
  }

  return NextResponse.json({ insights, generated: insights.length }, { status: 201 });
}
