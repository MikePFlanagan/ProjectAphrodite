'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  Check,
  Clipboard,
  Download,
  Heart,
  ImageIcon,
  LoaderCircle,
  LockKeyhole,
  RefreshCcw,
  Sparkles,
} from 'lucide-react';

import type { EntityDNA } from '../../../lib/entity-dna';
import {
  buildIdentitySnapshot,
  type CharacterIdentitySnapshot,
  type IdentityTraitKey,
} from './identity';
import type {
  AppearanceAssetType,
  CharacterLock,
} from './types';
import { EntitySummaryCard } from './preview/EntitySummaryCard';
type PromptValues = Record<string, string>;

type GenerationStatus =
  | 'idle'
  | 'generating'
  | 'success'
  | 'error';

type VisualPreviewCanvasProps = {
  assetType: AppearanceAssetType;
  entityDna: EntityDNA;
  promptValues: PromptValues;
  locks: CharacterLock[];
};

export function VisualPreviewCanvas({
  assetType,
  entityDna,
  promptValues,
  locks,
}: VisualPreviewCanvasProps) {
  const [status, setStatus] =
    useState<GenerationStatus>('idle');

  const [generationCount, setGenerationCount] =
    useState(0);

  const [isFavorite, setIsFavorite] =
    useState(false);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  const [identityCopied, setIdentityCopied] =
    useState(false);

  const [lockedIdentity, setLockedIdentity] =
    useState<CharacterIdentitySnapshot | null>(
      null,
    );

  const compiledPrompt = useMemo(() => {
    const identity = entityDna.identity;

    const entityDetails = [
      identity.name
        ? `named ${identity.name}`
        : '',
      entityDna.family,
      identity.species,
      identity.breedOrSubtype,
      identity.sex !== 'unknown' &&
      identity.sex !== 'not-applicable'
        ? identity.sex
        : '',
      identity.age !== null
        ? `${identity.age} years old`
        : '',
    ];

    const appearanceDetails =
      Object.values(promptValues);

    return [
      ...entityDetails,
      ...appearanceDetails,
    ]
      .map((value) => value.trim())
      .filter(Boolean)
      .join(', ');
  }, [entityDna, promptValues]);

  const enabledLocks = useMemo(
    () => locks.filter((lock) => lock.enabled),
    [locks],
  );

  const enabledTraitKeys = useMemo(
    () =>
      enabledLocks.map(
        (lock) => lock.id as IdentityTraitKey,
      ),
    [enabledLocks],
  );

  const jsonPrompt = useMemo(
    () => ({
      schemaVersion: '1.0',
      mode: 'preview',
      provider: 'comfyui',
      model: 'flux1-schnell-fp8.safetensors',
      assetType,
      entity: entityDna,
      prompt: promptValues,
      characterLocks: enabledTraitKeys,
      compiledPrompt,
    }),
    [
      assetType,
      entityDna,
      promptValues,
      enabledTraitKeys,
      compiledPrompt,
    ],
  );

  const formattedJsonPrompt = useMemo(
    () => JSON.stringify(jsonPrompt, null, 2),
    [jsonPrompt],
  );

  const formattedLockedIdentity = useMemo(
    () =>
      lockedIdentity
        ? JSON.stringify(
            lockedIdentity,
            null,
            2,
          )
        : '',
    [lockedIdentity],
  );

  const canGenerate =
    compiledPrompt.length > 0 &&
    status !== 'generating';

  const canLockAppearance =
    status === 'success' &&
    Boolean(previewUrl) &&
    enabledLocks.length > 0;

  async function handleGenerate() {
    if (!canGenerate) {
      return;
    }

    setStatus('generating');
    setIsFavorite(false);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: compiledPrompt,
          width:
            entityDna.generationDefaults.width,
          height:
            entityDna.generationDefaults.height,
          steps:
            entityDna.generationDefaults.steps,
          cfg:
            entityDna.generationDefaults.cfg,
          model:
            entityDna.generationDefaults.model,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        imageUrl?: string;
        promptId?: string;
        error?: string;
      };

      if (
        !response.ok ||
        !result.success ||
        !result.imageUrl
      ) {
        throw new Error(
          result.error ??
            'Image generation failed.',
        );
      }

      setPreviewUrl(result.imageUrl);
      setGenerationCount(
        (current) => current + 1,
      );
      setStatus('success');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Preview generation failed.',
      );
      setStatus('error');
    }
  }

  function handleLockInAppearance() {
    if (!canLockAppearance || !previewUrl) {
      return;
    }

    const nextVersion =
      (lockedIdentity?.identityVersion ?? 0) + 1;

    const snapshot = buildIdentitySnapshot({
      characterId: 'draft-companion',
      identityVersion: nextVersion,
      assetType,
      promptValues,
      enabledTraitKeys,
      previewImageUrl: previewUrl,
      provider: 'comfyui',
      model: 'flux1-schnell-fp8.safetensors',
      seed: null,
      promptVersion: 1,
    });

    setLockedIdentity(snapshot);
  }

  async function handleCopyJson() {
    try {
      await navigator.clipboard.writeText(
        formattedJsonPrompt,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      setCopied(false);
    }
  }

  async function handleCopyIdentity() {
    if (!formattedLockedIdentity) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        formattedLockedIdentity,
      );

      setIdentityCopied(true);

      window.setTimeout(() => {
        setIdentityCopied(false);
      }, 1600);
    } catch {
      setIdentityCopied(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/[0.09] bg-white/[0.025]">
      <header className="flex flex-col gap-4 border-b border-white/[0.08] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-fuchsia-200" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-fuchsia-100/70">
              Preview Mode
            </p>
          </div>

          <h3 className="mt-2 text-lg font-semibold text-white">
            Visual Preview
          </h3>

          <p className="mt-1 text-xs leading-5 text-white/35">
            Test the complete creation flow without
            using paid AI credits.
          </p>
        </div>

        <div className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-xs text-white/45">
          Generation {generationCount}
        </div>
      </header>

      <div className="space-y-5 p-5">
        <div className="rounded-2xl border border-fuchsia-200/10 bg-fuchsia-300/[0.045] p-4">
          <p className="text-xs font-semibold text-fuchsia-100">
            Test imagery
          </p>

          <p className="mt-1 text-xs leading-5 text-white/40">
            This preview uses randomly selected test
            imagery and may not represent the values
            entered in your prompt, selected asset type,
            or character locks.
          </p>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-white/[0.09] bg-black/25">
          {status === 'idle' && (
            <div className="grid h-full place-items-center p-8 text-center">
              <div>
                <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                  <ImageIcon className="size-7 text-white/30" />
                </div>

                <h4 className="mt-5 text-base font-semibold text-white/75">
                  Your companion is waiting
                </h4>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/35">
                  Add appearance details, then generate
                  a test preview.
                </p>
              </div>
            </div>
          )}

          {status === 'generating' && (
            <div className="absolute inset-0 z-20 grid place-items-center bg-black/55 backdrop-blur-sm">
              <div className="text-center">
                <LoaderCircle className="mx-auto size-9 animate-spin text-fuchsia-200" />

                <p className="mt-4 text-sm font-semibold text-white">
                  Bringing your preview to life
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Selecting test imagery...
                </p>
              </div>
            </div>
          )}

          {status === 'success' &&
            previewUrl && (
              <>
                <Image
                  src={previewUrl}
                  alt={`${assetType.replace(
                    '-',
                    ' ',
                  )} test preview`}
                  fill
                  sizes="(min-width: 1536px) 30vw, (min-width: 1280px) 38vw, 100vw"
                  className="object-cover transition duration-500"
                />

                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/55 to-transparent p-5 pt-24">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                    Test Result
                  </p>

                  <p className="mt-1 text-sm font-semibold capitalize text-white">
                    {assetType.replace('-', ' ')}{' '}
                    preview
                  </p>
                </div>
              </>
            )}

          {status === 'error' && (
            <div className="grid h-full place-items-center p-8 text-center">
              <div>
                <p className="text-sm font-semibold text-red-200">
                  Preview generation failed
                </p>

                <p className="mt-2 text-xs leading-5 text-white/35">
                  {errorMessage ??
                    'Please try generating the preview again.'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {status !== 'success' ? (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {status === 'generating' ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Generating
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Generate Preview
                </>
              )}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleLockInAppearance}
                disabled={!canLockAppearance}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <LockKeyhole className="size-4" />

                {lockedIdentity
                  ? `Lock New Version v${
                      lockedIdentity.identityVersion +
                      1
                    }`
                  : 'Lock In Appearance'}
              </button>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.045] px-5 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <RefreshCcw className="size-4" />
                  Regenerate
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setIsFavorite(
                      (current) => !current,
                    )
                  }
                  aria-pressed={isFavorite}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.045] px-5 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <Heart
                    className={`size-4 ${
                      isFavorite
                        ? 'fill-current text-fuchsia-200'
                        : ''
                    }`}
                  />

                  {isFavorite
                    ? 'Saved'
                    : 'Favorite'}
                </button>
              </div>

              <button
                type="button"
                disabled
                title="Download will be enabled with real generated assets."
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white/25"
              >
                <Download className="size-4" />
                Download unavailable in Preview Mode
              </button>
            </>
          )}
        </div>

        {!compiledPrompt && (
          <p className="text-center text-xs text-amber-200/65">
            Add at least one prompt detail before
            generating.
          </p>
        )}

        {status === 'success' &&
          enabledLocks.length === 0 && (
            <p className="text-center text-xs text-amber-200/65">
              Enable at least one Character Lock before
              locking the appearance.
            </p>
          )}
        <EntitySummaryCard entityDna={entityDna} />
        
        <div className="grid gap-4 rounded-[20px] border border-white/[0.08] bg-black/20 p-4 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
              Asset Type
            </p>

            <p className="mt-2 text-sm capitalize text-white/65">
              {assetType.replace('-', ' ')}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
              Identity Locks
            </p>

            <p className="mt-2 text-sm text-white/65">
              {enabledLocks.length} enabled
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
              Compiled Prompt
            </p>

            <p className="mt-2 line-clamp-4 text-xs leading-6 text-white/40">
              {compiledPrompt ||
                'Your complete prompt will appear here.'}
            </p>
          </div>
        </div>

        {lockedIdentity && (
          <div className="overflow-hidden rounded-[20px] border border-emerald-300/15 bg-emerald-300/[0.04]">
            <div className="flex flex-col gap-3 border-b border-emerald-300/10 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <LockKeyhole className="size-4 text-emerald-300" />

                  <p className="text-xs font-semibold text-emerald-200">
                    Appearance Locked
                  </p>
                </div>

                <p className="mt-1 text-xs leading-5 text-white/35">
                  Identity version{' '}
                  {lockedIdentity.identityVersion} has
                  been captured locally.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyIdentity}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/[0.09] bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/55 transition hover:bg-white/[0.08] hover:text-white sm:self-auto"
              >
                {identityCopied ? (
                  <>
                    <Check className="size-3.5 text-emerald-300" />
                    Copied
                  </>
                ) : (
                  <>
                    <Clipboard className="size-3.5" />
                    Copy Identity
                  </>
                )}
              </button>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-2">
              {Object.values(
                lockedIdentity.traits,
              ).map((trait) => (
                <div
                  key={trait.key}
                  className="rounded-xl border border-white/[0.07] bg-black/20 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-white/65">
                      {trait.label}
                    </p>

                    <span
                      className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${
                        trait.captured
                          ? 'bg-emerald-300/10 text-emerald-200'
                          : 'bg-white/[0.05] text-white/30'
                      }`}
                    >
                      {trait.captured
                        ? 'Captured'
                        : 'Not captured'}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-white/35">
                    {trait.value ??
                      'Captured from the approved reference image.'}
                  </p>
                </div>
              ))}
            </div>

            <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words border-t border-emerald-300/10 p-4 text-xs leading-6 text-white/50">
              {formattedLockedIdentity}
            </pre>
          </div>
        )}

        <div className="overflow-hidden rounded-[20px] border border-white/[0.08] bg-black/25">
          <div className="flex flex-col gap-3 border-b border-white/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                JSON Prompt
              </p>

              <p className="mt-1 text-xs leading-5 text-white/35">
                Structured payload prepared for the
                future image provider.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyJson}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/[0.09] bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/55 transition hover:bg-white/[0.08] hover:text-white sm:self-auto"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-300" />
                  Copied
                </>
              ) : (
                <>
                  <Clipboard className="size-3.5" />
                  Copy JSON
                </>
              )}
            </button>
          </div>

          <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words p-4 text-xs leading-6 text-white/55">
            {formattedJsonPrompt}
          </pre>
        </div>
      </div>
    </section>
  );
}
