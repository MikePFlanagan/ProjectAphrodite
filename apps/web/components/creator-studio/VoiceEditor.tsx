'use client';

import { useEffect, useMemo, useState } from 'react';
import { CircleStop, Info, Play, Volume2 } from 'lucide-react';

import type { VoiceProfile } from './types';

type VoiceEditorProps = {
  characterName: string;
  greeting: string;
  voice: VoiceProfile;
  onChange: (voice: VoiceProfile) => void;
};

export function VoiceEditor({ characterName, greeting, voice, onChange }: VoiceEditorProps) {
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [previewText, setPreviewText] = useState(greeting);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const supportsPreview = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!supportsPreview) return;

    const loadVoices = () => setAvailableVoices(window.speechSynthesis.getVoices());
    const initialLoad = window.setTimeout(loadVoices, 0);
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.clearTimeout(initialLoad);
      window.speechSynthesis.cancel();
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [supportsPreview]);

  const groupedVoices = useMemo(() => {
    const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
    return [...availableVoices].sort((left, right) =>
      collator.compare(`${left.lang} ${left.name}`, `${right.lang} ${right.name}`),
    );
  }, [availableVoices]);

  function update<Key extends keyof VoiceProfile>(key: Key, value: VoiceProfile[Key]) {
    onChange({ ...voice, [key]: value });
  }

  function stopPreview() {
    if (supportsPreview) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  function playPreview() {
    if (!supportsPreview || !previewText.trim()) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(previewText.trim());
    const selectedVoice = availableVoices.find((candidate) => candidate.voiceURI === voice.voiceId);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = voice.rate;
    utterance.pitch = voice.pitch;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-[26px] border border-white/[0.09] bg-white/[0.025] p-6">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-fuchsia-500/10">
            <Volume2 className="size-5 text-fuchsia-200" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Voice identity</h3>
            <p className="mt-1 text-xs leading-5 text-white/40">
              Save how {characterName} should sound. Provider-specific engines plug into this same
              profile.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-white/60">Provider</span>
            <select
              value={voice.provider}
              onChange={(event) =>
                update('provider', event.target.value as VoiceProfile['provider'])
              }
              className={inputClassName}
            >
              <option value="browser" className="bg-[#120d18]">
                Device preview
              </option>
              <option value="local" className="bg-[#120d18]" disabled>
                Local service — next brick
              </option>
              <option value="telnyx" className="bg-[#120d18]" disabled>
                Telnyx — optional
              </option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-white/60">System voice</span>
            <select
              value={voice.voiceId}
              onChange={(event) => update('voiceId', event.target.value)}
              disabled={!supportsPreview || groupedVoices.length === 0}
              className={inputClassName}
            >
              <option value="" className="bg-[#120d18]">
                System default
              </option>
              {groupedVoices.map((candidate) => (
                <option
                  key={candidate.voiceURI}
                  value={candidate.voiceURI}
                  className="bg-[#120d18]"
                >
                  {candidate.name} · {candidate.lang}
                  {candidate.localService ? ' · local' : ''}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <VoiceRange
            label="Speaking rate"
            value={voice.rate}
            low="Slower"
            high="Faster"
            onChange={(value) => update('rate', value)}
          />
          <VoiceRange
            label="Pitch"
            value={voice.pitch}
            low="Lower"
            high="Higher"
            onChange={(value) => update('pitch', value)}
          />
        </div>
      </section>

      <section className="rounded-[26px] border border-white/[0.09] bg-white/[0.025] p-6">
        <h3 className="text-base font-semibold text-white">Voice preview</h3>
        <p className="mt-1 text-xs leading-5 text-white/40">
          This preview uses voices exposed by your device and requires no Aphrodite API key.
        </p>
        <textarea
          value={previewText}
          onChange={(event) => setPreviewText(event.target.value)}
          maxLength={500}
          rows={5}
          className={`${inputClassName} mt-5 resize-y leading-6`}
          aria-label="Voice preview text"
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={isSpeaking ? stopPreview : playPreview}
            disabled={!supportsPreview || !previewText.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#170d20] transition hover:bg-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSpeaking ? <CircleStop className="size-4" /> : <Play className="size-4" />}
            {isSpeaking ? 'Stop preview' : 'Play preview'}
          </button>
          <span className="text-xs text-white/30">
            {supportsPreview
              ? `${groupedVoices.length} device voices available`
              : 'Preview is unavailable in this browser'}
          </span>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-[22px] border border-sky-200/15 bg-sky-300/[0.045] p-5">
        <Info className="mt-0.5 size-4 shrink-0 text-sky-200" />
        <p className="text-xs leading-5 text-white/45">
          Device voices vary by browser and operating system. Aphrodite stores the preference but
          safely falls back to the system default when that exact voice is unavailable.
        </p>
      </div>
    </div>
  );
}

function VoiceRange({
  label,
  value,
  low,
  high,
  onChange,
}: {
  label: string;
  value: number;
  low: string;
  high: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
      <span className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-white/75">{label}</span>
        <span className="rounded-lg bg-white/[0.05] px-2 py-1 text-xs font-semibold text-fuchsia-100/70">
          {value.toFixed(1)}×
        </span>
      </span>
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 w-full accent-fuchsia-400"
      />
      <span className="mt-2 flex justify-between text-[10px] text-white/25">
        <span>{low}</span>
        <span>{high}</span>
      </span>
    </label>
  );
}

const inputClassName =
  'mt-2 w-full rounded-xl border border-white/[0.09] bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-200/30 disabled:cursor-not-allowed disabled:opacity-45';
