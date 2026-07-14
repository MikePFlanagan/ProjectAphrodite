import Link from 'next/link';
import {
  ArrowLeft,
  Brain,
  BriefcaseBusiness,
  Heart,
  MapPin,
  PawPrint,
  Sparkles,
  Target,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

import { db } from '@aphrodite/database';

import { DeleteMemoryButton } from '@/components/memory/DeleteMemoryButton';
import { EditMemoryButton } from '@/components/memory/EditMemoryButton';
import { requireUser } from '@/lib/require-auth';

type CategoryConfig = {
  label: string;
  description: string;
  icon: LucideIcon;
};

const categoryOrder = [
  'personal',
  'preferences',
  'career',
  'goals',
  'location',
  'pets',
  'relationships',
  'lifestyle',
  'other',
] as const;

type MemoryCategory =
  (typeof categoryOrder)[number];

const categoryConfig: Record<
  MemoryCategory,
  CategoryConfig
> = {
  personal: {
    label: 'Personal',
    description: 'Identity, birthdays, and personal details.',
    icon: UserRound,
  },
  preferences: {
    label: 'Preferences',
    description: 'Favorites, likes, dislikes, and tastes.',
    icon: Heart,
  },
  career: {
    label: 'Career',
    description: 'Work, profession, and professional context.',
    icon: BriefcaseBusiness,
  },
  goals: {
    label: 'Goals',
    description: 'Current ambitions and future direction.',
    icon: Target,
  },
  location: {
    label: 'Location',
    description: 'Places connected to the user.',
    icon: MapPin,
  },
  pets: {
    label: 'Pets',
    description: 'Animal companions and related details.',
    icon: PawPrint,
  },
  relationships: {
    label: 'Relationships',
    description: 'Important people and relationships.',
    icon: Heart,
  },
  lifestyle: {
    label: 'Lifestyle',
    description: 'Habits, routines, and everyday patterns.',
    icon: Sparkles,
  },
  other: {
    label: 'Other',
    description: 'Memories that do not yet have a category.',
    icon: Brain,
  },
};

function formatMemoryKey(key: string) {
  return key
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function normalizeCategory(
  category: string,
): MemoryCategory {
  return categoryOrder.includes(
    category as MemoryCategory,
  )
    ? (category as MemoryCategory)
    : 'other';
}

export default async function MemoryPage() {
  const user = await requireUser();

  const memories = await db.memory.findMany({
    where: {
      userId: user.id,
    },
    include: {
      character: true,
    },
    orderBy: [
      {
        importance: 'desc',
      },
      {
        updatedAt: 'desc',
      },
    ],
  });

  const memoriesByCategory = new Map<
    string,
    typeof memories
  >();

  for (const memory of memories) {
    const category = normalizeCategory(memory.category);
    const existing = memoriesByCategory.get(category) ?? [];

    memoriesByCategory.set(category, [
      ...existing,
      memory,
    ]);
  }

  const populatedCategories = categoryOrder.filter(
    (category) =>
      (memoriesByCategory.get(category)?.length ?? 0) >
      0,
  );

  return (
    <div className="max-w-6xl">
      <Link
        href="/settings"
        className="inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Back to settings
      </Link>

      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-200/70">
            <Brain className="size-4" />
            Memory Center
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
            What Aphrodite remembers
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
            Review, correct, or remove the facts your
            companions use to personalize future
            conversations.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="min-w-32 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-white/35">
              Categories
            </p>

            <p className="mt-1 text-2xl font-semibold text-white">
              {populatedCategories.length}
            </p>
          </div>

          <div className="min-w-32 rounded-2xl border border-fuchsia-200/15 bg-fuchsia-300/[0.07] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-fuchsia-100/55">
              Memories
            </p>

            <p className="mt-1 text-2xl font-semibold text-white">
              {memories.length}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-10">
        {memories.length > 0 ? (
          <div className="space-y-10">
            {populatedCategories.map((category) => {
              const config = categoryConfig[category];
              const CategoryIcon = config.icon;
              const categoryMemories =
                memoriesByCategory.get(category) ?? [];

              return (
                <section key={category}>
                  <div className="mb-4 flex items-start justify-between gap-5">
                    <div className="flex items-start gap-3">
                      <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-fuchsia-200/10 bg-fuchsia-300/[0.08] text-fuchsia-100">
                        <CategoryIcon className="size-5" />
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold text-white">
                          {config.label}
                        </h2>

                        <p className="mt-1 text-sm text-white/35">
                          {config.description}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-white/40">
                      {categoryMemories.length}{' '}
                      {categoryMemories.length === 1
                        ? 'memory'
                        : 'memories'}
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {categoryMemories.map((memory) => {
                      const memoryLabel =
                        formatMemoryKey(memory.key);

                      return (
                        <article
                          key={memory.id}
                          className="flex min-h-[300px] flex-col rounded-[24px] border border-white/[0.09] bg-white/[0.035] p-5 transition hover:border-fuchsia-200/20 hover:bg-white/[0.05]"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="grid size-10 place-items-center rounded-2xl bg-white/[0.045] text-white/55 ring-1 ring-white/10">
                              <Sparkles className="size-4" />
                            </div>

                            <span className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                              Importance{' '}
                              {memory.importance}
                            </span>
                          </div>

                          <div className="flex-1">
                            <h3 className="mt-5 text-sm font-semibold text-white">
                              {memoryLabel}
                            </h3>

                            <p className="mt-2 break-words text-base leading-7 text-white/75">
                              {memory.value}
                            </p>

                            <EditMemoryButton
                              memoryId={memory.id}
                              initialValue={memory.value}
                              initialImportance={
                                memory.importance
                              }
                            />
                          </div>

                          <div className="mt-5 border-t border-white/[0.08] pt-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                              <div className="min-w-0">
                                <p className="text-[11px] uppercase tracking-[0.14em] text-white/25">
                                  Remembered by
                                </p>

                                <p className="mt-1 truncate text-sm text-white/45">
                                  {
                                    memory.character
                                      .name
                                  }
                                </p>
                              </div>

                              <DeleteMemoryButton
                                memoryId={memory.id}
                                memoryLabel={
                                  memoryLabel
                                }
                              />
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-fuchsia-300/[0.08] text-fuchsia-100">
              <Brain className="size-6" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              No saved memories yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
              When you share useful facts during a
              conversation, they can appear here for
              review.
            </p>

            <Link
              href="/explore"
              className="mt-6 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100"
            >
              Start a conversation
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
