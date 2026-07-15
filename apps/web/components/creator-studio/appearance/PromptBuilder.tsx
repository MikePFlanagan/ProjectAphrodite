'use client';

import { RotateCcw } from 'lucide-react';

import { promptFields } from './config';

type PromptValues = Record<string, string>;

type PromptBuilderProps = {
  values: PromptValues;
  onChange: (fieldId: string, value: string) => void;
  onReset: () => void;
};

export function PromptBuilder({
  values,
  onChange,
  onReset,
}: PromptBuilderProps) {
  const compiledPrompt = promptFields
    .map((field) => values[field.id]?.trim())
    .filter(Boolean)
    .join(', ');

  return (
    <section className="overflow-hidden rounded-[26px] border border-white/[0.09] bg-white/[0.025]">
      <header className="flex flex-col gap-4 border-b border-white/[0.08] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">
            Prompt Builder
          </h3>

          <p className="mt-1 text-xs leading-5 text-white/35">
            Shape the appearance using clear, structured details.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-semibold text-white/45 transition hover:bg-white/[0.07] hover:text-white sm:self-auto"
        >
          <RotateCcw className="size-3.5" />
          Reset
        </button>
      </header>

      <div className="grid gap-4 p-5 md:grid-cols-2">
        {promptFields.map((field) => {
          const wide =
            field.id === 'subject' ||
            field.id === 'environment';

          return (
            <label
              key={field.id}
              className={wide ? 'md:col-span-2' : undefined}
            >
              <span className="text-xs font-medium text-white/55">
                {field.label}
              </span>

              <textarea
                value={values[field.id] ?? ''}
                onChange={(event) =>
                  onChange(field.id, event.target.value)
                }
                placeholder={field.placeholder}
                rows={wide ? 3 : 2}
                className="mt-2 w-full resize-y rounded-xl border border-white/[0.09] bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-fuchsia-200/30 focus:bg-black/30 focus:ring-4 focus:ring-fuchsia-300/[0.05]"
              />
            </label>
          );
        })}
      </div>

      <div className="border-t border-white/[0.08] p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
          Prompt preview
        </p>

        <p className="mt-3 min-h-12 text-xs leading-6 text-white/38">
          {compiledPrompt ||
            'Start adding details to preview the complete generation prompt.'}
        </p>
      </div>
    </section>
  );
}