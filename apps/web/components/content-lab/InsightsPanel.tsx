'use client';

import { useState, useEffect } from 'react';
import { Brain, Loader2, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';

type Insight = {
  id: string;
  dimension: string;
  insight: string;
  sampleSize: number;
  metric: string;
  baseline?: number;
  observed?: number;
  effect?: number;
  confidence?: number;
  createdAt: string;
};

export function InsightsPanel({ characterId }: { characterId: string }) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch(`/api/content-lab/insights?characterId=${characterId}`)
      .then((r) => r.json())
      .then((d) => setInsights(d.insights ?? []))
      .finally(() => setLoading(false));
  }, [characterId]);

  async function regenerate() {
    setGenerating(true);
    const res = await fetch('/api/content-lab/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ characterId }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.insights?.length > 0) {
        const fresh = await fetch(`/api/content-lab/insights?characterId=${characterId}`).then((r) => r.json());
        setInsights(fresh.insights ?? []);
      }
    }
    setGenerating(false);
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-fuchsia-300/50" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Character Insights</h2>
          <p className="text-sm text-white/40">
            Data-driven patterns from this character's content performance.
          </p>
        </div>
        <button
          onClick={regenerate}
          disabled={generating}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/[0.1] disabled:opacity-50"
        >
          {generating ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Refresh Insights
        </button>
      </div>

      {insights.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] py-16">
          <Brain className="size-10 text-white/20" />
          <h3 className="mt-4 font-semibold">No insights yet</h3>
          <p className="mt-2 max-w-sm text-center text-sm text-white/40">
            Insights are generated from performance data. Log at least 3 performance entries to start
            discovering patterns.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-400/10 px-3 py-2 text-xs text-amber-200/70">
            <AlertCircle className="size-3.5" />
            Insufficient data for insight generation
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <div className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-teal-500/20">
                  <TrendingUp className="size-4 text-emerald-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{insight.insight}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/40">
                    <span>Dimension: {insight.dimension}</span>
                    <span>Metric: {insight.metric}</span>
                    <span>Sample: n={insight.sampleSize}</span>
                    {insight.effect != null && <span>Effect: {insight.effect.toFixed(2)}x</span>}
                    {insight.confidence != null && (
                      <span>Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
                    )}
                  </div>
                  {insight.baseline != null && insight.observed != null && (
                    <div className="mt-2 flex gap-4 text-xs text-white/30">
                      <span>Baseline: {insight.baseline.toLocaleString()}</span>
                      <span>Observed: {insight.observed.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
