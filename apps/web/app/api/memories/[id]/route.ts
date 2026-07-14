import { z } from 'zod';

import { db } from '@aphrodite/database';

import { auth } from '@/auth';

export const runtime = 'nodejs';

const paramsSchema = z.object({
  id: z.string().cuid(),
});

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
