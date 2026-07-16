type PromptValues = Record<string, string>;

type CoreIdentityFieldsProps = {
  values: PromptValues;
  onChange: (
    fieldId: string,
    value: string,
  ) => void;
};

export function CoreIdentityFields({
  values,
  onChange,
}: CoreIdentityFieldsProps) {
  return (
    <section className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-5">
      <div>
        <p className="text-sm font-semibold text-white">
          Core Identity
        </p>

        <p className="mt-1 text-xs leading-5 text-white/35">
          Set the foundational attributes used to guide every generation.
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block min-w-0">
          <span className="text-xs font-semibold text-white/65">
            Sex
          </span>

          <select
            value={values.sex ?? ''}
            onChange={(event) =>
              onChange('sex', event.target.value)
            }
            className="mt-2 h-11 w-full rounded-xl border border-white/[0.09] bg-black/25 px-3 text-sm text-white outline-none transition focus:border-fuchsia-300/40 focus:ring-2 focus:ring-fuchsia-400/10"
          >
            <option value="" className="bg-neutral-950">
              Select sex
            </option>

            <option
              value="female"
              className="bg-neutral-950"
            >
              Female
            </option>

            <option
              value="male"
              className="bg-neutral-950"
            >
              Male
            </option>
          </select>
        </label>

        <label className="block min-w-0">
          <span className="text-xs font-semibold text-white/65">
            Age
          </span>

          <input
            type="number"
            min={18}
            max={99}
            step={1}
            inputMode="numeric"
            value={values.age ?? ''}
            onChange={(event) =>
              onChange('age', event.target.value)
            }
            placeholder="Example: 28"
            className="mt-2 h-11 w-full rounded-xl border border-white/[0.09] bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-fuchsia-300/40 focus:ring-2 focus:ring-fuchsia-400/10"
          />

          <span className="mt-2 block text-[11px] leading-4 text-white/25">
            Adult characters only: 18–99.
          </span>
        </label>
      </div>
    </section>
  );
}
