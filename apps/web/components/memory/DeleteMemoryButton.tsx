'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LoaderCircle,
  Trash2,
} from 'lucide-react';

type DeleteMemoryButtonProps = {
  memoryId: string;
  memoryLabel: string;
};

export function DeleteMemoryButton({
  memoryId,
  memoryLabel,
}: DeleteMemoryButtonProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Forget "${memoryLabel}"? This cannot be undone.`,
    );

    if (!confirmed || isDeleting) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/memories/${memoryId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        const body = (await response
          .json()
          .catch(() => null)) as
          | { error?: string }
          | null;

        throw new Error(
          body?.error ?? 'Unable to forget memory.',
        );
      }

      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to forget memory.',
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="shrink-0">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex h-9 items-center gap-2 rounded-xl border border-rose-300/15 bg-rose-300/[0.05] px-3 text-xs font-semibold text-rose-100/70 transition hover:border-rose-300/25 hover:bg-rose-300/[0.1] hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {isDeleting ? (
          <LoaderCircle className="size-3.5 animate-spin" />
        ) : (
          <Trash2 className="size-3.5" />
        )}

        {isDeleting ? 'Forgetting…' : 'Forget'}
      </button>

      {error ? (
        <p className="mt-2 max-w-40 text-right text-xs text-rose-200">
          {error}
        </p>
      ) : null}
    </div>
  );
}
