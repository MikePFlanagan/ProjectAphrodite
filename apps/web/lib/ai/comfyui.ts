import { randomUUID } from 'node:crypto';

import fluxSchnellWorkflow from './workflows/flux-schnell.json';
import type { GenerateImageRequest, GenerateImageResponse } from './types';

type WorkflowNode = {
  inputs: Record<string, unknown>;
  class_type: string;
};

type ComfyWorkflow = Record<string, WorkflowNode>;

type ComfyImageOutput = {
  filename: string;
  subfolder: string;
  type: string;
};

type ComfyHistoryEntry = {
  outputs?: Record<string, { images?: ComfyImageOutput[] }>;
  status?: { status_str?: string };
};

type QueueResponse = {
  prompt_id?: string;
  error?: string;
  node_errors?: Record<string, unknown>;
};

const DEFAULT_COMFYUI_URL = 'http://127.0.0.1:8188';
const DEFAULT_MODEL = 'flux1-schnell-fp8.safetensors';

function comfyUiUrl() {
  return (process.env.COMFYUI_URL ?? DEFAULT_COMFYUI_URL).replace(/\/$/, '');
}

function requiredNode(workflow: ComfyWorkflow, nodeId: string) {
  const node = workflow[nodeId];
  if (!node) throw new Error(`FLUX workflow node ${nodeId} is missing.`);
  return node;
}

export function buildWorkflow(request: GenerateImageRequest) {
  const workflow = structuredClone(fluxSchnellWorkflow) as ComfyWorkflow;
  requiredNode(workflow, '38').inputs.text = request.prompt;
  requiredNode(workflow, '33').inputs.text = request.negativePrompt ?? '';
  requiredNode(workflow, '27').inputs.width = request.width;
  requiredNode(workflow, '27').inputs.height = request.height;
  requiredNode(workflow, '30').inputs.ckpt_name =
    request.model ?? process.env.FLUX_MODEL ?? DEFAULT_MODEL;
  requiredNode(workflow, '31').inputs.seed =
    request.seed ?? Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  requiredNode(workflow, '31').inputs.steps = request.steps ?? 4;
  requiredNode(workflow, '31').inputs.cfg = request.cfg ?? 1;
  requiredNode(workflow, '31').inputs.sampler_name = request.sampler ?? 'euler';
  requiredNode(workflow, '9').inputs.filename_prefix = `Aphrodite_${Date.now()}`;
  return workflow;
}

async function queueWorkflow(workflow: ComfyWorkflow) {
  let response: Response;
  try {
    response = await fetch(`${comfyUiUrl()}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: workflow, client_id: randomUUID() }),
      cache: 'no-store',
    });
  } catch {
    throw new Error('Local FLUX is offline. Start ComfyUI and try again.');
  }

  const body = (await response.json()) as QueueResponse;
  if (!response.ok || !body.prompt_id) {
    throw new Error(
      body.error ||
        (body.node_errors ? JSON.stringify(body.node_errors) : '') ||
        `ComfyUI rejected the workflow (${response.status}).`,
    );
  }
  return body.prompt_id;
}

export function findImage(entry: ComfyHistoryEntry) {
  for (const output of Object.values(entry.outputs ?? {})) {
    const image = output.images?.[0];
    if (image) return image;
  }
  return null;
}

async function waitForImage(promptId: string) {
  const deadline = Date.now() + 10 * 60 * 1000;
  while (Date.now() < deadline) {
    const response = await fetch(`${comfyUiUrl()}/history/${promptId}`, {
      cache: 'no-store',
    });
    if (response.ok) {
      const history = (await response.json()) as Record<string, ComfyHistoryEntry>;
      const entry = history[promptId];
      if (entry) {
        const image = findImage(entry);
        if (image) return image;
        if (entry.status?.status_str === 'error') {
          throw new Error('Local FLUX reported a generation error.');
        }
      }
    }
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));
  }
  throw new Error('Local FLUX generation timed out after 10 minutes.');
}

function imageUrl(image: ComfyImageOutput) {
  const query = new URLSearchParams({
    filename: image.filename,
    subfolder: image.subfolder,
    type: image.type,
  });
  return `/api/generated-image?${query}`;
}

export async function generateWithComfyUI(
  request: GenerateImageRequest,
): Promise<GenerateImageResponse> {
  try {
    const promptId = await queueWorkflow(buildWorkflow(request));
    const image = await waitForImage(promptId);
    return { success: true, imageUrl: imageUrl(image), promptId };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown local FLUX generation error.',
    };
  }
}
