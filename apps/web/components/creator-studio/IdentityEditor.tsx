import { Plus, Sparkles, X } from 'lucide-react';

import type { CompanionDraft } from './types';

type IdentityEditorProps = {
  companion: CompanionDraft;
  onChange: (companion: CompanionDraft) => void;
};

const categories = [
  { value: 'FRIENDLY', label: 'Friendly' },
  { value: 'ROMANTIC', label: 'Romantic' },
  { value: 'MENTOR', label: 'Mentor' },
  { value: 'ADVENTURE', label: 'Adventure' },
  { value: 'FANTASY', label: 'Fantasy' },
  { value: 'SCI_FI', label: 'Sci-Fi' },
  { value: 'LIFESTYLE', label: 'Lifestyle' },
];

export function IdentityEditor({ companion, onChange }: IdentityEditorProps) {
  function updateField<Key extends keyof CompanionDraft>(key: Key, value: CompanionDraft[Key]) {
    const nextCompanion = {
      ...companion,
      [key]: value,
    };

    if (key === 'name') {
      nextCompanion.slug = createSlug(String(value));
    }

    onChange(nextCompanion);
  }

  function updateTrait(index: number, value: string) {
    const nextTraits = [...companion.traits];
    nextTraits[index] = value;

    updateField('traits', nextTraits);
  }

  function addTrait() {
    if (companion.traits.length >= 6) {
      return;
    }

    updateField('traits', [...companion.traits, '']);
  }

  function removeTrait(index: number) {
    updateField(
      'traits',
      companion.traits.filter((_, traitIndex) => traitIndex !== index),
    );
  }

  return (
    <div className="mt-8 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Character name">
          <input
            value={companion.name}
            onChange={(event) => updateField('name', event.target.value)}
            maxLength={60}
            placeholder="Enter a character name"
            className={inputClassName}
          />
        </Field>

        <Field label="URL slug">
          <input
            value={companion.slug}
            onChange={(event) => updateField('slug', createSlug(event.target.value))}
            maxLength={80}
            placeholder="character-name"
            className={inputClassName}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category">
          <select
            value={companion.category}
            onChange={(event) => updateField('category', event.target.value)}
            className={inputClassName}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value} className="bg-[#120d18]">
                {category.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Tagline" hint={`${companion.tagline.length}/100`}>
          <input
            value={companion.tagline}
            onChange={(event) => updateField('tagline', event.target.value)}
            maxLength={100}
            placeholder="A short memorable tagline"
            className={inputClassName}
          />
        </Field>
      </div>

      <Field label="Description" hint={`${companion.description.length}/600`}>
        <textarea
          value={companion.description}
          onChange={(event) => updateField('description', event.target.value)}
          maxLength={600}
          rows={5}
          placeholder="Describe who this companion is and what makes them distinct."
          className={`${inputClassName} resize-y leading-6`}
        />
      </Field>

      <Field label="Opening greeting" hint={`${companion.greeting.length}/500`}>
        <textarea
          value={companion.greeting}
          onChange={(event) => updateField('greeting', event.target.value)}
          maxLength={500}
          rows={5}
          placeholder="Write the first message users will receive."
          className={`${inputClassName} resize-y leading-6`}
        />
      </Field>

      <section className="rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white">Personality traits</p>

            <p className="mt-1 text-xs leading-5 text-white/35">
              Add up to six short traits that describe this companion.
            </p>
          </div>

          <button
            type="button"
            onClick={addTrait}
            disabled={companion.traits.length >= 6}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
          >
            <Plus className="size-3.5" />
            Add trait
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {companion.traits.map((trait, index) => (
            <div key={`trait-${index}`} className="flex items-center gap-2">
              <input
                value={trait}
                onChange={(event) => updateTrait(index, event.target.value)}
                maxLength={30}
                placeholder="Trait"
                className={inputClassName}
              />

              <button
                type="button"
                onClick={() => removeTrait(index)}
                aria-label={`Remove trait ${trait || index + 1}`}
                className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-white/30 transition hover:border-rose-200/20 hover:bg-rose-300/[0.06] hover:text-rose-100"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-[22px] border border-fuchsia-200/15 bg-fuchsia-300/[0.045] p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-fuchsia-200" />

          <div>
            <p className="text-sm font-medium text-white">Live preview enabled</p>

            <p className="text-white/38 mt-1 text-xs leading-5">
              Changes update the live preview immediately and save automatically after you pause.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClassName =
  'w-full rounded-xl border border-white/[0.09] bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-fuchsia-200/30 focus:bg-black/30 focus:ring-4 focus:ring-fuchsia-300/[0.05]';

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-5">
      <span className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-white/60">{label}</span>

        {hint ? <span className="text-[10px] text-white/25">{hint}</span> : null}
      </span>

      <span className="mt-3 block">{children}</span>
    </label>
  );
}

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
