import type { ImageGenerationRequest, ImageGenerationResult, ImageProvider } from './ImageProvider';

type GenerateResponse = {
  success: boolean;
  imageUrl?: string;
  error?: string;
};

const palettes: Array<[string, string, string]> = [
  ['#d946ef', '#7c3aed', '#312e81'],
  ['#ec4899', '#8b5cf6', '#1e1b4b'],
  ['#f43f5e', '#a855f7', '#3730a3'],
  ['#c026d3', '#6d28d9', '#0f172a'],
];

export class ComfyUiProvider implements ImageProvider {
  async generate(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
    const prompt = Object.values(request.promptValues)
      .map((value) => value.trim())
      .filter(Boolean)
      .join(', ');
    const seedText = `${request.assetType}:${prompt}:${request.variation}:${request.locks
      .filter((lock) => lock.enabled)
      .map((lock) => lock.id)
      .join(',')}`;
    const seed = [...seedText].reduce(
      (total, character) => (total * 31 + character.charCodeAt(0)) % 2_147_483_647,
      17,
    );
    const paletteIndex = seed % palettes.length;
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        width: request.assetType === 'portrait' ? 768 : 1024,
        height: request.assetType === 'portrait' ? 1024 : 768,
        steps: 4,
        cfg: 1,
        seed,
      }),
    });
    const data = (await response.json()) as GenerateResponse;

    if (!response.ok || !data.success || !data.imageUrl) {
      throw new Error(data.error || 'Local FLUX generation failed.');
    }

    return {
      ...request,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      prompt,
      palette: palettes[paletteIndex] ?? palettes[0]!,
      imageUrl: data.imageUrl,
    };
  }
}

export const comfyUiProvider = new ComfyUiProvider();
