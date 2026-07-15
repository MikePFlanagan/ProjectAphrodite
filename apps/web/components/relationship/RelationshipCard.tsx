import type { LucideIcon } from 'lucide-react';

export type RelationshipCardTone =
  | 'blue'
  | 'emerald'
  | 'violet'
  | 'amber'
  | 'rose'
  | 'gold';

type RelationshipCardProps = {
  title: string;
  score: number;
  description: string;
  icon: LucideIcon;
  tone: RelationshipCardTone;
};

const toneStyles: Record<
  RelationshipCardTone,
  {
    glow: string;
    icon: string;
    progress: string;
    status: string;
  }
> = {
  blue: {
    glow:
      'from-sky-400/[0.13] via-cyan-300/[0.035] to-transparent',
    icon:
      'border-sky-300/15 bg-sky-300/[0.09] text-sky-100',
    progress:
      'from-sky-400 via-cyan-300 to-blue-400 shadow-[0_0_18px_rgba(56,189,248,0.26)]',
    status: 'text-sky-100/75',
  },
  emerald: {
    glow:
      'from-emerald-400/[0.12] via-teal-300/[0.035] to-transparent',
    icon:
      'border-emerald-300/15 bg-emerald-300/[0.09] text-emerald-100',
    progress:
      'from-emerald-400 via-teal-300 to-cyan-400 shadow-[0_0_18px_rgba(52,211,153,0.24)]',
    status: 'text-emerald-100/75',
  },
  violet: {
    glow:
      'from-violet-400/[0.13] via-indigo-300/[0.035] to-transparent',
    icon:
      'border-violet-300/15 bg-violet-300/[0.09] text-violet-100',
    progress:
      'from-violet-400 via-fuchsia-300 to-indigo-400 shadow-[0_0_18px_rgba(167,139,250,0.25)]',
    status: 'text-violet-100/75',
  },
  amber: {
    glow:
      'from-orange-400/[0.12] via-amber-300/[0.035] to-transparent',
    icon:
      'border-orange-300/15 bg-orange-300/[0.09] text-orange-100',
    progress:
      'from-orange-400 via-amber-300 to-yellow-300 shadow-[0_0_18px_rgba(251,146,60,0.24)]',
    status: 'text-orange-100/75',
  },
  rose: {
    glow:
      'from-pink-400/[0.13] via-rose-300/[0.035] to-transparent',
    icon:
      'border-pink-300/15 bg-pink-300/[0.09] text-pink-100',
    progress:
      'from-pink-400 via-rose-300 to-fuchsia-400 shadow-[0_0_18px_rgba(244,114,182,0.25)]',
    status: 'text-pink-100/75',
  },
  gold: {
    glow:
      'from-amber-300/[0.13] via-yellow-200/[0.035] to-transparent',
    icon:
      'border-amber-200/15 bg-amber-200/[0.09] text-amber-100',
    progress:
      'from-amber-300 via-yellow-200 to-orange-300 shadow-[0_0_18px_rgba(252,211,77,0.24)]',
    status: 'text-amber-100/75',
  },
};

function getRelationshipStatus(score: number): string {
  if (score >= 100) {
    return 'Mastered connection';
  }

  if (score >= 90) {
    return 'Exceptional connection';
  }

  if (score >= 75) {
    return 'Strong connection';
  }

  if (score >= 60) {
    return 'Growing connection';
  }

  if (score >= 40) {
    return 'Developing connection';
  }

  if (score >= 20) {
    return 'Early connection';
  }

  return 'New connection';
}

export function RelationshipCard({
  title,
  score,
  description,
  icon: Icon,
  tone,
}: RelationshipCardProps) {
  const styles = toneStyles[tone];
  const safeScore = Math.max(
    0,
    Math.min(100, Math.round(score)),
  );

  return (
    <article className="group relative isolate min-h-[300px] overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#100c15]/85 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:shadow-[0_30px_90px_rgba(0,0,0,0.3)]">
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-20 bg-gradient-to-br ${styles.glow}`}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 grid place-items-center overflow-hidden"
      >
        <span className="translate-y-1 text-[108px] font-black tracking-[-0.1em] text-white/[0.055] transition duration-500 group-hover:scale-[1.04] group-hover:text-white/[0.075]">
          {safeScore}
        </span>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      <div className="relative flex min-h-[252px] flex-col">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`grid size-11 place-items-center rounded-2xl border ${styles.icon}`}
          >
            <Icon className="size-5" />
          </div>

          <span className="rounded-full border border-white/[0.09] bg-black/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35 backdrop-blur-md">
            {safeScore} / 100
          </span>
        </div>

        <div className="mt-auto pt-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/28">
            Relationship trait
          </p>

          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">
            {title}
          </h3>

          <p
            className={`mt-1 text-xs font-semibold uppercase tracking-[0.13em] ${styles.status}`}
          >
            {getRelationshipStatus(safeScore)}
          </p>

          <div className="mt-5 h-2.5 overflow-hidden rounded-full border border-white/[0.05] bg-black/25 p-[2px]">
            <div
              className={`h-full rounded-full bg-gradient-to-r transition-[width,filter] duration-700 group-hover:brightness-110 ${styles.progress}`}
              style={{
                width: `${safeScore}%`,
              }}
            />
          </div>

          <p className="mt-4 text-sm leading-6 text-white/42">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}
