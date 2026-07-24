import { z } from 'zod';

import { db } from '@aphrodite/database';
import { auth } from '@/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  filename: z
    .string()
    .min(1)
    .max(500)
    .regex(/^[a-zA-Z0-9_. -]+$/),
  subfolder: z
    .string()
    .max(500)
    .regex(/^[a-zA-Z0-9_./ -]*$/),
  type: z.enum(['output', 'input', 'temp']),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    filename: url.searchParams.get('filename'),
    subfolder: url.searchParams.get('subfolder') ?? '',
    type: url.searchParams.get('type'),
  });
  if (!parsed.success || parsed.data.subfolder.includes('..')) {
    return Response.json({ error: 'Invalid image reference' }, { status: 400 });
  }

  const query = new URLSearchParams(parsed.data);
  const imageUrl = `/api/generated-image?${query}`;
  const ownedAsset = await db.creatorAsset.findFirst({
    where: { userId: session.user.id, imageUrl },
    select: { id: true },
  });
  if (!ownedAsset) {
    return Response.json({ error: 'Generated image not found' }, { status: 404 });
  }

  const comfyUrl = (process.env.COMFYUI_URL ?? 'http://127.0.0.1:8188').replace(/\/$/, '');

  try {
    const response = await fetch(`${comfyUrl}/view?${query}`, { cache: 'no-store' });
    if (!response.ok || !response.body) {
      return Response.json({ error: 'Generated image not found' }, { status: 404 });
    }
    return new Response(response.body, {
      headers: {
        'Content-Type': response.headers.get('content-type') ?? 'image/png',
        'Cache-Control': 'private, max-age=31536000, immutable',
      },
    });
  } catch {
    return Response.json({ error: 'Local FLUX is offline' }, { status: 503 });
  }
}
