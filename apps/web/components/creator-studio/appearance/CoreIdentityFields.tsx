import type {
  BiologicalSex,
  EntityDNA,
  EntityFamily,
} from '../../../lib/entity-dna';

type CoreIdentityFieldsProps = {
  entityDna: EntityDNA;
  onFamilyChange: (family: EntityFamily) => void;
  onIdentityChange: (
    field: keyof EntityDNA['identity'],
    value: string | number | null,
  ) => void;
};

const entityFamilies: Array<{
  value: EntityFamily;
  label: string;
}> = [
  { value: 'human', label: 'Human' },
  { value: 'animal', label: 'Animal' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'robot', label: 'Robot' },
  { value: 'alien', label: 'Alien' },
  { value: 'mascot', label: 'Mascot' },
  { value: 'custom', label: 'Custom' },
];

const biologicalSexOptions: Array<{
  value: BiologicalSex;
  label: string;
}> = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'intersex', label: 'Intersex' },
  { value: 'unknown', label: 'Unknown' },
  {
    value: 'not-applicable',
    label: 'Not applicable',
  },
];

export function CoreIdentityFields({
  entityDna,
  onFamilyChange,
  onIdentityChange,
}: CoreIdentityFieldsProps) {
  const { identity } = entityDna;

  return (
    <section className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-5">
      <div>
        <p className="text-sm font-semibold text-white">
          Entity DNA
        </p>

        <p className="mt-1 text-xs leading-5 text-white/35">
          Define the persistent identity that will guide
          every image, asset, and future interaction.
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block min-w-0">
          <span className="text-xs font-semibold text-white/65">
            Entity Family
          </span>

          <select
            value={entityDna.family}
            onChange={(event) =>
              onFamilyChange(
                event.target.value as EntityFamily,
              )
            }
            className="mt-2 h-11 w-full rounded-xl border border-white/[0.09] bg-black/25 px-3 text-sm text-white outline-none transition focus:border-fuchsia-300/40 focus:ring-2 focus:ring-fuchsia-400/10"
          >
            {entityFamilies.map((family) => (
              <option
                key={family.value}
                value={family.value}
                className="bg-neutral-950"
              >
                {family.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block min-w-0">
          <span className="text-xs font-semibold text-white/65">
            Name
          </span>

          <input
            type="text"
            maxLength={100}
            value={identity.name}
            onChange={(event) =>
              onIdentityChange(
                'name',
                event.target.value,
              )
            }
            placeholder="Example: Sophia"
            className="mt-2 h-11 w-full rounded-xl border border-white/[0.09] bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-fuchsia-300/40 focus:ring-2 focus:ring-fuchsia-400/10"
          />
        </label>

        <label className="block min-w-0">
          <span className="text-xs font-semibold text-white/65">
            Species
          </span>

          <input
            type="text"
            maxLength={100}
            value={identity.species}
            onChange={(event) =>
              onIdentityChange(
                'species',
                event.target.value,
              )
            }
            placeholder={
              entityDna.family === 'animal'
                ? 'Example: wolf'
                : 'Example: human'
            }
            className="mt-2 h-11 w-full rounded-xl border border-white/[0.09] bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-fuchsia-300/40 focus:ring-2 focus:ring-fuchsia-400/10"
          />
        </label>

        <label className="block min-w-0">
          <span className="text-xs font-semibold text-white/65">
            Breed or Subtype
          </span>

          <input
            type="text"
            maxLength={100}
            value={identity.breedOrSubtype}
            onChange={(event) =>
              onIdentityChange(
                'breedOrSubtype',
                event.target.value,
              )
            }
            placeholder="Example: arctic wolf"
            className="mt-2 h-11 w-full rounded-xl border border-white/[0.09] bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-fuchsia-300/40 focus:ring-2 focus:ring-fuchsia-400/10"
          />
        </label>

        <label className="block min-w-0">
          <span className="text-xs font-semibold text-white/65">
            Sex
          </span>

          <select
            value={identity.sex}
            onChange={(event) =>
              onIdentityChange(
                'sex',
                event.target.value as BiologicalSex,
              )
            }
            className="mt-2 h-11 w-full rounded-xl border border-white/[0.09] bg-black/25 px-3 text-sm text-white outline-none transition focus:border-fuchsia-300/40 focus:ring-2 focus:ring-fuchsia-400/10"
          >
            {biologicalSexOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-neutral-950"
              >
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block min-w-0">
          <span className="text-xs font-semibold text-white/65">
            Age
          </span>

          <input
            type="number"
            min={entityDna.family === 'human' ? 18 : 0}
            max={10000}
            step={1}
            inputMode="numeric"
            value={identity.age ?? ''}
            onChange={(event) => {
              const rawValue = event.target.value;

              onIdentityChange(
                'age',
                rawValue === ''
                  ? null
                  : Number.parseInt(rawValue, 10),
              );
            }}
            placeholder="Example: 28"
            className="mt-2 h-11 w-full rounded-xl border border-white/[0.09] bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-fuchsia-300/40 focus:ring-2 focus:ring-fuchsia-400/10"
          />

          <span className="mt-2 block text-[11px] leading-4 text-white/25">
            Human entities must be adults. Other entity
            families may use age zero or higher.
          </span>
        </label>
      </div>
    </section>
  );
}
