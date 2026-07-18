import { streamText } from 'ai';
import { z } from 'zod';

import { buildCharacterSystemPrompt, getOpenAIModel } from '@aphrodite/ai';
import { db } from '@aphrodite/database';

import { auth } from '@/auth';
import {
  dailyMessageLimit,
  effectivePlan,
  estimatedCostMicros,
  utcDayWindow,
} from '@/lib/chat-usage';

export const runtime = 'nodejs';

const chatRequestSchema = z.object({
  conversationId: z.string().cuid(),
  content: z.string().trim().min(1).max(8_000),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(requestBody);

  if (!parsed.success) {
    return Response.json(
      {
        error: 'Invalid request',
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const { conversationId, content } = parsed.data;

  const [conversation, subscription] = await Promise.all([
    db.conversation.findFirst({
      where: {
        id: conversationId,
        userId: session.user.id,
      },
      include: {
        character: true,
        messages: {
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
          take: 40,
        },
      },
    }),
    db.subscription.findUnique({
      where: { userId: session.user.id },
      select: { plan: true, status: true },
    }),
  ]);

  if (!conversation) {
    return Response.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const plan = effectivePlan(subscription);
  const limit = dailyMessageLimit(plan);
  const { start, resetsAt } = utcDayWindow();
  const used = await db.message.count({
    where: {
      role: 'USER',
      createdAt: { gte: start },
      conversation: { userId: session.user.id },
    },
  });

  if (used >= limit) {
    return Response.json(
      {
        error: `You have reached your ${plan.toLowerCase()} plan's daily message limit.`,
        code: 'CHAT_DAILY_LIMIT',
        messagePersisted: false,
        usage: { plan, used, limit, remaining: 0, resetsAt: resetsAt.toISOString() },
      },
      { status: 429 },
    );
  }

  await db.$transaction([
    db.message.create({
      data: {
        conversationId,
        role: 'USER',
        content,
      },
    }),
    db.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
      },
    }),
  ]);

  try {
    const modelName = process.env.OPENAI_MODEL ?? 'gpt-5-mini';
    const result = streamText({
      model: getOpenAIModel(modelName),
      system: buildCharacterSystemPrompt({
        name: conversation.character.name,
        tagline: conversation.character.tagline,
        description: conversation.character.description,
        personalityPrompt: conversation.character.personalityPrompt,
      }),
      messages: [
        ...[...conversation.messages].reverse().map((message) => ({
          role:
            message.role === 'USER'
              ? ('user' as const)
              : message.role === 'ASSISTANT'
                ? ('assistant' as const)
                : ('system' as const),
          content: message.content,
        })),
        {
          role: 'user' as const,
          content,
        },
      ],
      maxOutputTokens: 700,
      onFinish: async ({ text, usage }) => {
        const assistantText = text.trim();

        if (!assistantText) {
          return;
        }

        const inputTokens = usage.inputTokens ?? 0;
        const outputTokens = usage.outputTokens ?? 0;
        const totalTokens = usage.totalTokens ?? inputTokens + outputTokens;

        await db.$transaction([
          db.message.create({
            data: {
              conversationId,
              role: 'ASSISTANT',
              content: assistantText,
            },
          }),
          db.conversation.update({
            where: {
              id: conversationId,
            },
            data: {
              lastMessageAt: new Date(),
            },
          }),
          db.chatUsage.create({
            data: {
              userId: session.user.id,
              conversationId,
              model: modelName,
              inputTokens,
              outputTokens,
              totalTokens,
              estimatedCostMicros: estimatedCostMicros(inputTokens, outputTokens),
            },
          }),
        ]);
      },
    });

    return result.toTextStreamResponse({
      headers: {
        'X-Message-Persisted': 'true',
        'X-Chat-Plan': plan,
        'X-Chat-Limit': String(limit),
        'X-Chat-Remaining': String(Math.max(0, limit - used - 1)),
        'X-Chat-Resets-At': resetsAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Chat generation failed:', error);

    return Response.json(
      {
        error: 'Your message was saved, but the response provider is temporarily unavailable.',
        code: 'CHAT_PROVIDER_ERROR',
        messagePersisted: true,
      },
      { status: 502 },
    );
  }
}
