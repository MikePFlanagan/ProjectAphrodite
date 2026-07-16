import type { EntityDNA } from '../../../../lib/entity-dna';

type EntitySummaryCardProps = {
  entityDna: EntityDNA;
};

function formatLabel(value: string): string {
  return value
    .trim()
    .split(/[-\s]+/)
    .filter(Boolean)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1).toLowerCase(),
    )
    .join(' ');
}

function getSpeciesLabel(entityDna: EntityDNA): string {
  const { species, breedOrSubtype } =
    entityDna.identity;

  if (breedOrSubtype.trim()) {
    return formatLabel(breedOrSubtype);
  }

  if (species.trim()) {
    return formatLabel(species);
  }

  return 'Not specified';
}

export function EntitySummaryCard({
  entityDna,
}: EntitySummaryCardProps) {
  const { identity } = entityDna;

  const items = [
    {
      label: 'Family',
      value: formatLabel(entityDna.family),
    },
    {
      label: 'Species',
      value: getSpeciesLabel(entityDna),
    },
    {
      label: 'Sex',
      value:
        identity.sex === 'unknown'
          ? 'Not specified'
          : formatLabel(identity.sex),
    },
    {
      label: 'Age',
      value:
        identity.age === null
          ? 'Not specified'
          : `${identity.age} ${
              identity.age === 1 ? 'year' : 'years'
            }`,
    },
  ];

  return (
    <section className="overflow-hidden rounded-[20px] border border-fuchsia-200/10 bg-fuchsia-300/[0.035]">
      <header className="border-b border-fuchsia-200/10 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-fuchsia-100/55">
          Entity Summary
        </p>

        <h4 className="mt-2 text-lg font-semibold text-white">
          {identity.name.trim() || 'Unnamed Entity'}
        </h4>

        {identity.displayName.trim() &&
          identity.displayName.trim() !==
            identity.name.trim() && (
            <p className="mt-1 text-xs text-white/35">
              {identity.displayName}
            </p>
          )}
      </header>

      <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="bg-neutral-950/80 p-4"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25">
              {item.label}
            </p>

            <p className="mt-2 text-sm font-medium text-white/70">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
