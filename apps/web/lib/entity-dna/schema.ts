import { z } from 'zod';

export const entityFamilySchema = z.enum([
  'human',
  'animal',
  'fantasy',
  'robot',
  'alien',
  'mascot',
  'custom',
]);

export const biologicalSexSchema = z.enum([
  'female',
  'male',
  'intersex',
  'unknown',
  'not-applicable',
]);

export const entityIdentitySchema = z.object({
  name: z.string().trim().max(100).default(''),
  displayName: z.string().trim().max(100).default(''),
  age: z.number().int().min(0).max(10000).nullable().default(null),
  sex: biologicalSexSchema.default('unknown'),
  species: z.string().trim().max(100).default('human'),
  breedOrSubtype: z.string().trim().max(100).default(''),
  ethnicityOrLineage: z.string().trim().max(100).default(''),
  nationalityOrOrigin: z.string().trim().max(100).default(''),
  occupationOrRole: z.string().trim().max(150).default(''),
});

export const entityAppearanceSchema = z.object({
  height: z.string().trim().max(100).default(''),
  build: z.string().trim().max(100).default(''),
  skinOrCoatTone: z.string().trim().max(150).default(''),
  hairOrFur: z.string().trim().max(300).default(''),
  eyes: z.string().trim().max(300).default(''),
  distinguishingFeatures: z.string().trim().max(500).default(''),
});

export const entityGenerationDefaultsSchema = z.object({
  model: z
    .string()
    .trim()
    .default('flux1-schnell-fp8.safetensors'),
  width: z.number().int().min(256).max(4096).default(512),
  height: z.number().int().min(256).max(4096).default(512),
  steps: z.number().int().min(1).max(100).default(4),
  cfg: z.number().min(0).max(30).default(1),
});

export const entityMetadataSchema = z.object({
  schemaVersion: z.literal(1),
  entityVersion: z.number().int().positive().default(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const entityDnaSchema = z.object({
  id: z.string().uuid(),
  family: entityFamilySchema,
  identity: entityIdentitySchema,
  appearance: entityAppearanceSchema,
  generationDefaults: entityGenerationDefaultsSchema,
  metadata: entityMetadataSchema,
});

export type EntityDNA = z.infer<typeof entityDnaSchema>;
export type EntityFamily = z.infer<typeof entityFamilySchema>;
export type BiologicalSex = z.infer<typeof biologicalSexSchema>;
