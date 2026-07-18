import Link from 'next/link';
import { MessageCircle, Search, Sparkles } from 'lucide-react';

import { db } from '@aphrodite/database';

import { requireUser } from '@/lib/require-auth';

export default async function ConversationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await requireUser();
  const query = ((await searchParams).q ?? '').trim().slice(0, 100);

  const conversations = await db.conversation.findMany({
    where: {
      userId: user.id,
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' as const } },
              { summary: { contains: query, mode: 'insensitive' as const } },
              { character: { name: { contains: query, mode: 'insensitive' as const } } },
              {
                messages: {
                  some: { content: { contains: query, mode: 'insensitive' as const } },
                },
              },
            ],
          }
        : {}),
    },
    include: {
      character: true,
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { lastMessageAt: 'desc' },
    take: 50,
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-200/70">
        <MessageCircle className="size-3.5" />
        Conversation history
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
        Return to what mattered.
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
        Search companion names, summaries, and the text of your private conversations.
      </p>

      <form
        method="GET"
        className="mt-7 flex gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-3"
      >
        <label className="flex min-w-0 flex-1 items-center gap-3">
          <Search className="ml-2 size-4 shrink-0 text-white/30" />
          <span className="sr-only">Search conversations</span>
          <input
            name="q"
            defaultValue={query}
            maxLength={100}
            placeholder="Search conversations…"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/25"
          />
        </label>
        <button
          type="submit"
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#170d20] transition hover:bg-fuchsia-100"
        >
          Search
        </button>
      </form>

      <div className="mt-7 flex items-center justify-between gap-4">
        <p className="text-xs text-white/35">
          {query
            ? `${conversations.length} result${conversations.length === 1 ? '' : 's'} for “${query}”`
            : `${conversations.length} recent conversation${conversations.length === 1 ? '' : 's'}`}
        </p>
        {query ? (
          <Link href="/conversations" className="text-xs text-fuchsia-200/65 hover:text-white">
            Clear search
          </Link>
        ) : null}
      </div>

      {conversations.length ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/chat/${conversation.id}`}
              className="group rounded-3xl border border-white/[0.09] bg-white/[0.035] p-5 transition hover:-translate-y-0.5 hover:border-fuchsia-200/20 hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-400/25 to-violet-500/20 font-semibold text-fuchsia-100">
                  {conversation.character.name.slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-white">
                    {conversation.character.name}
                  </h2>
                  <p className="mt-1 text-xs text-white/30">
                    {conversation.lastMessageAt.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <p className="text-white/48 mt-4 line-clamp-3 text-sm leading-6">
                {conversation.messages[0]?.content ??
                  conversation.summary ??
                  conversation.character.greeting}
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs text-fuchsia-200/60">
                <Sparkles className="size-3.5" /> Continue conversation
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
          <Search className="mx-auto size-5 text-white/25" />
          <h2 className="mt-4 font-semibold text-white">
            {query ? 'No matching conversations' : 'No conversations yet'}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
            {query
              ? 'Try a companion name, a topic, or a phrase you remember.'
              : 'Explore a companion and begin with a first hello.'}
          </p>
        </div>
      )}
    </div>
  );
}
