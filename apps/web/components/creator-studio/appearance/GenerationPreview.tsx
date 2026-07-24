import { ImageIcon, LoaderCircle, Sparkles } from 'lucide-react';

import type { ImageGenerationResult } from './providers/ImageProvider';

type GenerationPreviewProps = {
  result: ImageGenerationResult | null;
  isGenerating: boolean;
  canGenerate: boolean;
  onGenerate: () => void;
};

export function GenerationPreview({
  result,
  isGenerating,
  canGenerate,
  onGenerate,
}: GenerationPreviewProps) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-white/[0.09] bg-white/[0.025]">
      <div
        className="relative grid aspect-[4/5] place-items-center overflow-hidden"
        style={{
          background: result
            ? `radial-gradient(circle at 50% 25%, ${result.palette[0]}aa, transparent 42%), linear-gradient(145deg, ${result.palette[1]}, ${result.palette[2]})`
            : 'linear-gradient(145deg, rgba(217,70,239,.15), rgba(76,29,149,.22), rgba(15,23,42,.9))',
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="relative grid size-28 place-items-center rounded-full border border-white/15 bg-black/15 text-white/70 backdrop-blur-xl">
          {isGenerating ? (
            <LoaderCircle className="size-10 animate-spin" />
          ) : result ? (
            <Sparkles className="size-10" />
          ) : (
            <ImageIcon className="size-10" />
          )}
        </div>
        {result ? (
          <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/65 backdrop-blur-xl">
            {result.assetType.replace('-', ' ')}
          </span>
        ) : null}
        {result ? (
          <span className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[10px] font-semibold text-white/65 backdrop-blur-xl">
            V{result.variation}
          </span>
        ) : null}
      </div>

      <div className="p-5">
        <h3 className="text-base font-semibold text-white">
          {result ? 'Mock generation ready' : 'Generation Preview'}
        </h3>
        <p className="mt-2 text-xs leading-5 text-white/40">
          {result
            ? result.prompt
            : 'Add prompt details, then run the local provider to validate the full creation loop.'}
        </p>

        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isGenerating ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {isGenerating ? 'Generating…' : result ? 'Generate variation' : 'Generate mock asset'}
        </button>

        {!canGenerate ? (
          <p className="mt-3 text-center text-[11px] text-white/30">
            Add at least one prompt field to generate.
          </p>
        ) : null}
      </div>
    </section>
  );
}
