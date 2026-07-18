import Link from 'next/link';
import { ArrowRight, Compass, MessageCircle, Sparkles, Stars } from 'lucide-react';

import { db } from '@aphrodite/database';

import { CharacterGrid } from '@/components/characters/CharacterGrid';
import { EmptyState } from '@/components/characters/EmptyState';
import { dailyMessageLimit, effectivePlan } from '@/lib/chat-usage';
import { requireUser } from '@/lib/require-auth';

export default async function DashboardPage() {
  const user = await requireUser();

  const [featured, recent, conversations, subscription] = await Promise.all([
    db.character.findMany({
      where: {
        isPublished: true,
        isFeatured: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    }),
    db.character.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    }),
    db.conversation.findMany({
      where: {
        userId: user.id,
      },
      include: {
        character: true,
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
      take: 4,
    }),
    db.subscription.findUnique({
      where: {
        userId: user.id,
      },
    }),
  ]);

  const firstName = user.name?.split(' ')[0] ?? 'there';
  const plan = effectivePlan(subscription);

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-[32px] border border-white/[0.09] bg-gradient-to-br from-fuchsia-400/[0.14] via-violet-400/[0.07] to-transparent px-6 py-9 sm:px-9 sm:py-11">
        <div className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-fuchsia-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 size-56 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-100/65">
            <Sparkles className="size-3.5" />
            Your private AI universe
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.055em] text-white sm:text-5xl">
            Welcome back, {firstName}.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
            Continue a meaningful conversation, discover someone new, or create a companion shaped
            around what matters to you.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#170d20] transition hover:bg-fuchsia-100"
            >
              <Compass className="size-4" />
              Explore companions
            </Link>

            <Link
              href="/creator"
              className="border-white/12 inline-flex items-center gap-2 rounded-2xl border bg-white/[0.045] px-5 py-3 text-sm font-semibold text-white/75 backdrop-blur transition hover:bg-white/[0.09] hover:text-white"
            >
              <Stars className="size-4" />
              Create your own
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <SectionHeading eyebrow="RECENT ACTIVITY" title="Continue chatting" href="/explore" />

          <div className="mt-5">
            {conversations.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {conversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    href={`/chat/${conversation.id}`}
                    className="group rounded-3xl border border-white/[0.09] bg-white/[0.035] p-5 transition hover:-translate-y-0.5 hover:border-fuchsia-200/20 hover:bg-white/[0.065]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-400/25 to-violet-500/20 text-sm font-semibold text-fuchsia-100">
                        {conversation.character.name.slice(0, 1).toUpperCase()}
                      </div>

                      <ArrowRight className="size-4 text-white/20 transition group-hover:translate-x-1 group-hover:text-fuchsia-200" />
                    </div>

                    <p className="mt-5 font-medium text-white">{conversation.character.name}</p>

                    <p className="text-white/42 mt-2 line-clamp-2 text-sm leading-6">
                      {conversation.character.greeting}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-xs text-fuchsia-200/60">
                      <MessageCircle className="size-3.5" />
                      Continue conversation
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No conversations yet"
                copy="Explore a companion and begin with a first hello."
              />
            )}
          </div>
        </div>

        <aside className="rounded-[28px] border border-fuchsia-200/15 bg-gradient-to-br from-fuchsia-300/[0.11] to-white/[0.025] p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-100/65">
              Your plan
            </p>

            <Sparkles className="size-4 text-fuchsia-200/70" />
          </div>

          <p className="mt-7 text-3xl font-semibold tracking-[-0.05em] text-white">{plan}</p>

          <p className="mt-3 text-sm leading-6 text-white/45">
            {plan === 'FREE'
              ? 'Explore the platform and begin building your connection.'
              : subscription?.cancelAtPeriodEnd
                ? 'Premium stays active through the end of your paid period.'
                : 'Your subscription is active and ready.'}
          </p>

          <div className="mt-7 space-y-3 text-sm text-white/55">
            <div className="flex items-center gap-3">
              <span className="size-1.5 rounded-full bg-fuchsia-300" />
              {dailyMessageLimit(plan).toLocaleString()} messages each day
            </div>
            <div className="flex items-center gap-3">
              <span className="size-1.5 rounded-full bg-fuchsia-300" />
              Save conversation history
            </div>
            <div className="flex items-center gap-3">
              <span className="size-1.5 rounded-full bg-fuchsia-300" />
              Create favorites
            </div>
          </div>

          <Link
            href="/billing"
            className="mt-8 block rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-[#170d20] transition hover:bg-fuchsia-100"
          >
            {plan === 'FREE' ? 'Explore Premium' : 'Manage billing'}
          </Link>
        </aside>
      </section>

      <section>
        <SectionHeading eyebrow="CURATED FOR YOU" title="Featured companions" href="/explore" />

        <div className="mt-5">
          <CharacterGrid characters={featured} />
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="FRESH ARRIVALS" title="Recently added" href="/explore" />

        <div className="mt-5">
          <CharacterGrid characters={recent} />
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fuchsia-200/55">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-white">{title}</h2>
      </div>

      <Link
        href={href}
        className="flex items-center gap-1.5 text-sm text-fuchsia-200/65 transition hover:text-white"
      >
        View all
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
