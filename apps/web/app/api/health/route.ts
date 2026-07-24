import { db } from '@aphrodite/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;

    return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch {
    return Response.json(
      { status: 'unavailable' },
      { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
}
