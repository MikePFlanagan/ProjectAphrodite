import type {
  VideoGenerationProvider,
  GenerationProviderInfo,
  GenerationRequest,
  GenerationJobResult,
} from './types';

class MockGenerationProvider implements VideoGenerationProvider {
  readonly id = 'mock';
  readonly name = 'Development Mock';

  isConfigured() {
    return true;
  }

  async createJob(request: GenerationRequest): Promise<GenerationJobResult> {
    const jobId = `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return {
      providerJobId: jobId,
      status: 'completed',
      resultUrl: undefined,
      metadata: { note: 'Mock provider — no actual generation occurred', request },
    };
  }

  async getJobStatus(providerJobId: string): Promise<GenerationJobResult> {
    return {
      providerJobId,
      status: 'completed',
      metadata: { note: 'Mock provider — no actual generation occurred' },
    };
  }
}

const registry = new Map<string, VideoGenerationProvider>();
registry.set('mock', new MockGenerationProvider());

export function getProvider(id: string): VideoGenerationProvider | undefined {
  return registry.get(id);
}

export function listProviders(): GenerationProviderInfo[] {
  const providers: GenerationProviderInfo[] = [
    {
      id: 'mock',
      name: 'Development Mock',
      status: 'configured',
      capabilities: ['video', 'image'],
    },
    { id: 'seedance', name: 'Seedance', status: 'unconfigured', capabilities: ['video'] },
    { id: 'kling', name: 'Kling', status: 'unconfigured', capabilities: ['video'] },
    { id: 'veo', name: 'Veo', status: 'unconfigured', capabilities: ['video'] },
  ];
  return providers;
}

export function registerProvider(provider: VideoGenerationProvider) {
  registry.set(provider.id, provider);
}
