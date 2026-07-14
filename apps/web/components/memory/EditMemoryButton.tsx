'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  LoaderCircle,
  Pencil,
  X,
} from 'lucide-react';

type EditMemoryButtonProps = {
  memoryId: string;
  initialValue: string;
  initialImportance: number;
};

export function EditMemoryButton({
  memoryId,
  initialValue,
  initialImportance,
}: EditMemoryButtonProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [importance, setImportance] = useState(
    initialImportance,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleCancel() {
    setValue(initialValue);
    setImportance(initialImportance);
    setError(null);
    setIsEditing(false);
  }

  async function handleSave() {
    const trimmedValue = value.trim();

    if (!trimmedValue || isSaving) {
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/memories/${memoryId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            value: trimmedValue,
            importance,
          }),
        },
      );

      if (!response.ok) {
        const body = (await response
          .json()
          .catch(() => null)) as
          | { error?: string }
          | null;

        throw new Error(
          body?.error ?? 'Unable to update memory.',
        );
      }

      setIsEditing(false);
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to update memory.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="mt-4 inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white/65 transition hover:border-fuchsia-200/20 hover:bg-fuchsia-300/[0.08] hover:text-white"
      >
        <Pencil className="size-3.5" />
        Edit memory
      </button>
    );
  }

  return (
    <div className="mt-4 space-y-4 rounded-2xl border border-fuchsia-200/15 bg-fuchsia-300/[0.045] p-4">
      <div>
        <label
          htmlFor={`memory-value-${memoryId}`}
          className="text-xs font-medium text-white/60"
        >
          Memory value
        </label>

        <textarea
          id={`memory-value-${memoryId}`}
          value={value}
          onChange={(event) =>
            setValue(event.target.value)
          }
          maxLength={500}
          rows={3}
          disabled={isSaving}
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-fuchsia-200/25 disabled:opacity-60"
        />

        <p className="mt-1 text-right text-[10px] text-white/20">
          {value.length} / 500
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor={`memory-importance-${memoryId}`}
            className="text-xs font-medium text-white/60"
          >
            Importance
          </label>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-semibold text-white/55">
            {importance} / 10
          </span>
        </div>

        <input
          id={`memory-importance-${memoryId}`}
          type="range"
          min={1}
          max={10}
          value={importance}
          onChange={(event) =>
            setImportance(Number(event.target.value))
          }
          disabled={isSaving}
          className="mt-3 w-full accent-fuchsia-300"
        />
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-300/15 bg-rose-300/[0.06] px-3 py-2 text-xs text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !value.trim()}
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-white px-3 text-xs font-semibold text-[#160d1e] transition hover:bg-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSaving ? (
            <LoaderCircle className="size-3.5 animate-spin" />
          ) : (
            <Check className="size-3.5" />
          )}

          {isSaving ? 'Saving…' : 'Save changes'}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          disabled={isSaving}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-xs font-semibold text-white/55 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-40"
        >
          <X className="size-3.5" />
          Cancel
        </button>
      </div>
    </div>
  );
}
