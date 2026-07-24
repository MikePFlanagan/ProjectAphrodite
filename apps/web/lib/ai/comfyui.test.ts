import assert from 'node:assert/strict';
import test from 'node:test';

import { buildWorkflow, findImage } from './comfyui';

test('buildWorkflow maps validated generation fields to ComfyUI nodes', () => {
  const workflow = buildWorkflow({
    prompt: 'cinematic portrait',
    negativePrompt: 'blurry',
    width: 768,
    height: 1024,
    steps: 4,
    cfg: 1,
    seed: 42,
    sampler: 'euler',
    model: 'flux-test.safetensors',
  });

  assert.equal(workflow['38']?.inputs.text, 'cinematic portrait');
  assert.equal(workflow['33']?.inputs.text, 'blurry');
  assert.equal(workflow['27']?.inputs.width, 768);
  assert.equal(workflow['31']?.inputs.seed, 42);
  assert.equal(workflow['30']?.inputs.ckpt_name, 'flux-test.safetensors');
});

test('findImage returns the first valid ComfyUI output image', () => {
  assert.deepEqual(
    findImage({
      outputs: {
        '9': { images: [{ filename: 'result.png', subfolder: '', type: 'output' }] },
      },
    }),
    { filename: 'result.png', subfolder: '', type: 'output' },
  );
});
