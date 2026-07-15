import type {
  IdentityTrait,
  IdentityTraitKey,
} from './types';

const identityTraitLabels: Record<
  IdentityTraitKey,
  string
> = {
  face: 'Face',
  hair: 'Hair',
  eyes: 'Eyes',
  body: 'Body',
  age: 'Age',
  style: 'Style',
};

export function createEmptyIdentityTraits(): Record<
  IdentityTraitKey,
  IdentityTrait
> {
  return Object.fromEntries(
    Object.entries(identityTraitLabels).map(
      ([key, label]) => [
        key,
        {
          key,
          label,
          enabled: key !== 'style',
          captured: false,
          value: null,
          source: 'prompt',
          updatedAt: null,
        },
      ],
    ),
  ) as Record<IdentityTraitKey, IdentityTrait>;
}
