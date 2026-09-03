'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, Loader2, Sparkles, FileText, Eye } from 'lucide-react';

type Concept = {
  id: string;
  title: string;
  concept: string;
  hook: string;
  platform?: string;
  estimatedDuration?: number;
  originalityNotes?: string;
  borrowedElements: string[];
  createdAt: string;
};

export function ConceptGenerator({
  characterId,
  onViewStoryboard,
}: {
  characterId: string;
  onViewStoryboard: (conceptId: string) => void;
}) {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [analyses, setAnalyses] = useState<{ id: string; reference: { title?: string } }[]>([]);

  const [form, setForm] = useState({
    analysisId: '',
    objective: '',
    platform: 'tiktok',
    constraints: '',
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/content-lab/concepts?characterId=${characterId}`).then((r) => r.json()),
      fetch(`/api/content-lab/analyses?characterId=${characterId}`).then((r) => r.json()),
    ]).then(([c, a]) => {
      setConcepts(c.concepts ?? []);
      setAnalyses((a.analyses ?? []).filter((an: any) => an.status === 'COMPLETED'));
      setLoading(false);
    });
  }, [characterId]);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.objective) return;
    setGenerating(true);
    const res = await fetch('/api/content-lab/concepts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        characterId,
        analysisId: form.analysisId || undefined,
        objective: form.objective,
        platform: form.platform,
        constraints: form.constraints || undefined,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setConcepts((prev) => [data.concept, ...prev]);
    }
    setGenerating(false);
  }

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-6 animate-spin text-fuchsia-300/50" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Content Concepts</h2>
        <p className="text-sm text-white/40">
          Generate original content concepts informed by structural analysis.
        </p>
      </div>

      <form
        onSubmit={generate}
        className="space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">
              Based on analysis (optional)
            </label>
            <select
              value={form.analysisId}
              onChange={(e) => setForm((p) => ({ ...p, analysisId: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-fuchsia-300/30 focus:outline-none"
            >
              <option value="" className="bg-[#1a1225]">
                No specific analysis
              </option>
              {analyses.map((a) => (
                <option key={a.id} value={a.id} className="bg-[#1a1225]">
                  {a.reference?.title ?? a.id.slice(0, 12)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Platform</label>
            <select
              value={form.platform}
              onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-fuchsia-300/30 focus:outline-none"
            >
              <option value="tiktok" className="bg-[#1a1225]">
                TikTok
              </option>
              <option value="instagram-reels" className="bg-[#1a1225]">
                Instagram Reels
              </option>
              <option value="youtube-shorts" className="bg-[#1a1225]">
                YouTube Shorts
              </option>
              <option value="youtube" className="bg-[#1a1225]">
                YouTube
              </option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Objective</label>
          <input
            placeholder="e.g., increase engagement, grow followers, promote product..."
            value={form.objective}
            onChange={(e) => setForm((p) => ({ ...p, objective: e.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-300/30 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">
            Constraints (optional)
          </label>
          <input
            placeholder="e.g., max 15 seconds, no text overlay..."
            value={form.constraints}
            onChange={(e) => setForm((p) => ({ ...p, constraints: e.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-300/30 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={generating || !form.objective}
          className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100 disabled:opacity-50"
        >
          {generating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          Generate Concept
        </button>
      </form>

      {concepts.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] py-16">
          <Lightbulb className="size-10 text-white/20" />
          <h3 className="mt-4 font-semibold">No concepts yet</h3>
          <p className="mt-1 text-sm text-white/40">Generate your first content concept above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {concepts.map((c) => (
            <div key={c.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{c.title}</h3>
                <div className="flex items-center gap-2">
                  {c.platform && (
                    <span className="rounded-lg bg-white/[0.06] px-2 py-0.5 text-xs text-white/40">
                      {c.platform}
                    </span>
                  )}
                  {c.estimatedDuration && (
                    <span className="text-xs text-white/30">{c.estimatedDuration}s</span>
                  )}
                </div>
              </div>

              <p className="mt-2 text-sm text-white/50">{c.concept}</p>

              <div className="mt-3 rounded-xl bg-white/[0.03] p-3">
                <span className="text-xs font-medium text-fuchsia-200/60">Hook</span>
                <p className="mt-1 text-sm text-white/60">{c.hook}</p>
              </div>

              {c.borrowedElements.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs font-medium text-white/40">
                    Structural elements adapted:
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {c.borrowedElements.map((el, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-amber-300/10 px-2 py-0.5 text-xs text-amber-200/70"
                      >
                        {el}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {c.originalityNotes && (
                <p className="mt-3 text-xs italic text-white/30">{c.originalityNotes}</p>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => onViewStoryboard(c.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <Eye className="size-3.5" />
                  View Storyboard
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
