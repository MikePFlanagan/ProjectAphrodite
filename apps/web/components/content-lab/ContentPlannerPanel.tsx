'use client';

import { useState, useEffect } from 'react';
import { Calendar, Loader2, Plus } from 'lucide-react';

type PlanItem = {
  id: string;
  scheduledAt?: string;
  platform?: string;
  archetype?: string;
  hookSummary?: string;
  status: string;
  concept?: { id: string; title: string };
};

type Plan = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  items: PlanItem[];
  _count?: { items: number };
};

const STATUS_COLORS: Record<string, string> = {
  IDEA: 'bg-white/[0.06] text-white/40',
  DRAFT: 'bg-blue-400/10 text-blue-300',
  READY_FOR_GENERATION: 'bg-amber-400/10 text-amber-300',
  GENERATING: 'bg-fuchsia-400/10 text-fuchsia-300',
  READY_FOR_REVIEW: 'bg-violet-400/10 text-violet-300',
  APPROVED: 'bg-emerald-400/10 text-emerald-300',
  SCHEDULED: 'bg-cyan-400/10 text-cyan-300',
  PUBLISHED: 'bg-green-400/10 text-green-300',
  FAILED: 'bg-red-400/10 text-red-300',
};

export function ContentPlannerPanel({
  characterId,
  characterName,
}: {
  characterId: string;
  characterName: string;
}) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', days: '7', postsPerDay: '1', platforms: 'tiktok', objectives: '' });

  useEffect(() => {
    fetch(`/api/content-lab/plans?characterId=${characterId}`)
      .then((r) => r.json())
      .then((d) => setPlans(d.plans ?? []))
      .finally(() => setLoading(false));
  }, [characterId]);

  async function createPlan(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch('/api/content-lab/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        characterId,
        title: form.title || `${characterName} ${form.days}-day plan`,
        platforms: form.platforms.split(',').map((p) => p.trim()),
        days: Number(form.days),
        postsPerDay: Number(form.postsPerDay),
        objectives: form.objectives || undefined,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setPlans((prev) => [data.plan, ...prev]);
      setShowForm(false);
    }
    setCreating(false);
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-fuchsia-300/50" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Content Planner</h2>
          <p className="text-sm text-white/40">Build multi-day content calendars for {characterName}.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100"
        >
          <Plus className="size-4" />
          New Plan
        </button>
      </div>

      {showForm && (
        <form onSubmit={createPlan} className="space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Plan title (optional)" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-300/30 focus:outline-none" />
            <input placeholder="Platforms (comma-separated)" value={form.platforms} onChange={(e) => setForm((p) => ({ ...p, platforms: e.target.value }))} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-300/30 focus:outline-none" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input type="number" placeholder="Days" value={form.days} onChange={(e) => setForm((p) => ({ ...p, days: e.target.value }))} min="1" max="90" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-300/30 focus:outline-none" />
            <input type="number" placeholder="Posts per day" value={form.postsPerDay} onChange={(e) => setForm((p) => ({ ...p, postsPerDay: e.target.value }))} min="1" max="10" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-300/30 focus:outline-none" />
          </div>
          <input placeholder="Objectives (optional)" value={form.objectives} onChange={(e) => setForm((p) => ({ ...p, objectives: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-300/30 focus:outline-none" />
          <button type="submit" disabled={creating} className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100 disabled:opacity-50">
            {creating ? <Loader2 className="size-4 animate-spin" /> : <Calendar className="size-4" />}
            Generate Plan
          </button>
        </form>
      )}

      {plans.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] py-16">
          <Calendar className="size-10 text-white/20" />
          <h3 className="mt-4 font-semibold">No content plans yet</h3>
          <p className="mt-1 text-sm text-white/40">Create your first multi-day content calendar.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{plan.title}</h3>
                <span className="text-xs text-white/30">
                  {new Date(plan.startDate).toLocaleDateString()} – {new Date(plan.endDate).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {(plan.items ?? []).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-xl bg-white/[0.02] p-3">
                    {item.scheduledAt && (
                      <span className="shrink-0 text-xs font-medium text-white/40">
                        {new Date(item.scheduledAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    <span className="flex-1 truncate text-sm">
                      {item.concept?.title ?? item.hookSummary ?? 'Untitled'}
                    </span>
                    {item.platform && (
                      <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-xs text-white/30">{item.platform}</span>
                    )}
                    {item.archetype && (
                      <span className="rounded bg-violet-300/10 px-1.5 py-0.5 text-xs text-violet-200/50">{item.archetype}</span>
                    )}
                    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[item.status] ?? ''}`}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
