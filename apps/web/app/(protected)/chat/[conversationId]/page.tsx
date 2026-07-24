import { MessageCircle, Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';

import { db } from '@aphrodite/database';
import { relationshipLabel } from '@aphrodite/ai';

import { CharacterAvatar } from '@/components/characters/CharacterAvatar';
import { ChatExperience } from '@/components/chat/ChatExperience';
import { requireUser } from '@/lib/require-auth';

export default async function ChatPage({
  params,
}: {
  params: Promise<{
    conversationId: string;
  }>;
}) {
  const user = await requireUser();
  const { conversationId } = await params;

  const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId,
      userId: user.id,
    },
    include: {
      character: true,
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  if (!conversation) {
    notFound();
  }

  const relationship = await db.relationship.findUnique({
    where: {
      userId_characterId: {
        userId: user.id,
        characterId: conversation.characterId,
      },
    },
  });
  const relationshipStatus = relationship
    ? relationshipLabel({
        trust: relationship.trust,
        comfort: relationship.comfort,
        curiosity: relationship.curiosity,
        playfulness: relationship.playfulness,
        affection: relationship.affection,
        respect: relationship.respect,
      })
    : 'New';

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8 flex items-center justify-between gap-5 rounded-[28px] border border-white/[0.09] bg-white/[0.035] p-5">
        <div className="flex min-w-0 items-center gap-4">
          <CharacterAvatar
            name={conversation.character.name}
            gradient={conversation.character.avatarUrl}
            size="sm"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-xl font-semibold tracking-tight text-white">
                {conversation.character.name}
              </h1>

              <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            </div>

            <p className="mt-1 truncate text-sm text-white/40">{conversation.character.tagline}</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-2xl border border-fuchsia-200/15 bg-fuchsia-300/[0.07] px-3 py-2 text-xs text-fuchsia-100/70 sm:flex">
          <Sparkles className="size-3.5" />
          {relationshipStatus} relationship
        </div>
      </header>

      <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/25">
        <MessageCircle className="size-3.5" />
        Private conversation
      </div>

      <ChatExperience
        conversationId={conversation.id}
        characterName={conversation.character.name}
        initialMessages={conversation.messages.map((message) => ({
          id: message.id,
          role: message.role,
          content: message.content,
        }))}
      />
    </div>
  );
}
