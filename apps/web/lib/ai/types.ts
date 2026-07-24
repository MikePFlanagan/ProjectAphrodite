export interface GenerateImageRequest {
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  steps?: number;
  cfg?: number;
  seed?: number;
  sampler?: string;
  model?: string;
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  promptId?: string;
  error?: string;
}
