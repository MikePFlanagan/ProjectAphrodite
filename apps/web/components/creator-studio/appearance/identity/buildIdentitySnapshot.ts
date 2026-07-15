import type { AppearanceAssetType } from '../types';

import { createEmptyIdentityTraits } from './config';
import type {
  CharacterIdentitySnapshot,
  IdentityPromptValues,
  IdentityTrait,
  IdentityTraitKey,
  IdentityTraitSource,
} from './types';

type BuildIdentitySnapshotInput = {
  characterId: string;
  identityVersion: number;
  assetType: AppearanceAssetType;
  promptValues: IdentityPromptValues;
  enabledTraitKeys: IdentityTraitKey[];
  previewImageUrl?: string | null;
  provider?: string;
  model?: string;
  seed?: number | null;
  promptVersion?: number;
};

function normalizeValue(
  value: string | undefined,
): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

function buildBodyValue(
  promptValues: IdentityPromptValues,
): string | null {
  const values = [
    promptValues.subject,
    promptValues.clothing,
    promptValues.pose,
  ]
    .map(normalizeValue)
    .filter(
      (value): value is string => value !== null,
    );

  return values.length > 0
    ? values.join(', ')
    : null;
}

function inferAgeValue(
  subject: string | undefined,
): string | null {
  const normalizedSubject = normalizeValue(subject);

  if (!normalizedSubject) {
    return null;
  }

  const agePatterns = [
    /\b(?:early|mid|late)\s+(?:teens|twenties|thirties|forties|fifties|sixties)\b/i,
    /\b\d{1,2}\s*(?:years?\s*old|year-old)\b/i,
    /\b(?:young adult|middle-aged|older adult)\b/i,
  ];

  for (const pattern of agePatterns) {
    const match = normalizedSubject.match(pattern);

    if (match?.[0]) {
      return match[0];
    }
  }

  return null;
}

function determineSource(
  hasPromptValue: boolean,
  hasReferenceImage: boolean,
): IdentityTraitSource {
  if (hasPromptValue && hasReferenceImage) {
    return 'prompt-and-reference';
  }

  return hasReferenceImage
    ? 'reference'
    : 'prompt';
}

export function buildIdentitySnapshot({
  characterId,
  identityVersion,
  assetType,
  promptValues,
  enabledTraitKeys,
  previewImageUrl = null,
  provider = 'mock',
  model = 'mock-placeholder',
  seed = null,
  promptVersion = 1,
}: BuildIdentitySnapshotInput): CharacterIdentitySnapshot {
  const now = new Date().toISOString();
  const emptyTraits = createEmptyIdentityTraits();
  const hasReferenceImage = Boolean(previewImageUrl);

  const traitValues: Record<
    IdentityTraitKey,
    string | null
  > = {
    face: normalizeValue(promptValues.subject),
    hair: normalizeValue(promptValues.hair),
    eyes: normalizeValue(promptValues.eyes),
    body: buildBodyValue(promptValues),
    age: inferAgeValue(promptValues.subject),
    style: normalizeValue(promptValues.style),
  };

  const traits = Object.fromEntries(
    Object.entries(emptyTraits).map(
      ([rawKey, emptyTrait]) => {
        const key = rawKey as IdentityTraitKey;
        const value = traitValues[key];
        const enabled =
          enabledTraitKeys.includes(key);

        const trait: IdentityTrait = {
          ...emptyTrait,
          enabled,
          captured:
            enabled &&
            (value !== null || hasReferenceImage),
          value,
          source: determineSource(
            value !== null,
            hasReferenceImage,
          ),
          updatedAt: enabled ? now : null,
        };

        return [key, trait];
      },
    ),
  ) as Record<IdentityTraitKey, IdentityTrait>;

  return {
    schemaVersion: '1.0',
    characterId,
    identityVersion,
    status: 'approved',
    traits,
    referenceAssets: previewImageUrl
      ? [
          {
            id: crypto.randomUUID(),
            role: 'primary-face-reference',
            version: identityVersion,
            imageUrl: previewImageUrl,
            createdAt: now,
          },
        ]
      : [],
    generationMetadata: {
      provider,
      model,
      seed,
      promptVersion,
      assetType,
      generatedAt: now,
    },
    createdAt: now,
    approvedAt: now,
  };
}
