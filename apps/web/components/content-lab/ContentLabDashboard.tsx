'use client';

import { useState } from 'react';
import {
  FlaskConical,
  Sparkles,
  Library,
  Brain,
  Video,
  Calendar,
  BarChart3,
  Lightbulb,
  Beaker,
  ChevronRight,
  Plus,
  User,
} from 'lucide-react';
import { InspirationPanel } from './InspirationPanel';
import { AnalysisPanel } from './AnalysisPanel';
import { ConceptGenerator } from './ConceptGenerator';
import { StoryboardView } from './StoryboardView';
import { GenerationPanel } from './GenerationPanel';
import { ContentPlannerPanel } from './ContentPlannerPanel';
import { PerformancePanel } from './PerformancePanel';
import { InsightsPanel } from './InsightsPanel';
import { ExperimentsPanel } from './ExperimentsPanel';

type Character = {
  id: string;
  name: string;
  tagline: string;
  avatarUrl: string;
  category: string;
  traits: string[];
};

type Tab =
  | 'overview'
  | 'inspiration'
  | 'analysis'
  | 'concepts'
  | 'storyboard'
  | 'generation'
  | 'planner'
  | 'performance'
  | 'insights'
  | 'experiments';

const tabs: { id: Tab; label: string; icon: typeof FlaskConical }[] = [
  { id: 'overview', label: 'Overview', icon: FlaskConical },
  { id: 'inspiration', label: 'Inspiration', icon: Library },
  { id: 'analysis', label: 'Analysis', icon: Brain },
  { id: 'concepts', label: 'Concepts', icon: Lightbulb },
  { id: 'storyboard', label: 'Storyboard', icon: Video },
  { id: 'generation', label: 'Generation', icon: Sparkles },
  { id: 'planner', label: 'Planner', icon: Calendar },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'insights', label: 'Insights', icon: Brain },
  { id: 'experiments', label: 'Experiments', icon: Beaker },
];

export function ContentLabDashboard({
  characters,
  recentAnalyses,
  recentConcepts,
  recentJobs,
  recentPlans,
}: {
  characters: Character[];
  recentAnalyses: any[];
  recentConcepts: any[];
  recentJobs: any[];
  recentPlans: any[];
}) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    characters[0] ?? null,
  );
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-200/60">
            <FlaskConical className="size-4" />
            Content Lab
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Content Intelligence</h1>
          <p className="mt-1 text-sm text-white/40">
            Analyze, create, and optimize content for your characters.
          </p>
        </div>

        {/* Character Selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedCharacter?.id ?? ''}
            onChange={(e) => {
              const c = characters.find((ch) => ch.id === e.target.value);
              setSelectedCharacter(c ?? null);
            }}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white backdrop-blur-sm transition focus:border-fuchsia-300/30 focus:outline-none"
          >
            {characters.length === 0 && <option value="">No characters yet</option>}
            {characters.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#1a1225]">
                {c.name}
              </option>
            ))}
          </select>

          {selectedCharacter && (
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
              <div className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-500 text-xs font-bold">
                {selectedCharacter.name[0]}
              </div>
              <span className="text-sm font-medium">{selectedCharacter.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.02] p-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-fuchsia-300/[0.12] text-fuchsia-100'
                  : 'text-white/40 hover:bg-white/[0.04] hover:text-white/70'
              }`}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {!selectedCharacter ? (
        <EmptyCharacterState />
      ) : activeTab === 'overview' ? (
        <OverviewTab
          character={selectedCharacter}
          recentAnalyses={recentAnalyses}
          recentConcepts={recentConcepts}
          recentJobs={recentJobs}
          recentPlans={recentPlans}
          onNavigate={setActiveTab}
        />
      ) : activeTab === 'inspiration' ? (
        <InspirationPanel characterId={selectedCharacter.id} />
      ) : activeTab === 'analysis' ? (
        <AnalysisPanel characterId={selectedCharacter.id} />
      ) : activeTab === 'concepts' ? (
        <ConceptGenerator
          characterId={selectedCharacter.id}
          onViewStoryboard={(id) => {
            setSelectedConceptId(id);
            setActiveTab('storyboard');
          }}
        />
      ) : activeTab === 'storyboard' ? (
        <StoryboardView conceptId={selectedConceptId} characterId={selectedCharacter.id} />
      ) : activeTab === 'generation' ? (
        <GenerationPanel characterId={selectedCharacter.id} />
      ) : activeTab === 'planner' ? (
        <ContentPlannerPanel
          characterId={selectedCharacter.id}
          characterName={selectedCharacter.name}
        />
      ) : activeTab === 'performance' ? (
        <PerformancePanel characterId={selectedCharacter.id} />
      ) : activeTab === 'insights' ? (
        <InsightsPanel characterId={selectedCharacter.id} />
      ) : activeTab === 'experiments' ? (
        <ExperimentsPanel characterId={selectedCharacter.id} />
      ) : null}
    </div>
  );
}

function EmptyCharacterState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.015] py-20">
      <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-400/20 to-violet-500/20">
        <User className="size-7 text-fuchsia-200/60" />
      </div>
      <h3 className="mt-5 text-lg font-semibold">Create a Character First</h3>
      <p className="mt-2 max-w-sm text-center text-sm text-white/40">
        Content Lab works with your existing characters. Head to Creator Studio to create your first
        character, then come back here.
      </p>
      <a
        href="/creator"
        className="mt-6 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100"
      >
        Open Creator Studio
      </a>
    </div>
  );
}

function OverviewTab({
  character,
  recentAnalyses,
  recentConcepts,
  recentJobs,
  recentPlans,
  onNavigate,
}: {
  character: Character;
  recentAnalyses: any[];
  recentConcepts: any[];
  recentJobs: any[];
  recentPlans: any[];
  onNavigate: (tab: Tab) => void;
}) {
  const cards = [
    {
      title: 'Inspiration Library',
      description: 'Add reference content to analyze',
      icon: Library,
      tab: 'inspiration' as Tab,
      count: null,
      color: 'from-amber-400/20 to-orange-500/20',
    },
    {
      title: 'Content Analyses',
      description: 'Structural breakdowns of reference content',
      icon: Brain,
      tab: 'analysis' as Tab,
      count: recentAnalyses.length,
      color: 'from-blue-400/20 to-cyan-500/20',
    },
    {
      title: 'Content Concepts',
      description: 'Original concepts generated for your character',
      icon: Lightbulb,
      tab: 'concepts' as Tab,
      count: recentConcepts.length,
      color: 'from-fuchsia-400/20 to-pink-500/20',
    },
    {
      title: 'Generation Jobs',
      description: 'Asset generation status',
      icon: Video,
      tab: 'generation' as Tab,
      count: recentJobs.length,
      color: 'from-violet-400/20 to-indigo-500/20',
    },
    {
      title: 'Content Plans',
      description: 'Multi-day content calendars',
      icon: Calendar,
      tab: 'planner' as Tab,
      count: recentPlans.length,
      color: 'from-emerald-400/20 to-teal-500/20',
    },
    {
      title: 'Performance',
      description: 'Track how content performs',
      icon: BarChart3,
      tab: 'performance' as Tab,
      count: null,
      color: 'from-rose-400/20 to-red-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Primary CTA */}
      <div className="rounded-3xl border border-fuchsia-300/15 bg-gradient-to-br from-fuchsia-400/[0.08] to-violet-500/[0.04] p-8">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-400 to-violet-500 shadow-[0_0_30px_rgba(217,70,239,0.2)]">
            <Sparkles className="size-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Create Content for {character.name}</h2>
            <p className="mt-1 text-sm text-white/50">
              Start by adding inspiration, then generate original concepts.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('inspiration')}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100"
          >
            <Plus className="size-4" />
            Add Inspiration
          </button>
          <button
            onClick={() => onNavigate('concepts')}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-5 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/[0.1] hover:text-white"
          >
            <Sparkles className="size-4" />
            Generate Concept
          </button>
          <button
            onClick={() => onNavigate('planner')}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-5 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/[0.1] hover:text-white"
          >
            <Calendar className="size-4" />
            Build Content Plan
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.tab}
              onClick={() => onNavigate(card.tab)}
              className="group flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-left transition hover:border-white/15 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br ${card.color}`}
                >
                  <Icon className="size-5 text-white/80" />
                </div>
                {card.count != null && card.count > 0 && (
                  <span className="rounded-lg bg-white/[0.06] px-2 py-0.5 text-xs font-medium text-white/50">
                    {card.count}
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-sm font-semibold">{card.title}</h3>
              <p className="mt-1 text-xs text-white/40">{card.description}</p>

              <div className="mt-auto flex items-center gap-1 pt-4 text-xs font-medium text-fuchsia-200/50 transition group-hover:text-fuchsia-200">
                Open
                <ChevronRight className="size-3" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
