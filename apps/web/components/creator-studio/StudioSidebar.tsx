import {
  Check,
  ChevronRight,
  Circle,
  Sparkles,
} from 'lucide-react';

import type {
  StudioSection,
  StudioSectionId,
} from './types';

type StudioSidebarProps = {
  sections: StudioSection[];
  activeSection: StudioSectionId;
  onSectionChange: (
    sectionId: StudioSectionId,
  ) => void;
  companionName: string;
};

export function StudioSidebar({
  sections,
  activeSection,
  onSectionChange,
  companionName,
}: StudioSidebarProps) {
  const completedCount = sections.filter(
    (section) => section.completed,
  ).length;

  const progress = Math.round(
    (completedCount / sections.length) * 100,
  );

  return (
    <aside className="border-b border-white/[0.08] bg-[#0d0a12] lg:border-b-0 lg:border-r">
      <div className="p-5">
        <div className="rounded-[22px] border border-fuchsia-200/12 bg-gradient-to-br from-fuchsia-300/[0.08] via-violet-300/[0.035] to-transparent p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-400 to-violet-500 text-white shadow-[0_0_28px_rgba(217,70,239,0.18)]">
              <Sparkles className="size-4" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {companionName}
              </p>

              <p className="mt-0.5 text-xs text-white/35">
                Companion draft
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                Completion
              </p>

              <p className="mt-1 text-xl font-semibold text-white">
                {progress}%
              </p>
            </div>

            <p className="text-xs text-white/30">
              {completedCount} of {sections.length}
            </p>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/25">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-indigo-400"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-5 pb-5 lg:block lg:space-y-1 lg:overflow-visible">
        {sections.map((section) => {
          const Icon = section.icon;
          const active =
            activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() =>
                onSectionChange(section.id)
              }
              className={`group flex min-w-[210px] items-center gap-3 rounded-2xl border px-3 py-3 text-left transition lg:w-full lg:min-w-0 ${
                active
                  ? 'border-fuchsia-200/15 bg-fuchsia-300/[0.09] text-white'
                  : 'border-transparent text-white/45 hover:border-white/[0.06] hover:bg-white/[0.035] hover:text-white'
              }`}
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-xl transition ${
                  active
                    ? 'bg-fuchsia-300/[0.12] text-fuchsia-100'
                    : 'bg-white/[0.035] text-white/45 group-hover:bg-white/[0.065] group-hover:text-white'
                }`}
              >
                <Icon className="size-4" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">
                  {section.title}
                </span>

                <span className="mt-0.5 hidden truncate text-[11px] text-white/28 xl:block">
                  {section.description}
                </span>
              </span>

              {section.completed ? (
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-300/[0.1] text-emerald-200">
                  <Check className="size-3" />
                </span>
              ) : active ? (
                <ChevronRight className="size-4 shrink-0 text-fuchsia-200/60" />
              ) : (
                <Circle className="size-3 shrink-0 text-white/15" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
