import { NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@aphrodite/database';

import { auth } from '@/auth';

const memoryValueSchema = z.string().trim().min(1).max(500);
const importanceSchema = z.number().int().min(1).max(5);

const createMemorySchema = z.object({
  characterId: z.string().cuid(),
  label: z.string().trim().min(1).max(64),
  value: memoryValueSchema,
  importance: importanceSchema,
});

const updateMemorySchema = z.object({
  id: z.string().cuid(),
  value: memoryValueSchema,
  importance: importanceSchema,
});

const deleteMemorySchema = z.object({ id: z.string().cuid() });

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [memories, conversations] = await Promise.all([
    db.memory.findMany({
      where: { userId: session.user.id, isForgotten: false },
      include: { character: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: [{ updatedAt: 'desc' }, { importance: 'desc' }],
    }),
    db.conversation.findMany({
      where: { userId: session.user.id },
      select: { character: { select: { id: true, name: true } } },
      orderBy: { lastMessageAt: 'desc' },
    }),
  ]);

  const characters = Array.from(
    new Map(conversations.map(({ character }) => [character.id, character])).values(),
  );

  return NextResponse.json({
    memories: memories.map((memory) => ({
      id: memory.id,
      key: memory.key,
      value: memory.value,
      importance: memory.importance,
      updatedAt: memory.updatedAt.toISOString(),
      character: memory.character,
    })),
    characters,
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = createMemorySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid memory.' }, { status: 400 });

  const relationship = await db.conversation.findFirst({
    where: { userId: session.user.id, characterId: parsed.data.characterId },
    select: { id: true },
  });
  if (!relationship)
    return NextResponse.json({ error: 'Start a conversation first.' }, { status: 403 });

  const key = toMemoryKey(parsed.data.label);
  if (!key) return NextResponse.json({ error: 'Use a clearer memory label.' }, { status: 400 });

  const existing = await db.memory.findUnique({
    where: {
      userId_characterId_key: {
        userId: session.user.id,
        characterId: parsed.data.characterId,
        key,
      },
    },
    select: { id: true },
  });
  if (existing) {
    const forgotten = await db.memory.findFirst({
      where: { id: existing.id, userId: session.user.id, isForgotten: true },
      select: { id: true },
    });
    if (forgotten) {
      await db.$transaction([
        db.memory.update({
          where: { id: forgotten.id },
          data: {
            value: parsed.data.value,
            importance: parsed.data.importance,
            isUserManaged: true,
            isForgotten: false,
          },
        }),
        clearCharacterSummaries(session.user.id, parsed.data.characterId),
      ]);
      return NextResponse.json({ ok: true }, { status: 201 });
    }
    return NextResponse.json(
      { error: 'A memory with that label already exists. Edit it instead.' },
      { status: 409 },
    );
  }

  await db.$transaction([
    db.memory.create({
      data: {
        userId: session.user.id,
        characterId: parsed.data.characterId,
        key,
        value: parsed.data.value,
        importance: parsed.data.importance,
        isUserManaged: true,
      },
    }),
    clearCharacterSummaries(session.user.id, parsed.data.characterId),
  ]);

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = updateMemorySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid memory update.' }, { status: 400 });

  const memory = await db.memory.findFirst({
    where: { id: parsed.data.id, userId: session.user.id },
    select: { id: true, characterId: true },
  });
  if (!memory) return NextResponse.json({ error: 'Memory not found.' }, { status: 404 });

  await db.$transaction([
    db.memory.update({
      where: { id: memory.id },
      data: {
        value: parsed.data.value,
        importance: parsed.data.importance,
        isUserManaged: true,
        isForgotten: false,
      },
    }),
    clearCharacterSummaries(session.user.id, memory.characterId),
  ]);

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = deleteMemorySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid memory.' }, { status: 400 });

  const memory = await db.memory.findFirst({
    where: { id: parsed.data.id, userId: session.user.id },
    select: { id: true, characterId: true },
  });
  if (!memory) return NextResponse.json({ error: 'Memory not found.' }, { status: 404 });

  await db.$transaction([
    db.memory.update({
      where: { id: memory.id },
      data: { value: '', isUserManaged: true, isForgotten: true },
    }),
    clearCharacterSummaries(session.user.id, memory.characterId),
  ]);

  return NextResponse.json({ ok: true });
}

function toMemoryKey(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

function clearCharacterSummaries(userId: string, characterId: string) {
  return db.conversation.updateMany({
    where: { userId, characterId },
    data: { summary: null, summaryUpdatedAt: null },
  });
}
