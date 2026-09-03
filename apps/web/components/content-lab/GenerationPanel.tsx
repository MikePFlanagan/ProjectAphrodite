'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

type Job = {
  id: string;
  provider: string;
  status: string;
  result?: Record<string, unknown>;
  error?: string;
  createdAt: string;
  completedAt?: string;
};

type Provider = {
  id: string;
  name: string;
  status: 'configured' | 'unconfigured' | 'unavailable';
  capabilities: string[];
};

type Concept = {
  id: string;
  title: string;
};

export function GenerationPanel({ characterId }: { characterId: string }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('mock');

  useEffect(() => {
    Promise.all([
      fetch(`/api/content-lab/generation-jobs?action=providers`).then((r) => r.json()),
      fetch(`/api/content-lab/generation-jobs`).then((r) => r.json()),
      fetch(`/api/content-lab/concepts?characterId=${characterId}`).then((r) => r.json()),
    ]).then(([p, j, c]) => {
      setProviders(p.providers ?? []);
      setJobs(j.jobs ?? []);
      setConcepts(c.concepts ?? []);
      setLoading(false);
    });
  }, [characterId]);

  async function startGeneration() {
    if (!selectedConcept) return;
    setGenerating(true);
    const res = await fetch('/api/content-lab/generation-jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conceptId: selectedConcept, provider: selectedProvider }),
    });
    if (res.ok) {
      const data = await res.json();
      setJobs((prev) => [data.job, ...prev]);
    }
    setGenerating(false);
  }

  const statusBadge = (status: string) => {
    const map: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
      COMPLETED: { icon: CheckCircle2, color: 'text-emerald-400', label: 'Complete' },
      FAILED: { icon: XCircle, color: 'text-red-400', label: 'Failed' },
      PROCESSING: { icon: Loader2, color: 'text-amber-400', label: 'Generating' },
      QUEUED: { icon: Clock, color: 'text-white/40', label: 'Queued' },
      CANCELED: { icon: XCircle, color: 'text-white/30', label: 'Canceled' },
    };
    const cfg = map[status] ?? { icon: AlertCircle, color: 'text-white/30', label: status };
    const Icon = cfg.icon;
    return (
      <span className={`flex items-center gap-1.5 text-xs ${cfg.color}`}>
        <Icon className={`size-3.5 ${status === 'PROCESSING' ? 'animate-spin' : ''}`} />
        {cfg.label}
      </span>
    );
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-fuchsia-300/50" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Asset Generation</h2>
        <p className="text-sm text-white/40">Generate video and image assets from your concepts.</p>
      </div>

      {/* Providers */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {providers.map((p) => (
          <div
            key={p.id}
            className={`rounded-xl border p-3 ${
              p.status === 'configured'
                ? 'border-emerald-400/20 bg-emerald-400/[0.04]'
                : 'border-white/[0.08] bg-white/[0.02]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{p.name}</span>
              <span
                className={`rounded-md px-1.5 py-0.5 text-xs ${
                  p.status === 'configured' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-white/[0.06] text-white/30'
                }`}
              >
                {p.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-white/30">{p.capabilities.join(', ')}</p>
          </div>
        ))}
      </div>

      {/* Create Job */}
      <div className="flex items-end gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-white/50">Concept</label>
          <select
            value={selectedConcept}
            onChange={(e) => setSelectedConcept(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-fuchsia-300/30 focus:outline-none"
          >
            <option value="" className="bg-[#1a1225]">Select concept...</option>
            {concepts.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#1a1225]">{c.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Provider</label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-fuchsia-300/30 focus:outline-none"
          >
            {providers.filter((p) => p.status === 'configured').map((p) => (
              <option key={p.id} value={p.id} className="bg-[#1a1225]">{p.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={startGeneration}
          disabled={!selectedConcept || generating}
          className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100 disabled:opacity-50"
        >
          {generating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          Generate
        </button>
      </div>

      {/* Jobs */}
      {jobs.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] py-16">
          <Sparkles className="size-10 text-white/20" />
          <h3 className="mt-4 font-semibold">No generation jobs yet</h3>
          <p className="mt-1 text-sm text-white/40">Select a concept and start generating.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((j) => (
            <div key={j.id} className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div>
                <span className="text-sm font-medium">{j.provider}</span>
                <span className="ml-2 text-xs text-white/30">{new Date(j.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                {statusBadge(j.status)}
                {j.error && <span className="max-w-[200px] truncate text-xs text-red-300/60">{j.error}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
