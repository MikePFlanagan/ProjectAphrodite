'use client';

import { useState, useEffect } from 'react';
import { Video, Loader2, Clock, Film } from 'lucide-react';

type Scene = {
  sceneNumber: number;
  startTime: number;
  endTime: number;
  purpose: string;
  shotType?: string;
  framing?: string;
  subjectAction?: string;
  environment?: string;
  dialogue?: string;
  onScreenText?: string;
  transition?: string;
  generationPrompt?: string;
  continuityNotes?: string;
};

type Concept = {
  id: string;
  title: string;
  scenePlan: Scene[];
  script?: string;
  estimatedDuration?: number;
  platform?: string;
};

export function StoryboardView({
  conceptId,
  characterId,
}: {
  conceptId: string | null;
  characterId: string;
}) {
  const [concept, setConcept] = useState<Concept | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conceptId) return;
    setLoading(true);
    fetch(`/api/content-lab/concepts?characterId=${characterId}`)
      .then((r) => r.json())
      .then((d) => {
        const found = (d.concepts ?? []).find((c: any) => c.id === conceptId);
        setConcept(found ?? null);
      })
      .finally(() => setLoading(false));
  }, [conceptId, characterId]);

  if (!conceptId) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] py-16">
        <Video className="size-10 text-white/20" />
        <h3 className="mt-4 font-semibold">No concept selected</h3>
        <p className="mt-1 text-sm text-white/40">
          Generate a concept first, then view its storyboard here.
        </p>
      </div>
    );
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-fuchsia-300/50" /></div>;

  if (!concept) return <p className="text-sm text-white/40">Concept not found.</p>;

  const scenes: Scene[] = Array.isArray(concept.scenePlan) ? concept.scenePlan : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{concept.title}</h2>
        <div className="mt-1 flex items-center gap-3 text-sm text-white/40">
          {concept.platform && <span>{concept.platform}</span>}
          {concept.estimatedDuration && (
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {concept.estimatedDuration}s
            </span>
          )}
          <span>{scenes.length} scenes</span>
        </div>
      </div>

      {concept.script && (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-fuchsia-200/70">Script</h3>
          <pre className="mt-3 whitespace-pre-wrap text-sm text-white/60">{concept.script}</pre>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white/60">Storyboard</h3>
        {scenes.length === 0 ? (
          <p className="text-sm text-white/40">No scene plan available.</p>
        ) : (
          <div className="relative space-y-0">
            {scenes.map((scene, i) => (
              <div key={i} className="relative flex gap-4 pb-6">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-400/20 to-violet-500/20 text-sm font-bold text-fuchsia-200">
                    {scene.sceneNumber}
                  </div>
                  {i < scenes.length - 1 && (
                    <div className="mt-2 flex-1 w-px bg-gradient-to-b from-fuchsia-300/20 to-transparent" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-fuchsia-300/10 px-2 py-0.5 text-xs font-medium text-fuchsia-200/70">
                        {scene.purpose}
                      </span>
                      {scene.shotType && (
                        <span className="flex items-center gap-1 text-xs text-white/30">
                          <Film className="size-3" />
                          {scene.shotType}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-white/30">
                      {scene.startTime.toFixed(1)}s – {scene.endTime.toFixed(1)}s
                    </span>
                  </div>

                  {scene.subjectAction && (
                    <p className="mt-2 text-sm text-white/60">{scene.subjectAction}</p>
                  )}

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {scene.environment && (
                      <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                        <span className="text-xs text-white/30">Environment</span>
                        <p className="text-xs text-white/50">{scene.environment}</p>
                      </div>
                    )}
                    {scene.dialogue && (
                      <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                        <span className="text-xs text-white/30">Dialogue</span>
                        <p className="text-xs text-white/50">{scene.dialogue}</p>
                      </div>
                    )}
                    {scene.onScreenText && (
                      <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                        <span className="text-xs text-white/30">On-screen text</span>
                        <p className="text-xs text-white/50">{scene.onScreenText}</p>
                      </div>
                    )}
                    {scene.transition && (
                      <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                        <span className="text-xs text-white/30">Transition</span>
                        <p className="text-xs text-white/50">{scene.transition}</p>
                      </div>
                    )}
                  </div>

                  {scene.generationPrompt && (
                    <div className="mt-3 rounded-lg border border-violet-300/10 bg-violet-300/[0.04] px-3 py-2">
                      <span className="text-xs font-medium text-violet-200/50">Generation prompt</span>
                      <p className="mt-0.5 text-xs text-white/50">{scene.generationPrompt}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
