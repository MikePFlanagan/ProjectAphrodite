'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ImageIcon, Loader2, Trash2, Upload } from 'lucide-react';

type ReferenceSlot = 'master' | 'side' | 'back';

type SavedReference = {
  id: string;
  slot: ReferenceSlot;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  dataUrl: string;
  createdAt: string;
  updatedAt: string;
};

type ReferenceSlotDefinition = {
  id: ReferenceSlot;
  title: string;
  description: string;
};

const referenceSlots: ReferenceSlotDefinition[] = [
  {
    id: 'master',
    title: 'Master reference',
    description: 'Primary face, hairstyle, and overall identity reference.',
  },
  {
    id: 'side',
    title: 'Side reference',
    description: 'Side profile used to preserve facial structure and proportions.',
  },
  {
    id: 'back',
    title: 'Back reference',
    description: 'Back view used to preserve hairstyle, body shape, and silhouette.',
  },
];

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxFileSize = 5 * 1024 * 1024;

export function ReferenceLibrary() {
  const [references, setReferences] = useState<
    Partial<Record<ReferenceSlot, SavedReference>>
  >({});
  const [loading, setLoading] = useState(true);
  const [busySlot, setBusySlot] = useState<ReferenceSlot | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = {
    master: useRef<HTMLInputElement>(null),
    side: useRef<HTMLInputElement>(null),
    back: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    let cancelled = false;

    async function loadReferences() {
      try {
        const response = await fetch('/api/creator/references');

        if (!response.ok) {
          throw new Error('Unable to load reference images.');
        }

        const payload = (await response.json()) as {
          references: SavedReference[];
        };

        if (cancelled) return;

        const nextReferences: Partial<
          Record<ReferenceSlot, SavedReference>
        > = {};

        for (const reference of payload.references) {
          nextReferences[reference.slot] = reference;
        }

        setReferences(nextReferences);
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load reference images.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadReferences();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleFileChange(
    slot: ReferenceSlot,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    setError(null);

    if (!allowedTypes.includes(file.type)) {
      setError('Use a JPG, PNG, or WebP image.');
      return;
    }

    if (file.size > maxFileSize) {
      setError('Reference images must be 5 MB or smaller.');
      return;
    }

    setBusySlot(slot);

    try {
      const dataUrl = await readFileAsDataUrl(file);

      const response = await fetch('/api/creator/references', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slot,
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          dataUrl,
        }),
      });

      const payload = (await response.json()) as {
        reference?: SavedReference;
        error?: string;
      };

      if (!response.ok || !payload.reference) {
        throw new Error(payload.error ?? 'Unable to save reference image.');
      }

      setReferences((current) => ({
        ...current,
        [slot]: payload.reference,
      }));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Unable to save reference image.',
      );
    } finally {
      setBusySlot(null);
    }
  }

  async function handleRemove(slot: ReferenceSlot) {
    setError(null);
    setBusySlot(slot);

    try {
      const response = await fetch('/api/creator/references', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slot }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? 'Unable to remove reference image.');
      }

      setReferences((current) => {
        const next = { ...current };
        delete next[slot];
        return next;
      });
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : 'Unable to remove reference image.',
      );
    } finally {
      setBusySlot(null);
    }
  }

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3 text-sm text-white/60">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading reference images…
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">
          Reference library
        </h2>
        <p className="mt-1 text-sm text-white/55">
          Upload consistent views of the character before generating new
          appearance assets.
        </p>
      </div>

      {error ? (
        <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid min-w-0 gap-4 md:grid-cols-3">
        {referenceSlots.map((slot) => {
          const reference = references[slot.id];
          const isBusy = busySlot === slot.id;

          return (
            <article
              key={slot.id}
              className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20"
            >
              <div className="relative aspect-[4/5] bg-white/[0.03]">
                {reference ? (
                  // Data URLs are selected directly by the user, so a standard
                  // img element is appropriate here.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={reference.dataUrl}
                    alt={`${slot.title} preview`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-white/35">
                    <ImageIcon className="h-9 w-9" />
                    <span className="text-sm">No image uploaded</span>
                  </div>
                )}

                {isBusy ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/65">
                    <Loader2 className="h-7 w-7 animate-spin text-white" />
                  </div>
                ) : null}
              </div>

              <div className="space-y-4 p-4">
                <div>
                  <h3 className="font-medium text-white">{slot.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-white/50">
                    {slot.description}
                  </p>
                </div>

                {reference ? (
                  <p
                    className="truncate text-xs text-white/40"
                    title={reference.fileName}
                  >
                    {reference.fileName}
                  </p>
                ) : null}

                <input
                  ref={inputRefs[slot.id]}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => void handleFileChange(slot.id, event)}
                />

                 <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_2.5rem] gap-2">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => inputRefs[slot.id].current?.click()}
                    className="flex min-w-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-medium text-white transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {reference ? 'Replace' : 'Upload'}
                    </span>
                  </button>

                  {reference ? (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void handleRemove(slot.id)}
                      aria-label={`Remove ${slot.title}`}
                      title={`Remove ${slot.title}`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-400/30 bg-red-500/15 text-red-200 transition hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : (
                    <div aria-hidden="true" />
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-5 text-xs leading-5 text-white/40">
        JPG, PNG, and WebP files are supported. Maximum size: 5 MB per image.
      </p>
    </section>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Unable to read the selected image.'));
    };

    reader.onerror = () => {
      reject(new Error('Unable to read the selected image.'));
    };

    reader.readAsDataURL(file);
  });
}