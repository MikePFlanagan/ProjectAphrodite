import { Brain, MessageCircle, SlidersHorizontal, Sparkles } from 'lucide-react';

import type { Personality } from '@aphrodite/entity-dna';

type PersonalityEditorProps = {
  personality: Personality;
  onChange: (personality: Personality) => void;
};

const dimensions: Array<{
  key: keyof Pick<
    Personality,
    'warmth' | 'humor' | 'confidence' | 'curiosity' | 'emotionalExpressiveness'
  >;
  label: string;
  low: string;
  high: string;
}> = [
  { key: 'warmth', label: 'Warmth', low: 'Reserved', high: 'Nurturing' },
  { key: 'humor', label: 'Humor', low: 'Serious', high: 'Playful' },
  { key: 'confidence', label: 'Confidence', low: 'Tentative', high: 'Assured' },
  { key: 'curiosity', label: 'Curiosity', low: 'Focused', high: 'Inquisitive' },
  {
    key: 'emotionalExpressiveness',
    label: 'Emotional expression',
    low: 'Subtle',
    high: 'Expressive',
  },
];

const conversationStyles: Array<{
  value: Personality['conversationStyle'];
  label: string;
  description: string;
}> = [
  { value: 'supportive', label: 'Supportive', description: 'Patient, validating, and encouraging' },
  { value: 'playful', label: 'Playful', description: 'Light, energetic, and gently teasing' },
  { value: 'direct', label: 'Direct', description: 'Clear, candid, and action-oriented' },
  { value: 'reflective', label: 'Reflective', description: 'Thoughtful, curious, and exploratory' },
];

export function PersonalityEditor({ personality, onChange }: PersonalityEditorProps) {
  function update<Key extends keyof Personality>(key: Key, value: Personality[Key]) {
    onChange({ ...personality, [key]: value });
  }

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-[26px] border border-white/[0.09] bg-white/[0.025] p-6">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-fuchsia-500/10">
            <SlidersHorizontal className="size-5 text-fuchsia-200" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Behavior dimensions</h3>
            <p className="mt-1 text-xs leading-5 text-white/40">
              Tune stable tendencies. These values become part of the character prompt.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {dimensions.map((dimension) => (
            <label
              key={dimension.key}
              className="rounded-2xl border border-white/[0.08] bg-black/15 p-4"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-white/75">{dimension.label}</span>
                <span className="rounded-lg bg-white/[0.05] px-2 py-1 text-xs font-semibold text-fuchsia-100/70">
                  {personality[dimension.key]}
                </span>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={personality[dimension.key]}
                onChange={(event) => update(dimension.key, Number(event.target.value))}
                className="mt-4 w-full accent-fuchsia-400"
              />
              <span className="mt-2 flex justify-between text-[10px] text-white/25">
                <span>{dimension.low}</span>
                <span>{dimension.high}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-[26px] border border-white/[0.09] bg-white/[0.025] p-6">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-500/10">
            <MessageCircle className="size-5 text-violet-200" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Conversation behavior</h3>
            <p className="mt-1 text-xs leading-5 text-white/40">
              Choose the default interaction style and answer depth.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {conversationStyles.map((style) => {
            const selected = personality.conversationStyle === style.value;
            return (
              <button
                key={style.value}
                type="button"
                aria-pressed={selected}
                onClick={() => update('conversationStyle', style.value)}
                className={`rounded-2xl border p-4 text-left transition ${
                  selected
                    ? 'border-fuchsia-200/25 bg-fuchsia-300/[0.07]'
                    : 'border-white/[0.08] bg-black/15 hover:border-white/15'
                }`}
              >
                <span className="block text-sm font-semibold text-white/80">{style.label}</span>
                <span className="mt-1 block text-xs leading-5 text-white/35">
                  {style.description}
                </span>
              </button>
            );
          })}
        </div>

        <label className="mt-5 block">
          <span className="text-xs font-medium text-white/60">Response length</span>
          <select
            value={personality.responseLength}
            onChange={(event) =>
              update('responseLength', event.target.value as Personality['responseLength'])
            }
            className="mt-2 w-full rounded-xl border border-white/[0.09] bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-200/30"
          >
            <option value="concise" className="bg-[#120d18]">
              Concise
            </option>
            <option value="balanced" className="bg-[#120d18]">
              Balanced
            </option>
            <option value="expansive" className="bg-[#120d18]">
              Expansive
            </option>
          </select>
        </label>
      </section>

      <section className="rounded-[26px] border border-white/[0.09] bg-white/[0.025] p-6">
        <div className="flex items-start gap-3">
          <Brain className="mt-0.5 size-5 shrink-0 text-fuchsia-200" />
          <div className="w-full">
            <label className="block text-sm font-semibold text-white">Creator instructions</label>
            <p className="mt-1 text-xs leading-5 text-white/40">
              Add behavior guidance that is not captured by the controls above.
            </p>
            <textarea
              value={personality.instructions}
              onChange={(event) => update('instructions', event.target.value)}
              maxLength={2000}
              rows={6}
              placeholder="Examples: Ask one thoughtful follow-up at a time. Never pretend to know facts that were not shared."
              className="mt-4 w-full resize-y rounded-xl border border-white/[0.09] bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-fuchsia-200/30 focus:ring-4 focus:ring-fuchsia-300/[0.05]"
            />
            <span className="mt-2 block text-right text-[10px] text-white/25">
              {personality.instructions.length}/2000
            </span>
          </div>
        </div>
      </section>

      <div className="rounded-[22px] border border-fuchsia-200/15 bg-fuchsia-300/[0.045] p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-fuchsia-200" />
          <p className="text-xs leading-5 text-white/45">
            <span className="font-semibold text-white/70">Behavior summary:</span>{' '}
            {personality.conversationStyle} style, {personality.responseLength} responses,{' '}
            {personality.warmth}% warmth, and {personality.curiosity}% curiosity.
          </p>
        </div>
      </div>
    </div>
  );
}
