import {
  entityDnaSchema,
  type EntityDNA,
} from './schema';

export type EntityDnaValidationResult =
  | {
      success: true;
      data: EntityDNA;
    }
  | {
      success: false;
      errors: string[];
    };

export function validateEntityDna(
  input: unknown,
): EntityDnaValidationResult {
  const result = entityDnaSchema.safeParse(input);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    errors: result.error.issues.map((issue) => {
      const path = issue.path.join('.');
      return path
        ? `${path}: ${issue.message}`
        : issue.message;
    }),
  };
}
