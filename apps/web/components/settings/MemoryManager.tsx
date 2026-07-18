'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Brain, LoaderCircle, Plus, Save, Trash2 } from 'lucide-react';

type Memory = {
  id: string;
  key: string;
  value: string;
  importance: number;
  updatedAt: string;
  character: { id: string; name: string; avatarUrl: string };
};

type CharacterOption = { id: string; name: string };

export function MemoryManager() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [characters, setCharacters] = useState<CharacterOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingForgetId, setPendingForgetId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const loadMemories = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch('/api/memories');
      const body = (await response.json()) as {
        memories?: Memory[];
        characters?: CharacterOption[];
        error?: string;
      };
      if (!response.ok) throw new Error(body.error ?? 'Could not load memories.');
      setMemories(body.memories ?? []);
      setCharacters(body.characters ?? []);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Could not load memories.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void loadMemories(), 0);
    return () => window.clearTimeout(initialLoad);
  }, [loadMemories]);

  async function updateMemory(memory: Memory) {
    setBusyId(memory.id);
    setError(null);
    try {
      const response = await fetch('/api/memories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: memory.id,
          value: memory.value,
          importance: memory.importance,
        }),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(body?.error ?? 'Could not save memory.');
      await loadMemories();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Could not save memory.');
    } finally {
      setBusyId(null);
    }
  }

  async function deleteMemory(id: string) {
    setBusyId(id);
    setError(null);
    try {
      const response = await fetch('/api/memories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(body?.error ?? 'Could not delete memory.');
      setMemories((current) => current.filter((memory) => memory.id !== id));
      setPendingForgetId(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Could not delete memory.');
    } finally {
      setBusyId(null);
    }
  }

  function changeMemory(id: string, changes: Partial<Pick<Memory, 'value' | 'importance'>>) {
    setMemories((current) =>
      current.map((memory) => (memory.id === id ? { ...memory, ...changes } : memory)),
    );
  }

  return (
    <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="size-4 text-fuchsia-200" />
            <h2 className="text-sm font-medium">Companion memory</h2>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
            Review exactly what companions retain about you. Correct inaccurate details or delete
            anything you no longer want remembered.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate((current) => !current)}
          disabled={!characters.length}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Plus className="size-3.5" />
          Add memory
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-rose-300/20 bg-rose-300/[0.07] px-3 py-2 text-xs text-rose-100">
          {error}
        </p>
      ) : null}

      {showCreate ? (
        <CreateMemoryForm
          characters={characters}
          onCreated={async () => {
            setShowCreate(false);
            await loadMemories();
          }}
          onError={setError}
        />
      ) : null}

      {isLoading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-white/40">
          <LoaderCircle className="size-4 animate-spin" />
          Loading memories…
        </div>
      ) : memories.length ? (
        <div className="mt-6 space-y-3">
          {memories.map((memory) => (
            <article
              key={memory.id}
              className="rounded-2xl border border-white/[0.08] bg-black/15 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-fuchsia-100/75">
                    {memory.character.name}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/25">
                    {humanizeKey(memory.key)}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs text-white/35">
                  Importance
                  <select
                    value={memory.importance}
                    onChange={(event) =>
                      changeMemory(memory.id, { importance: Number(event.target.value) })
                    }
                    className="rounded-lg border border-white/10 bg-[#120d18] px-2 py-1.5 text-white/65"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <textarea
                value={memory.value}
                onChange={(event) => changeMemory(memory.id, { value: event.target.value })}
                maxLength={500}
                rows={3}
                aria-label={`${memory.character.name} memory: ${humanizeKey(memory.key)}`}
                className="mt-3 w-full resize-y rounded-xl border border-white/[0.09] bg-black/20 px-3 py-2 text-sm leading-6 text-white/75 outline-none focus:border-fuchsia-200/25"
              />
              <div className="mt-3 flex justify-end gap-2">
                {pendingForgetId === memory.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setPendingForgetId(null)}
                      className="rounded-lg px-3 py-2 text-xs text-white/45 transition hover:bg-white/[0.05]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteMemory(memory.id)}
                      disabled={busyId === memory.id}
                      className="inline-flex items-center gap-2 rounded-lg bg-rose-300/[0.1] px-3 py-2 text-xs text-rose-100 transition hover:bg-rose-300/[0.16] disabled:opacity-40"
                    >
                      <Trash2 className="size-3.5" /> Confirm forget
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPendingForgetId(memory.id)}
                    disabled={busyId === memory.id}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-100/65 transition hover:bg-rose-300/[0.08] hover:text-rose-100 disabled:opacity-40"
                  >
                    <Trash2 className="size-3.5" /> Forget
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void updateMemory(memory)}
                  disabled={busyId === memory.id || !memory.value.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#170d20] transition hover:bg-fuchsia-100 disabled:opacity-40"
                >
                  {busyId === memory.id ? (
                    <LoaderCircle className="size-3.5 animate-spin" />
                  ) : (
                    <Save className="size-3.5" />
                  )}
                  Save
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/10 p-5 text-sm leading-6 text-white/35">
          No durable memories yet. Companions learn only from explicit details you share, and you
          remain in control here.
        </div>
      )}
    </section>
  );
}

function CreateMemoryForm({
  characters,
  onCreated,
  onError,
}: {
  characters: CharacterOption[];
  onCreated: () => Promise<void>;
  onError: (error: string | null) => void;
}) {
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    onError(null);
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: formData.get('characterId'),
          label: formData.get('label'),
          value: formData.get('value'),
          importance: Number(formData.get('importance')),
        }),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(body?.error ?? 'Could not add memory.');
      await onCreated();
    } catch (caughtError) {
      onError(caughtError instanceof Error ? caughtError.message : 'Could not add memory.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mt-5 grid gap-3 rounded-2xl border border-fuchsia-200/15 bg-fuchsia-300/[0.045] p-4 sm:grid-cols-2"
    >
      <label className="text-xs text-white/45">
        Companion
        <select name="characterId" required className={createInputClassName}>
          {characters.map((character) => (
            <option key={character.id} value={character.id}>
              {character.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs text-white/45">
        Label
        <input
          name="label"
          required
          maxLength={64}
          placeholder="Favorite hobby"
          className={createInputClassName}
        />
      </label>
      <label className="text-xs text-white/45 sm:col-span-2">
        What should they remember?
        <textarea
          name="value"
          required
          maxLength={500}
          rows={3}
          className={`${createInputClassName} resize-y`}
        />
      </label>
      <label className="text-xs text-white/45">
        Importance
        <select name="importance" defaultValue="3" className={createInputClassName}>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-end justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-semibold text-[#170d20] disabled:opacity-40"
        >
          {isSaving ? (
            <LoaderCircle className="size-3.5 animate-spin" />
          ) : (
            <Plus className="size-3.5" />
          )}
          Add memory
        </button>
      </div>
    </form>
  );
}

function humanizeKey(key: string) {
  return key.replace(/-/g, ' ');
}

const createInputClassName =
  'mt-2 w-full rounded-xl border border-white/[0.09] bg-[#120d18] px-3 py-2 text-sm text-white/75 outline-none focus:border-fuchsia-200/25';
