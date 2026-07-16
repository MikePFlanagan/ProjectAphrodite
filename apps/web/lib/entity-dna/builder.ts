import {
  entityDnaSchema,
  type EntityDNA,
} from './schema';

export function buildEntityDna(
  input: unknown,
): EntityDNA {
  return entityDnaSchema.parse(input);
}

export function updateEntityDna(
  entity: EntityDNA,
  update: Partial<EntityDNA>,
): EntityDNA {
  return entityDnaSchema.parse({
    ...entity,
    ...update,
    metadata: {
      ...entity.metadata,
      ...update.metadata,
      updatedAt: new Date().toISOString(),
    },
  });
}
