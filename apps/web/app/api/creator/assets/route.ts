import { NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@aphrodite/database';
import { auth } from '@/auth';

const assetTypes = ['portrait', 'full-body', 'expression', 'outfit', 'scene', 'video'] as const;
const createAssetSchema = z.object({
  draftId: z.string().cuid(),
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
  imageUrl: z.string().startsWith('/api/generated-image?').max(2_000).nullable(),
});

const draftIdSchema = z.string().cuid();

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const draftId = draftIdSchema.safeParse(new URL(request.url).searchParams.get('draftId'));
  if (!draftId.success)
    return NextResponse.json({ error: 'Invalid character draft.' }, { status: 400 });
  const draft = await findOwnedDraft(draftId.data, session.user.id);
  if (!draft) return NextResponse.json({ error: 'Draft not found.' }, { status: 404 });

  const assets = await db.creatorAsset.findMany({
    where: { userId: session.user.id, characterId: draft.id },
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

  const draft = await findOwnedDraft(parsed.data.draftId, session.user.id);
  if (!draft) return NextResponse.json({ error: 'Draft not found.' }, { status: 404 });

  const asset = await db.creatorAsset.create({
    data: {
      assetType: parsed.data.assetType,
      prompt: parsed.data.prompt,
      promptValues: parsed.data.promptValues,
      locks: parsed.data.locks,
      variation: parsed.data.variation,
      palette: parsed.data.palette,
      imageUrl: parsed.data.imageUrl,
      provider: parsed.data.imageUrl ? 'comfyui-flux-schnell' : 'mock',
      userId: session.user.id,
      characterId: draft.id,
    },
  });

  return NextResponse.json({ asset }, { status: 201 });
}

function findOwnedDraft(draftId: string, userId: string) {
  return db.character.findFirst({
    where: { id: draftId, creatorId: userId, isPublished: false },
    select: { id: true },
  });
}
