import { randomUUID } from 'node:crypto';

import fluxSchnellWorkflow from './workflows/flux-schnell.json';
import type {
  GenerateImageRequest,
  GenerateImageResponse,
} from './types';

type WorkflowNode = {
  inputs: Record<string, unknown>;
  class_type: string;
  _meta?: {
    title?: string;
  };
};

type ComfyWorkflow = Record<string, WorkflowNode>;

type ComfyImageOutput = {
  filename: string;
  subfolder: string;
  type: string;
};

type ComfyHistoryEntry = {
  outputs?: Record<
    string,
    {
      images?: ComfyImageOutput[];
    }
  >;
  status?: {
    status_str?: string;
    completed?: boolean;
    messages?: unknown[];
  };
};

type QueueResponse = {
  prompt_id?: string;
  error?: string;
  node_errors?: Record<string, unknown>;
};

const DEFAULT_COMFYUI_URL =
  'http://127.0.0.1:8188';

const DEFAULT_MODEL =
  'flux1-schnell-fp8.safetensors';

const WORKFLOW_NODES = {
  vaeDecode: '8',
  saveImage: '9',
  latentImage: '27',
  checkpoint: '30',
  sampler: '31',
  negativePrompt: '33',
  positivePrompt: '38',
} as const;

function getComfyUiUrl(): string {
  return (
    process.env.COMFYUI_URL ??
    DEFAULT_COMFYUI_URL
  ).replace(/\/$/, '');
}

function sleep(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function cloneWorkflow(): ComfyWorkflow {
  return structuredClone(
    fluxSchnellWorkflow,
  ) as ComfyWorkflow;
}

function requireNode(
  workflow: ComfyWorkflow,
  nodeId: string,
): WorkflowNode {
  const node = workflow[nodeId];

  if (!node) {
    throw new Error(
      `Required ComfyUI workflow node ${nodeId} is missing.`,
    );
  }

  return node;
}

function createWorkflow(
  request: GenerateImageRequest,
) {
  const workflow = cloneWorkflow();

  const positivePrompt = requireNode(
    workflow,
    WORKFLOW_NODES.positivePrompt,
  );

  const negativePrompt = requireNode(
    workflow,
    WORKFLOW_NODES.negativePrompt,
  );

  const latentImage = requireNode(
    workflow,
    WORKFLOW_NODES.latentImage,
  );

  const checkpoint = requireNode(
    workflow,
    WORKFLOW_NODES.checkpoint,
  );

  const sampler = requireNode(
    workflow,
    WORKFLOW_NODES.sampler,
  );

  const saveImage = requireNode(
    workflow,
    WORKFLOW_NODES.saveImage,
  );

  const seed =
    request.seed ??
    Math.floor(
      Math.random() * Number.MAX_SAFE_INTEGER,
    );

  positivePrompt.inputs.text = request.prompt;

  negativePrompt.inputs.text =
    request.negativePrompt ?? '';

  latentImage.inputs.width = request.width;
  latentImage.inputs.height = request.height;
  latentImage.inputs.batch_size = 1;

  checkpoint.inputs.ckpt_name =
    request.model ?? DEFAULT_MODEL;

  sampler.inputs.seed = seed;
  sampler.inputs.steps = request.steps ?? 4;
  sampler.inputs.cfg = request.cfg ?? 1;
  sampler.inputs.sampler_name =
    request.sampler ?? 'euler';
  sampler.inputs.scheduler = 'simple';
  sampler.inputs.denoise = 1;

  saveImage.inputs.filename_prefix =
    `Aphrodite_${Date.now()}`;

  return {
    workflow,
    seed,
  };
}

async function queueWorkflow(
  workflow: ComfyWorkflow,
): Promise<string> {
  const response = await fetch(
    `${getComfyUiUrl()}/prompt`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: workflow,
        client_id: randomUUID(),
      }),
      cache: 'no-store',
    },
  );

  const body =
    (await response.json()) as QueueResponse;

  if (!response.ok || !body.prompt_id) {
    const nodeErrors = body.node_errors
      ? JSON.stringify(body.node_errors)
      : '';

    throw new Error(
      body.error ||
        nodeErrors ||
        `ComfyUI rejected the workflow with status ${response.status}.`,
    );
  }

  return body.prompt_id;
}

function findGeneratedImage(
  entry: ComfyHistoryEntry,
): ComfyImageOutput | null {
  if (!entry.outputs) {
    return null;
  }

  for (const output of Object.values(
    entry.outputs,
  )) {
    const image = output.images?.[0];

    if (image) {
      return image;
    }
  }

  return null;
}

async function waitForImage(
  promptId: string,
): Promise<ComfyImageOutput> {
  const timeoutMilliseconds = 10 * 60 * 1000;
  const pollIntervalMilliseconds = 1500;
  const startedAt = Date.now();

  while (
    Date.now() - startedAt <
    timeoutMilliseconds
  ) {
    const response = await fetch(
      `${getComfyUiUrl()}/history/${promptId}`,
      {
        cache: 'no-store',
      },
    );

    if (response.ok) {
      const history = (await response.json()) as Record<
        string,
        ComfyHistoryEntry
      >;

      const entry = history[promptId];

      if (entry) {
        const image = findGeneratedImage(entry);

        if (image) {
          return image;
        }

        if (
          entry.status?.status_str === 'error'
        ) {
          throw new Error(
            'ComfyUI reported a generation error.',
          );
        }
      }
    }

    await sleep(pollIntervalMilliseconds);
  }

  throw new Error(
    'ComfyUI generation timed out after 10 minutes.',
  );
}

async function downloadImageAsDataUrl(
  image: ComfyImageOutput,
): Promise<string> {
  const query = new URLSearchParams({
    filename: image.filename,
    subfolder: image.subfolder,
    type: image.type,
  });

  const response = await fetch(
    `${getComfyUiUrl()}/view?${query.toString()}`,
    {
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to retrieve generated image from ComfyUI (${response.status}).`,
    );
  }

  const contentType =
    response.headers.get('content-type') ??
    'image/png';

  const imageBuffer = Buffer.from(
    await response.arrayBuffer(),
  );

  return `data:${contentType};base64,${imageBuffer.toString(
    'base64',
  )}`;
}

export async function generateWithComfyUI(
  request: GenerateImageRequest,
): Promise<GenerateImageResponse> {
  try {
    const { workflow } = createWorkflow(request);

    const promptId =
      await queueWorkflow(workflow);

    const generatedImage =
      await waitForImage(promptId);

    const imageUrl =
      await downloadImageAsDataUrl(
        generatedImage,
      );

    return {
      success: true,
      imageUrl,
      promptId,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown ComfyUI generation error.',
    };
  }
}
