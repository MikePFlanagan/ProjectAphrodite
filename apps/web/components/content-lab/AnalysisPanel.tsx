'use client';

import { useState, useEffect } from 'react';
import { Brain, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';

type Analysis = {
  id: string;
  status: string;
  archetype?: string;
  hook: Record<string, unknown>;
  pacing: Record<string, unknown>;
  engagement: Record<string, unknown>;
  contentDna: Record<string, unknown>;
  confidence: Record<string, unknown>;
  error?: string;
  createdAt: string;
  reference: { title?: string; platform?: string; sourceType: string };
};

export function AnalysisPanel({ characterId }: { characterId: string }) {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [references, setReferences] = useState<{ id: string; title?: string }[]>([]);
  const [selectedRef, setSelectedRef] = useState('');
  const [running, setRunning] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/content-lab/analyses?characterId=${characterId}`).then((r) => r.json()),
      fetch(`/api/content-lab/references?characterId=${characterId}`).then((r) => r.json()),
    ]).then(([a, r]) => {
      setAnalyses(a.analyses ?? []);
      setReferences(r.references ?? []);
      setLoading(false);
    });
  }, [characterId]);

  async function runAnalysis() {
    if (!selectedRef) return;
    setRunning(true);
    const res = await fetch('/api/content-lab/analyses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referenceId: selectedRef, characterId }),
    });
    if (res.ok) {
      const data = await res.json();
      setAnalyses((prev) => [data.analysis, ...prev]);
    }
    setRunning(false);
  }

  const statusIcon = (s: string) =>
    s === 'COMPLETED' ? <CheckCircle2 className="size-4 text-emerald-400" /> :
    s === 'FAILED' ? <XCircle className="size-4 text-red-400" /> :
    s === 'PROCESSING' ? <Loader2 className="size-4 animate-spin text-amber-400" /> :
    <Clock className="size-4 text-white/30" />;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-fuchsia-300/50" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Content Analysis</h2>
        <p className="text-sm text-white/40">
          Analyze reference content to extract reusable structural characteristics.
        </p>
      </div>

      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-white/50">Reference to analyze</label>
          <select
            value={selectedRef}
            onChange={(e) => setSelectedRef(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-fuchsia-300/30 focus:outline-none"
          >
            <option value="" className="bg-[#1a1225]">Select a reference...</option>
            {references.map((r) => (
              <option key={r.id} value={r.id} className="bg-[#1a1225]">
                {r.title ?? r.id.slice(0, 12)}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={runAnalysis}
          disabled={!selectedRef || running}
          className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100 disabled:opacity-50"
        >
          {running ? <Loader2 className="size-4 animate-spin" /> : <Brain className="size-4" />}
          Analyze
        </button>
      </div>

      {analyses.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] py-16">
          <Brain className="size-10 text-white/20" />
          <h3 className="mt-4 font-semibold">No analyses yet</h3>
          <p className="mt-1 text-sm text-white/40">Select a reference and run your first analysis.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {analyses.map((a) => (
            <div key={a.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <div className="flex items-center gap-3">
                {statusIcon(a.status)}
                <h3 className="text-sm font-medium">
                  {a.reference?.title ?? 'Untitled'} — {a.reference?.platform ?? 'Unknown platform'}
                </h3>
                <span className="ml-auto text-xs text-white/30">{new Date(a.createdAt).toLocaleDateString()}</span>
              </div>

              {a.status === 'COMPLETED' && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {a.archetype && (
                    <div className="rounded-xl bg-white/[0.03] p-3">
                      <span className="text-xs font-medium text-white/40">Archetype</span>
                      <p className="mt-1 text-sm font-medium capitalize">{a.archetype}</p>
                    </div>
                  )}
                  {Object.keys(a.hook).length > 0 && (
                    <div className="rounded-xl bg-white/[0.03] p-3">
                      <span className="text-xs font-medium text-white/40">Hook</span>
                      <p className="mt-1 text-xs text-white/60">{JSON.stringify(a.hook)}</p>
                    </div>
                  )}
                  {Object.keys(a.pacing).length > 0 && (
                    <div className="rounded-xl bg-white/[0.03] p-3">
                      <span className="text-xs font-medium text-white/40">Pacing</span>
                      <p className="mt-1 text-xs text-white/60">{JSON.stringify(a.pacing)}</p>
                    </div>
                  )}
                  {Object.keys(a.engagement).length > 0 && (
                    <div className="rounded-xl bg-white/[0.03] p-3">
                      <span className="text-xs font-medium text-white/40">Engagement</span>
                      <p className="mt-1 text-xs text-white/60">{JSON.stringify(a.engagement)}</p>
                    </div>
                  )}
                </div>
              )}

              {a.status === 'FAILED' && a.error && (
                <p className="mt-3 text-sm text-red-300/70">{a.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
