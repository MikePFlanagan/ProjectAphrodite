'use client';

import { useState, useEffect } from 'react';
import { Plus, Link as LinkIcon, Upload, Type, Loader2, ExternalLink } from 'lucide-react';

type Reference = {
  id: string;
  sourceType: string;
  sourceUrl?: string;
  platform?: string;
  title?: string;
  description?: string;
  duration?: number;
  creatorName?: string;
  views?: number;
  likes?: number;
  createdAt: string;
};

export function InspirationPanel({ characterId }: { characterId: string }) {
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch(`/api/content-lab/references?characterId=${characterId}`)
      .then((r) => r.json())
      .then((d) => setReferences(d.references ?? []))
      .finally(() => setLoading(false));
  }, [characterId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Inspiration Library</h2>
          <p className="text-sm text-white/40">
            Add reference content to analyze and draw structural inspiration from.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100"
        >
          <Plus className="size-4" />
          Add Reference
        </button>
      </div>

      {showForm && (
        <AddReferenceForm
          characterId={characterId}
          onAdded={(ref) => {
            setReferences((prev) => [ref, ...prev]);
            setShowForm(false);
          }}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-fuchsia-300/50" />
        </div>
      ) : references.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] py-16">
          <Upload className="size-10 text-white/20" />
          <h3 className="mt-4 font-semibold">No references yet</h3>
          <p className="mt-1 text-sm text-white/40">
            Add URLs, upload media, or enter content details manually.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {references.map((ref) => (
            <div
              key={ref.id}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-white/15"
            >
              <div className="flex items-center gap-2">
                {ref.sourceType === 'URL' ? (
                  <LinkIcon className="size-4 text-blue-300/60" />
                ) : ref.sourceType === 'UPLOAD' ? (
                  <Upload className="size-4 text-green-300/60" />
                ) : (
                  <Type className="size-4 text-amber-300/60" />
                )}
                <span className="text-xs font-medium uppercase text-white/30">
                  {ref.sourceType}
                </span>
                {ref.platform && (
                  <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-xs text-white/40">
                    {ref.platform}
                  </span>
                )}
              </div>

              <h3 className="mt-3 text-sm font-medium">
                {ref.title ?? ref.sourceUrl?.slice(0, 60) ?? 'Untitled'}
              </h3>

              {ref.description && (
                <p className="mt-1 line-clamp-2 text-xs text-white/40">{ref.description}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/30">
                {ref.views != null && <span>{ref.views.toLocaleString()} views</span>}
                {ref.likes != null && <span>{ref.likes.toLocaleString()} likes</span>}
                {ref.duration != null && <span>{ref.duration}s</span>}
                {ref.creatorName && <span>by {ref.creatorName}</span>}
              </div>

              {ref.sourceUrl && (
                <a
                  href={ref.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-1 text-xs text-fuchsia-200/50 hover:text-fuchsia-200"
                >
                  <ExternalLink className="size-3" />
                  View source
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddReferenceForm({
  characterId,
  onAdded,
}: {
  characterId: string;
  onAdded: (ref: Reference) => void;
}) {
  const [sourceType, setSourceType] = useState<'URL' | 'MANUAL' | 'UPLOAD'>('URL');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    sourceUrl: '',
    platform: '',
    title: '',
    description: '',
    duration: '',
    creatorName: '',
    views: '',
    likes: '',
    comments: '',
    shares: '',
    saves: '',
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const body: Record<string, unknown> = {
      characterId,
      sourceType,
      platform: form.platform || undefined,
      title: form.title || undefined,
      description: form.description || undefined,
      creatorName: form.creatorName || undefined,
    };

    if (sourceType === 'URL' && form.sourceUrl) body.sourceUrl = form.sourceUrl;
    if (form.duration) body.duration = Number(form.duration);
    if (form.views) body.views = Number(form.views);
    if (form.likes) body.likes = Number(form.likes);
    if (form.comments) body.comments = Number(form.comments);
    if (form.shares) body.shares = Number(form.shares);
    if (form.saves) body.saves = Number(form.saves);

    const res = await fetch('/api/content-lab/references', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      onAdded(data.reference);
    }
    setSaving(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
    >
      <div className="flex gap-2">
        {(['URL', 'MANUAL', 'UPLOAD'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setSourceType(t)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              sourceType === t
                ? 'bg-fuchsia-300/[0.12] text-fuchsia-100'
                : 'text-white/40 hover:bg-white/[0.04]'
            }`}
          >
            {t === 'URL' ? 'URL' : t === 'MANUAL' ? 'Manual' : 'Upload'}
          </button>
        ))}
      </div>

      {sourceType === 'URL' && (
        <input
          placeholder="https://..."
          value={form.sourceUrl}
          onChange={(e) => update('sourceUrl', e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-300/30 focus:outline-none"
        />
      )}

      {sourceType === 'UPLOAD' && (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center text-sm text-white/40">
          File upload — coming soon. Use URL or Manual entry for now.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-300/30 focus:outline-none"
        />
        <select
          value={form.platform}
          onChange={(e) => update('platform', e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-fuchsia-300/30 focus:outline-none"
        >
          <option value="" className="bg-[#1a1225]">
            Platform
          </option>
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
          <option value="twitter" className="bg-[#1a1225]">
            Twitter/X
          </option>
          <option value="other" className="bg-[#1a1225]">
            Other
          </option>
        </select>
      </div>

      <textarea
        placeholder="Description / notes"
        value={form.description}
        onChange={(e) => update('description', e.target.value)}
        rows={2}
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-300/30 focus:outline-none"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <input
          placeholder="Creator name"
          value={form.creatorName}
          onChange={(e) => update('creatorName', e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-300/30 focus:outline-none"
        />
        <input
          placeholder="Duration (seconds)"
          type="number"
          value={form.duration}
          onChange={(e) => update('duration', e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-300/30 focus:outline-none"
        />
        <input
          placeholder="Views"
          type="number"
          value={form.views}
          onChange={(e) => update('views', e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-300/30 focus:outline-none"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <input
          placeholder="Likes"
          type="number"
          value={form.likes}
          onChange={(e) => update('likes', e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-300/30 focus:outline-none"
        />
        <input
          placeholder="Comments"
          type="number"
          value={form.comments}
          onChange={(e) => update('comments', e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-300/30 focus:outline-none"
        />
        <input
          placeholder="Shares"
          type="number"
          value={form.shares}
          onChange={(e) => update('shares', e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-300/30 focus:outline-none"
        />
        <input
          placeholder="Saves"
          type="number"
          value={form.saves}
          onChange={(e) => update('saves', e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-300/30 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100 disabled:opacity-50"
      >
        {saving && <Loader2 className="size-4 animate-spin" />}
        Save Reference
      </button>
    </form>
  );
}
