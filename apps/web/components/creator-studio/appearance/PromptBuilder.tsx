'use client';

import { promptFields } from './config';

type PromptBuilderProps = {
  values: Record<string, string>;
  onChange: (field: string, value: string) => void;
};

export function PromptBuilder({
  values,
  onChange,
}: PromptBuilderProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">
          Prompt Builder
        </h3>

        <p className="mt-2 text-sm text-white/45">
          Build your generation prompt using structured
          fields instead of one large prompt.
        </p>
      </div>

      <div className="space-y-5">
        {promptFields.map((field) => (
          <div key={field.id}>
            <label className="mb-2 block text-sm font-medium text-white/60">
              {field.label}
            </label>

            <textarea
              rows={2}
              value={values[field.id] ?? ''}
              placeholder={field.placeholder}
              onChange={(e) =>
                onChange(field.id, e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-400/40"
            />
          </div>
        ))}
      </div>
    </section>
  );
}



