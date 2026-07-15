import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  Brain,
  Heart,
  HeartHandshake,
  Lightbulb,
  MessageCircleHeart,
  PartyPopper,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

import { db } from '@aphrodite/database';

import {
  RelationshipCard,
  type RelationshipCardTone,
} from '@/components/relationship/RelationshipCard';
import { requireUser } from '@/lib/require-auth';

type RelationshipScore = {
  key:
    | 'trust'
    | 'comfort'
    | 'curiosity'
    | 'playfulness'
    | 'affection'
    | 'respect';
  label: string;
  description: string;
  score: number;
  icon: LucideIcon;
  tone: RelationshipCardTone;
};

function getScoreLevel(score: number): string {
  if (score >= 90) {
    return 'Exceptional';
  }

  if (score >= 75) {
    return 'Strong';
  }

  if (score >= 60) {
    return 'Growing';
  }

  if (score >= 40) {
    return 'Developing';
  }

  if (score >= 20) {
    return 'Early';
  }

  return 'New';
}

function getRelationshipSummary(
  scores: RelationshipScore[],
): string {
  const strongest = [...scores].sort(
    (left, right) => right.score - left.score,
  )[0];

  const average =
    scores.reduce(
      (total, current) => total + current.score,
      0,
    ) / scores.length;

  if (!strongest) {
    return 'Your relationship is beginning to take shape.';
  }

  if (average >= 80) {
    return `This relationship has developed into a deeply established connection. ${strongest.label} is currently its strongest dimension.`;
  }

  if (average >= 65) {
    return `Your conversations are building a strong and increasingly natural connection. ${strongest.label} is currently leading the relationship.`;
  }

  if (average >= 50) {
    return `Your relationship is steadily developing through continued conversation. ${strongest.label} is currently its strongest dimension.`;
  }

  return `This relationship is still new. Continued conversations will gradually shape trust, comfort, and familiarity.`;
}

export default async function RelationshipPage() {
  const user = await requireUser();

  const relationships = await db.relationship.findMany({
    where: {
      userId: user.id,
    },
    include: {
      character: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <div className="max-w-6xl">
      <Link
        href="/settings"
        className="inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Back to settings
      </Link>

      <div className="mt-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-200/70">
          <MessageCircleHeart className="size-4" />
          Relationship Center
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
          Growing together
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
          Every companion develops a separate relationship with you.
          Conversations gradually influence trust, comfort, curiosity,
          playfulness, affection, and respect.
        </p>
      </div>

      {relationships.length > 0 ? (
        <div className="mt-10 space-y-8">
          {relationships.map((relationship) => {
            const scores: RelationshipScore[] = [
              {
                key: 'trust',
                label: 'Trust',
                description:
                  'Openness, honesty, and confidence in the connection.',
                score: relationship.trust,
                icon: ShieldCheck,
                tone: 'blue',
              },
              {
                key: 'comfort',
                label: 'Comfort',
                description:
                  'How natural, relaxed, and safe conversations feel.',
                score: relationship.comfort,
                icon: HeartHandshake,
                tone: 'emerald',
              },
              {
                key: 'curiosity',
                label: 'Curiosity',
                description:
                  'Interest in learning, exploring, and understanding more.',
                score: relationship.curiosity,
                icon: Lightbulb,
                tone: 'violet',
              },
              {
                key: 'playfulness',
                label: 'Playfulness',
                description:
                  'Humor, lightness, creativity, and shared fun.',
                score: relationship.playfulness,
                icon: PartyPopper,
                tone: 'amber',
              },
              {
                key: 'affection',
                label: 'Affection',
                description:
                  'Warmth, appreciation, and emotional closeness.',
                score: relationship.affection,
                icon: Heart,
                tone: 'rose',
              },
              {
                key: 'respect',
                label: 'Respect',
                description:
                  'Attentiveness, boundaries, and mutual appreciation.',
                score: relationship.respect,
                icon: BadgeCheck,
                tone: 'gold',
              },
            ];

            const averageScore = Math.round(
              scores.reduce(
                (total, current) =>
                  total + current.score,
                0,
              ) / scores.length,
            );

            return (
              <section
                key={relationship.id}
                className="overflow-hidden rounded-[30px] border border-white/[0.09] bg-white/[0.03]"
              >
                <div className="border-b border-white/[0.08] bg-gradient-to-br from-fuchsia-300/[0.09] via-violet-400/[0.035] to-transparent p-6 sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="grid size-14 place-items-center rounded-2xl border border-fuchsia-200/15 bg-fuchsia-300/[0.1] text-fuchsia-100 shadow-[0_0_30px_rgba(217,70,239,0.12)]">
                        <Heart className="size-6" />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fuchsia-100/50">
                          Companion relationship
                        </p>

                        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                          {relationship.character.name}
                        </h2>

                        <p className="mt-1 text-sm text-white/40">
                          {relationship.character.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                          Overall
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-white">
                          {averageScore}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                          Level
                        </p>

                        <p className="mt-1 text-sm font-semibold text-fuchsia-100">
                          {getScoreLevel(
                            averageScore,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/[0.08] bg-black/15 p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 size-4 shrink-0 text-fuchsia-200" />

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/35">
                          Current relationship
                        </p>

                        <p className="mt-2 text-sm leading-6 text-white/60">
                          {getRelationshipSummary(
                            scores,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3 sm:p-8">
                  {scores.map((item) => (
                    <RelationshipCard
                      key={item.key}
                      title={item.label}
                      score={item.score}
                      description={item.description}
                      icon={item.icon}
                      tone={item.tone}
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-3 border-t border-white/[0.08] px-6 py-5 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-3.5" />
                    Scores evolve gradually through conversation.
                  </div>

                  <time
                    dateTime={relationship.updatedAt.toISOString()}
                  >
                    Updated{' '}
                    {relationship.updatedAt.toLocaleString(
                      'en-US',
                      {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      },
                    )}
                  </time>
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="mt-10 rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-fuchsia-300/[0.08] text-fuchsia-100">
            <Brain className="size-6" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-white">
            No relationships yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
            Start a conversation with a companion and your relationship
            will begin developing automatically.
          </p>

          <Link
            href="/explore"
            className="mt-6 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#160d1e] transition hover:bg-fuchsia-100"
          >
            Find a companion
          </Link>
        </div>
      )}

      <section className="mt-8 rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-fuchsia-200" />

          <div>
            <h2 className="text-sm font-semibold text-white">
              About relationship scores
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
              These scores provide transparent guidance for companion
              behavior. They are not judgments about you, and they should
              evolve gradually rather than changing dramatically after one
              message.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
