import { z } from 'zod';

import { db } from '@aphrodite/database';

import { auth } from '@/auth';

export const runtime = 'nodejs';

const paramsSchema = z.object({
  id: z.string().cuid(),
});

const updateSchema = z.object({
  value: z.string().trim().min(1).max(500),
  importance: z.number().int().min(1).max(10),
});

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  const parsedParams = paramsSchema.safeParse(
    await context.params,
  );

  if (!parsedParams.success) {
    return Response.json(
      { error: 'Invalid memory id' },
      { status: 400 },
    );
  }

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return Response.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const parsedBody = updateSchema.safeParse(requestBody);

  if (!parsedBody.success) {
    return Response.json(
      {
        error: 'Invalid request',
        details: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  const memory = await db.memory.findFirst({
    where: {
      id: parsedParams.data.id,
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!memory) {
    return Response.json(
      { error: 'Memory not found' },
      { status: 404 },
    );
  }

  const updatedMemory = await db.memory.update({
    where: {
      id: memory.id,
    },
    data: {
      value: parsedBody.data.value,
      importance: parsedBody.data.importance,
    },
  });

  return Response.json({
    memory: updatedMemory,
  });
}

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  const parsedParams = paramsSchema.safeParse(
    await context.params,
  );

  if (!parsedParams.success) {
    return Response.json(
      { error: 'Invalid memory id' },
      { status: 400 },
    );
  }

  const memory = await db.memory.findFirst({
    where: {
      id: parsedParams.data.id,
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!memory) {
    return Response.json(
      { error: 'Memory not found' },
      { status: 404 },
    );
  }

  await db.memory.delete({
    where: {
      id: memory.id,
    },
  });

  return Response.json({
    success: true,
  });
}
