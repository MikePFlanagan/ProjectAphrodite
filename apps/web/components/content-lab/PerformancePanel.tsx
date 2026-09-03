'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Loader2, Plus } from 'lucide-react';

type Performance = {
  id: string;
  platform: string;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  clicks?: number;
  followersGained?: number;
  revenue?: number;
  measuredAt: string;
  concept?: { id: string; title: string; platform?: string };
};

export function PerformancePanel({ characterId }: { characterId: string }) {
  const [perfs, setPerfs] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    platform: 'tiktok',
    views: '',
    likes: '',
    comments: '',
    shares: '',
    saves: '',
    clicks: '',
    followersGained: '',
    revenue: '',
  });

  useEffect(() => {
    fetch(`/api/content-lab/performance?characterId=${characterId}`)
      .then((r) => r.json())
      .then((d) => setPerfs(d.performances ?? []))
      .finally(() => setLoading(false));
  }, [characterId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body: Record<string, unknown> = { characterId, platform: form.platform };
    if (form.views) body.views = Number(form.views);
    if (form.likes) body.likes = Number(form.likes);
    if (form.comments) body.comments = Number(form.comments);
    if (form.shares) body.shares = Number(form.shares);
    if (form.saves) body.saves = Number(form.saves);
    if (form.clicks) body.clicks = Number(form.clicks);
    if (form.followersGained) body.followersGained = Number(form.followersGained);
    if (form.revenue) body.revenue = Number(form.revenue);

    const res = await fetch('/api/content-lab/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      setPerfs((prev) => [data.performance, ...prev]);
      setShowForm(false);
      setForm({
        platform: 'tiktok',
        views: '',
        likes: '',
        comments: '',
        shares: '',
        saves: '',
        clicks: '',
        followersGained: '',
        revenue: '',
      });
    }
    setSaving(false);
  }

  // Compute aggregate
  const totalViews = perfs.reduce((s, p) => s + (p.views ?? 0), 0);
  const totalLikes = perfs.reduce((s, p) => s + (p.likes ?? 0), 0);
  const totalShares = perfs.reduce((s, p) => s + (p.shares ?? 0), 0);
  const engagementRate =
    totalViews > 0 ? (((totalLikes + totalShares) / totalViews) * 100).toFixed(2) : null;

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
          <h2 className="text-lg font-semibold">Performance Tracking</h2>
          <p className="text-sm text-white/40">Track and analyze content performance metrics.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100"
        >
          <Plus className="size-4" /> Log Performance
        </button>
      </div>

      {/* Aggregate Stats */}
      {perfs.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <span className="text-xs text-white/40">Total Views</span>
            <p className="mt-1 text-xl font-bold">{totalViews.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <span className="text-xs text-white/40">Total Likes</span>
            <p className="mt-1 text-xl font-bold">{totalLikes.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <span className="text-xs text-white/40">Total Shares</span>
            <p className="mt-1 text-xl font-bold">{totalShares.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <span className="text-xs text-white/40">Engagement Rate</span>
            <p className="mt-1 text-xl font-bold">{engagementRate ? `${engagementRate}%` : '—'}</p>
          </div>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
        >
          <select
            value={form.platform}
            onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value }))}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:outline-none"
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
          <div className="grid gap-3 sm:grid-cols-4">
            {(
              [
                'views',
                'likes',
                'comments',
                'shares',
                'saves',
                'clicks',
                'followersGained',
                'revenue',
              ] as const
            ).map((f) => (
              <input
                key={f}
                type="number"
                placeholder={f.replace(/([A-Z])/g, ' $1')}
                value={form[f]}
                onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none"
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100 disabled:opacity-50"
          >
            {saving && <Loader2 className="size-4 animate-spin" />} Save
          </button>
        </form>
      )}

      {perfs.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] py-16">
          <BarChart3 className="size-10 text-white/20" />
          <h3 className="mt-4 font-semibold">No performance data yet</h3>
          <p className="mt-1 text-sm text-white/40">
            Log metrics from published content to start tracking.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {perfs.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
            >
              <div className="flex items-center gap-3">
                <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-xs text-white/40">
                  {p.platform}
                </span>
                <span className="text-sm">{p.concept?.title ?? 'Manual entry'}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/40">
                {p.views != null && <span>{p.views.toLocaleString()} views</span>}
                {p.likes != null && <span>{p.likes.toLocaleString()} likes</span>}
                {p.shares != null && <span>{p.shares.toLocaleString()} shares</span>}
                <span>{new Date(p.measuredAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
