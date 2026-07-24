import { auth } from '@/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ status: 'unauthorized' }, { status: 401 });
  }

  const baseUrl = (process.env.COMFYUI_URL ?? 'http://127.0.0.1:8188').replace(/\/$/, '');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3_000);

  try {
    const response = await fetch(`${baseUrl}/system_stats`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!response.ok) {
      return Response.json({ status: 'unavailable' }, { status: 503 });
    }
    return Response.json({
      status: 'ok',
      provider: 'comfyui',
      model: process.env.FLUX_MODEL ?? 'flux1-schnell-fp8.safetensors',
    });
  } catch {
    return Response.json({ status: 'unavailable' }, { status: 503 });
  } finally {
    clearTimeout(timeout);
  }
}
