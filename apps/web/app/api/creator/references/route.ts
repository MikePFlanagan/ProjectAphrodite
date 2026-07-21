import { NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@aphrodite/database';
import { auth } from '@/auth';

const referenceSlotSchema = z.enum(['master', 'side', 'back']);

const saveReferenceSchema = z.object({
  slot: referenceSlotSchema,
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  sizeBytes: z.number().int().positive().max(5 * 1024 * 1024),
  dataUrl: z
    .string()
    .min(1)
    .refine(
      (value) =>
        value.startsWith('data:image/jpeg;base64,') ||
        value.startsWith('data:image/png;base64,') ||
        value.startsWith('data:image/webp;base64,'),
      'Unsupported image data.',
    ),
});

const deleteReferenceSchema = z.object({
  slot: referenceSlotSchema,
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const draft = await findOwnedDraft(session.user.id);

  if (!draft) {
    return NextResponse.json({ error: 'Draft not found.' }, { status: 404 });
  }

  const references = await db.creatorReference.findMany({
    where: {
      userId: session.user.id,
      characterId: draft.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return NextResponse.json({
    references: references.map((reference) => ({
      id: reference.id,
      slot: reference.slot,
      fileName: reference.fileName,
      mimeType: reference.mimeType,
      sizeBytes: reference.sizeBytes,
      dataUrl: reference.dataUrl,
      createdAt: reference.createdAt.toISOString(),
      updatedAt: reference.updatedAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: unknown = await request.json();
  const parsed = saveReferenceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid reference image.',
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const draft = await findOwnedDraft(session.user.id);

  if (!draft) {
    return NextResponse.json({ error: 'Draft not found.' }, { status: 404 });
  }

  const reference = await db.creatorReference.upsert({
    where: {
      characterId_slot: {
        characterId: draft.id,
        slot: parsed.data.slot,
      },
    },
    update: {
      userId: session.user.id,
      fileName: parsed.data.fileName,
      mimeType: parsed.data.mimeType,
      sizeBytes: parsed.data.sizeBytes,
      dataUrl: parsed.data.dataUrl,
    },
    create: {
      userId: session.user.id,
      characterId: draft.id,
      slot: parsed.data.slot,
      fileName: parsed.data.fileName,
      mimeType: parsed.data.mimeType,
      sizeBytes: parsed.data.sizeBytes,
      dataUrl: parsed.data.dataUrl,
    },
  });

  return NextResponse.json(
    {
      reference: {
        id: reference.id,
        slot: reference.slot,
        fileName: reference.fileName,
        mimeType: reference.mimeType,
        sizeBytes: reference.sizeBytes,
        dataUrl: reference.dataUrl,
        createdAt: reference.createdAt.toISOString(),
        updatedAt: reference.updatedAt.toISOString(),
      },
    },
    { status: 201 },
  );
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: unknown = await request.json();
  const parsed = deleteReferenceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid reference slot.' },
      { status: 400 },
    );
  }

  const draft = await findOwnedDraft(session.user.id);

  if (!draft) {
    return NextResponse.json({ error: 'Draft not found.' }, { status: 404 });
  }

  await db.creatorReference.deleteMany({
    where: {
      userId: session.user.id,
      characterId: draft.id,
      slot: parsed.data.slot,
    },
  });

  return NextResponse.json({ success: true });
}

async function findOwnedDraft(userId: string) {
  return db.character.findFirst({
    where: {
      creatorId: userId,
      isPublished: false,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      id: true,
    },
  });
}