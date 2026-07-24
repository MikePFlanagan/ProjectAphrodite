import type { ImageGenerationRequest, ImageGenerationResult, ImageProvider } from './ImageProvider';

const palettes: Array<[string, string, string]> = [
  ['#d946ef', '#7c3aed', '#312e81'],
  ['#ec4899', '#8b5cf6', '#1e1b4b'],
  ['#f43f5e', '#a855f7', '#3730a3'],
  ['#c026d3', '#6d28d9', '#0f172a'],
];

export class LocalMockProvider implements ImageProvider {
  async generate(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 900));

    const prompt = Object.values(request.promptValues)
      .map((value) => value.trim())
      .filter(Boolean)
      .join(', ');
    const seed = `${request.assetType}:${prompt}:${request.variation}:${request.locks
      .filter((lock) => lock.enabled)
      .map((lock) => lock.id)
      .join(',')}`;
    const paletteIndex =
      [...seed].reduce((total, character) => total + character.charCodeAt(0), 0) % palettes.length;

    return {
      ...request,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      prompt: prompt || 'A new Aphrodite companion',
      palette: palettes[paletteIndex] ?? palettes[0]!,
      imageUrl: null,
    };
  }
}

export const localMockProvider = new LocalMockProvider();
