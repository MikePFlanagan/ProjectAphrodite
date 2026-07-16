import { z } from 'zod';

import { generateWithComfyUI } from '@/lib/ai/comfyui';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const generateRequestSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(3)
    .max(12_000),

  negativePrompt: z
    .string()
    .trim()
    .max(4_000)
    .optional(),

  width: z
    .number()
    .int()
    .min(256)
    .max(1536)
    .multipleOf(8)
    .default(512),

  height: z
    .number()
    .int()
    .min(256)
    .max(1536)
    .multipleOf(8)
    .default(512),

  steps: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(4),

  cfg: z
    .number()
    .min(0)
    .max(30)
    .default(1),

  seed: z
    .number()
    .int()
    .nonnegative()
    .max(Number.MAX_SAFE_INTEGER)
    .optional(),

  sampler: z
    .string()
    .trim()
    .min(1)
    .default('euler'),

  model: z
    .string()
    .trim()
    .min(1)
    .default(
      'flux1-schnell-fp8.safetensors',
    ),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        success: false,
        error: 'Request body must be valid JSON.',
      },
      {
        status: 400,
      },
    );
  }

  const parsed =
    generateRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        success: false,
        error: 'Invalid generation request.',
        details: parsed.error.flatten(),
      },
      {
        status: 400,
      },
    );
  }

  const result = await generateWithComfyUI({
    prompt: parsed.data.prompt,
    width: parsed.data.width,
    height: parsed.data.height,
    steps: parsed.data.steps,
    cfg: parsed.data.cfg,
    sampler: parsed.data.sampler,
    model: parsed.data.model,

    ...(parsed.data.negativePrompt
      ? {
          negativePrompt:
            parsed.data.negativePrompt,
        }
      : {}),

    ...(parsed.data.seed !== undefined
      ? {
          seed: parsed.data.seed,
        }
      : {}),
  });

  return Response.json(result, {
    status: result.success ? 200 : 502,
  });
}
