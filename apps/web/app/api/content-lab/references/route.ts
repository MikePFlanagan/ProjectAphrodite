import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@aphrodite/database';
import { auth } from '@/auth';

const createSchema = z.object({
  characterId: z.string().cuid().optional(),
  sourceType: z.enum(['UPLOAD', 'URL', 'MANUAL']),
  sourceUrl: z.string().url().max(2000).optional(),
  platform: z.string().max(50).optional(),
  title: z.string().max(200).optional(),
  description: z.string().max(5000).optional(),
  mediaUrl: z.string().max(5000).optional(),
  mediaMimeType: z.string().max(100).optional(),
  duration: z.number().positive().optional(),
  creatorName: z.string().max(200).optional(),
  publishedAt: z.string().datetime().optional(),
  views: z.number().int().nonnegative().optional(),
  likes: z.number().int().nonnegative().optional(),
  comments: z.number().int().nonnegative().optional(),
  shares: z.number().int().nonnegative().optional(),
  saves: z.number().int().nonnegative().optional(),
  followersAtPublish: z.number().int().nonnegative().optional(),
  metadata: z.record(z.string()).optional(),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const characterId = url.searchParams.get('characterId') ?? undefined;

  const references = await db.contentReference.findMany({
    where: { userId: session.user.id, ...(characterId ? { characterId } : {}) },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return NextResponse.json({ references });
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

  if (parsed.data.characterId) {
    const owns = await db.character.findFirst({
      where: { id: parsed.data.characterId, creatorId: session.user.id },
      select: { id: true },
    });
    if (!owns) return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  }

  const reference = await db.contentReference.create({
    data: {
      userId: session.user.id,
      characterId: parsed.data.characterId,
      sourceType: parsed.data.sourceType,
      sourceUrl: parsed.data.sourceUrl,
      platform: parsed.data.platform,
      title: parsed.data.title,
      description: parsed.data.description,
      mediaUrl: parsed.data.mediaUrl,
      mediaMimeType: parsed.data.mediaMimeType,
      duration: parsed.data.duration,
      creatorName: parsed.data.creatorName,
      publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : undefined,
      views: parsed.data.views,
      likes: parsed.data.likes,
      comments: parsed.data.comments,
      shares: parsed.data.shares,
      saves: parsed.data.saves,
      followersAtPublish: parsed.data.followersAtPublish,
      metadata: parsed.data.metadata ?? {},
    },
  });

  return NextResponse.json({ reference }, { status: 201 });
}
