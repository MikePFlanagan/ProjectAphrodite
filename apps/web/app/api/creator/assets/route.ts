import { NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@aphrodite/database';
import { auth } from '@/auth';

const assetTypes = ['portrait', 'full-body', 'expression', 'outfit', 'scene', 'video'] as const;
const createAssetSchema = z.object({
  assetType: z.enum(assetTypes),
  prompt: z.string().trim().min(1).max(2000),
  promptValues: z.record(z.string(), z.string().max(500)),
  locks: z.array(
    z.object({
      id: z.string().min(1).max(100),
      label: z.string().min(1).max(100),
      enabled: z.boolean(),
    }),
  ),
  variation: z.number().int().positive().max(10_000),
  palette: z.tuple([
    z.string().regex(/^#[0-9a-f]{6}$/i),
    z.string().regex(/^#[0-9a-f]{6}$/i),
    z.string().regex(/^#[0-9a-f]{6}$/i),
  ]),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const assets = await db.creatorAsset.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json({ assets });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = createAssetSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid creator asset.' }, { status: 400 });
  }

  const asset = await db.creatorAsset.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  return NextResponse.json({ asset }, { status: 201 });
}
