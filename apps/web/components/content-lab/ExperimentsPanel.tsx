'use client';

import { useState, useEffect } from 'react';
import { Beaker, Loader2, Plus } from 'lucide-react';

type Experiment = {
  id: string;
  title: string;
  hypothesis?: string;
  variable: string;
  variants: { name: string; description?: string }[];
  status: string;
  concepts: { id: string; title: string }[];
  createdAt: string;
};

export function ExperimentsPanel({ characterId }: { characterId: string }) {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    hypothesis: '',
    variable: '',
    variantNames: 'Variant A, Variant B',
  });

  useEffect(() => {
    fetch(`/api/content-lab/experiments?characterId=${characterId}`)
      .then((r) => r.json())
      .then((d) => setExperiments(d.experiments ?? []))
      .finally(() => setLoading(false));
  }, [characterId]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const variants = form.variantNames
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean)
      .map((name) => ({ name }));

    const res = await fetch('/api/content-lab/experiments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        characterId,
        title: form.title,
        hypothesis: form.hypothesis || undefined,
        variable: form.variable,
        variants,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setExperiments((prev) => [{ ...data.experiment, concepts: [] }, ...prev]);
      setShowForm(false);
      setForm({ title: '', hypothesis: '', variable: '', variantNames: 'Variant A, Variant B' });
    }
    setSaving(false);
  }

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-6 animate-spin text-fuchsia-300/50" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Experiments</h2>
          <p className="text-sm text-white/40">
            A/B test content variants to find what works best.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100"
        >
          <Plus className="size-4" /> New Experiment
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={create}
          className="space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
        >
          <input
            placeholder="Experiment title"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none"
          />
          <input
            placeholder="Variable being tested (e.g., hook type)"
            value={form.variable}
            onChange={(e) => setForm((p) => ({ ...p, variable: e.target.value }))}
            required
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none"
          />
          <textarea
            placeholder="Hypothesis (optional)"
            value={form.hypothesis}
            onChange={(e) => setForm((p) => ({ ...p, hypothesis: e.target.value }))}
            rows={2}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none"
          />
          <input
            placeholder="Variants (comma-separated)"
            value={form.variantNames}
            onChange={(e) => setForm((p) => ({ ...p, variantNames: e.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none"
          />
          <button
            type="submit"
            disabled={saving || !form.title || !form.variable}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100 disabled:opacity-50"
          >
            {saving && <Loader2 className="size-4 animate-spin" />} Create Experiment
          </button>
        </form>
      )}

      {experiments.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] py-16">
          <Beaker className="size-10 text-white/20" />
          <h3 className="mt-4 font-semibold">No experiments yet</h3>
          <p className="mt-1 text-sm text-white/40">
            Create A/B experiments to test content variants.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiments.map((exp) => (
            <div
              key={exp.id}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{exp.title}</h3>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-medium ${exp.status === 'active' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-white/[0.06] text-white/40'}`}
                >
                  {exp.status}
                </span>
              </div>
              {exp.hypothesis && (
                <p className="mt-2 text-sm italic text-white/40">{exp.hypothesis}</p>
              )}
              <div className="mt-3">
                <span className="text-xs font-medium text-white/40">Variable: {exp.variable}</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(exp.variants as any[]).map((v: any, i: number) => (
                    <span
                      key={i}
                      className="rounded-lg bg-violet-300/10 px-2.5 py-1 text-xs text-violet-200/70"
                    >
                      {v.name}
                    </span>
                  ))}
                </div>
              </div>
              {exp.concepts.length > 0 && (
                <div className="mt-3 text-xs text-white/30">
                  {exp.concepts.length} concept{exp.concepts.length > 1 ? 's' : ''} linked
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
