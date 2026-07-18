import { promptFields } from './config';

type PromptBuilderProps = {
  values: Record<string, string>;
  onChange: (field: string, value: string) => void;
};

export function PromptBuilder({ values, onChange }: PromptBuilderProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="text-lg font-semibold text-white">Prompt Builder</h3>
      <p className="mt-2 text-sm text-white/45">
        Build a generation prompt with structured visual fields.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {promptFields.map((field) => (
          <label key={field.id} className="block">
            <span className="mb-2 block text-sm font-medium text-white/60">{field.label}</span>
            <textarea
              rows={2}
              value={values[field.id] ?? ''}
              placeholder={field.placeholder}
              onChange={(event) => onChange(field.id, event.target.value)}
              className="w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-fuchsia-400/40"
            />
          </label>
        ))}
      </div>
    </section>
  );
}
