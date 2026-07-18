import { History, Sparkles } from 'lucide-react';

import type { MockGenerationResult } from './providers/MockImageProvider';

type GenerationHistoryProps = {
  results: MockGenerationResult[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
  onSelect: (result: MockGenerationResult) => void;
};

export function GenerationHistory({
  results,
  selectedId,
  isLoading,
  error,
  onSelect,
}: GenerationHistoryProps) {
  return (
    <section className="rounded-[26px] border border-white/[0.09] bg-white/[0.025] p-6">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-fuchsia-500/10">
          <History className="size-5 text-fuchsia-200" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Saved Generations</h3>
          <p className="mt-1 text-xs text-white/40">
            Compare and restore your latest generated assets.
          </p>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-rose-300/15 bg-rose-400/[0.06] px-4 py-3 text-xs text-rose-100/70"
        >
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/10 p-6 text-center text-xs text-white/30">
          Loading saved generations…
        </div>
      ) : results.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/10 p-6 text-center text-xs text-white/30">
          Generated variations will be saved here.
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => {
            const selected = result.id === selectedId;
            return (
              <button
                key={result.id}
                type="button"
                onClick={() => onSelect(result)}
                aria-pressed={selected}
                className={`overflow-hidden rounded-2xl border text-left transition ${
                  selected
                    ? 'border-fuchsia-200/30 bg-fuchsia-300/[0.08]'
                    : 'border-white/[0.08] bg-black/15 hover:border-white/15'
                }`}
              >
                <span
                  className="relative grid aspect-[4/3] place-items-center"
                  style={{
                    background: `radial-gradient(circle at 50% 25%, ${result.palette[0]}aa, transparent 42%), linear-gradient(145deg, ${result.palette[1]}, ${result.palette[2]})`,
                  }}
                >
                  <Sparkles className="size-6 text-white/65" />
                </span>
                <span className="block p-3">
                  <span className="block text-xs font-semibold capitalize text-white/75">
                    {result.assetType.replace('-', ' ')} · V{result.variation}
                  </span>
                  <span className="mt-1 block truncate text-[11px] text-white/35">
                    {result.prompt}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
