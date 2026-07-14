import { streamText } from 'ai';
import { z } from 'zod';

import {
  buildCharacterSystemPrompt,
  createMockResponse,
  extractMockMemories,
  getOpenAIModel,
  type ChatContext,
} from '@aphrodite/ai';
import { db } from '@aphrodite/database';

import { auth } from '@/auth';

export const runtime = 'nodejs';

const chatRequestSchema = z.object({
  conversationId: z.string().cuid(),
  content: z.string().trim().min(1).max(8_000),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return Response.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
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

  const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId,
      userId: session.user.id,
    },
    include: {
      character: true,
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
        take: 40,
      },
    },
  });

  if (!conversation) {
    return Response.json(
      { error: 'Conversation not found' },
      { status: 404 },
    );
  }

  const memories = await db.memory.findMany({
    where: {
      userId: session.user.id,
      characterId: conversation.character.id,
    },
    orderBy: [
      {
        importance: 'desc',
      },
      {
        updatedAt: 'desc',
      },
    ],
    take: 20,
  });

  const chatContext: ChatContext = {
    user: {
      id: session.user.id,
      name: session.user.name?.trim() || 'friend',
      email: session.user.email,
      role: session.user.role,
    },
    character: {
      id: conversation.character.id,
      name: conversation.character.name,
      tagline: conversation.character.tagline,
      description: conversation.character.description,
      personalityPrompt:
        conversation.character.personalityPrompt,
    },
    conversation: {
      id: conversation.id,
    },
    memories: memories.map((memory) => ({
      id: memory.id,
      key: memory.key,
      value: memory.value,
      importance: memory.importance,
    })),
  };

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

  const aiProvider =
    process.env.AI_PROVIDER?.trim().toLowerCase() ??
    'mock';

  if (aiProvider === 'mock') {
    const memoryCandidates =
      extractMockMemories(content);

    const savedMemories = await Promise.all(
      memoryCandidates.map((memoryCandidate) =>
        saveOrUpdateMemory({
          userId: session.user.id,
          characterId: conversation.character.id,
          key: memoryCandidate.key,
          value: memoryCandidate.value,
          importance: memoryCandidate.importance,
        }),
      ),
    );

    const savedMemory =
      savedMemories.at(-1) ?? null;

    const mockText = createMockResponse({
      context: chatContext,
      userMessage: content,
      memorySaved: savedMemory
        ? {
            key: savedMemory.key,
            value: savedMemory.value,
          }
        : null,
    });

    await saveAssistantMessage({
      conversationId,
      content: mockText,
    });

    return createMockTextStream(mockText);
  }

  if (aiProvider !== 'openai') {
    return Response.json(
      {
        error: `Unsupported AI provider: ${aiProvider}`,
      },
      { status: 500 },
    );
  }

  try {
    const result = streamText({
      model: getOpenAIModel(),
      system: buildCharacterSystemPrompt(chatContext),
      messages: [
        ...conversation.messages.map((message) => ({
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
      onFinish: async ({ text }) => {
        const assistantText = text.trim();

        if (!assistantText) {
          return;
        }

        await saveAssistantMessage({
          conversationId,
          content: assistantText,
        });
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat generation failed:', error);

    return Response.json(
      { error: 'Unable to generate a response' },
      { status: 502 },
    );
  }
}

async function saveAssistantMessage({
  conversationId,
  content,
}: {
  conversationId: string;
  content: string;
}) {
  await db.$transaction([
    db.message.create({
      data: {
        conversationId,
        role: 'ASSISTANT',
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
}

async function saveOrUpdateMemory({
  userId,
  characterId,
  key,
  value,
  importance,
}: {
  userId: string;
  characterId: string;
  key: string;
  value: string;
  importance: number;
}) {
  return db.memory.upsert({
    where: {
      userId_characterId_key: {
        userId,
        characterId,
        key,
      },
    },
    update: {
      value,
      importance,
    },
    create: {
      userId,
      characterId,
      key,
      value,
      importance,
    },
  });
}

function createMockTextStream(text: string): Response {
  const encoder = new TextEncoder();
  const words = text.split(' ');

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const [index, word] of words.entries()) {
        const chunk =
          index === words.length - 1
            ? word
            : `${word} `;

        controller.enqueue(encoder.encode(chunk));

        await new Promise<void>((resolve) => {
          setTimeout(resolve, 35);
        });
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
