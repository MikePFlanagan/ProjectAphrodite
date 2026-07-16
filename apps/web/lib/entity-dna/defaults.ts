import type {
  EntityDNA,
  EntityFamily,
} from './schema';

export function createDefaultEntityDna(
  family: EntityFamily = 'human',
): EntityDNA {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    family,
    identity: {
      name: '',
      displayName: '',
      age: family === 'human' ? 18 : null,
      sex: 'unknown',
      species: family === 'human' ? 'human' : '',
      breedOrSubtype: '',
      ethnicityOrLineage: '',
      nationalityOrOrigin: '',
      occupationOrRole: '',
    },
    appearance: {
      height: '',
      build: '',
      skinOrCoatTone: '',
      hairOrFur: '',
      eyes: '',
      distinguishingFeatures: '',
    },
    generationDefaults: {
      model: 'flux1-schnell-fp8.safetensors',
      width: 512,
      height: 512,
      steps: 4,
      cfg: 1,
    },
    metadata: {
      schemaVersion: 1,
      entityVersion: 1,
      createdAt: now,
      updatedAt: now,
    },
  };
}
