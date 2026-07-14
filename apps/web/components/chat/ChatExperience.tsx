'use client';

import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AlertCircle,
  Bot,
  LoaderCircle,
} from 'lucide-react';

import { ChatComposer } from './ChatComposer';

type ChatMessage = {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
};

type ChatExperienceProps = {
  conversationId: string;
  characterName: string;
  initialMessages: ChatMessage[];
};
import { MessageContent } from './MessageContent';
export function ChatExperience({
  conversationId,
  characterName,
  initialMessages,
}: ChatExperienceProps) {
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);
  const [content, setContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || isStreaming) {
      return;
    }

    setError(null);
    setContent('');
    setIsStreaming(true);

    const userMessage: ChatMessage = {
      id: `user-${crypto.randomUUID()}`,
      role: 'USER',
      content: trimmedContent,
    };

    const assistantMessageId =
      `assistant-${crypto.randomUUID()}`;

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      {
        id: assistantMessageId,
        role: 'ASSISTANT',
        content: '',
      },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          content: trimmedContent,
        }),
      });

      if (!response.ok) {
        const responseBody = (await response
          .json()
          .catch(() => null)) as
          | { error?: string }
          | null;

        throw new Error(
          responseBody?.error ??
            'Unable to generate a response.',
        );
      }

      if (!response.body) {
        throw new Error(
          'The server returned no response stream.',
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        assistantContent += decoder.decode(value, {
          stream: true,
        });

        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessageId
              ? {
                  ...message,
                  content: assistantContent,
                }
              : message,
          ),
        );
      }

      assistantContent += decoder.decode();

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: assistantContent,
              }
            : message,
        ),
      );
    } catch (caughtError) {
      setMessages((currentMessages) =>
        currentMessages.filter(
          (message) =>
            message.id !== assistantMessageId,
        ),
      );

      setContent(trimmedContent);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Something went wrong.',
      );
    } finally {
      setIsStreaming(false);
      textareaRef.current?.focus();
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-15rem)] flex-col">
      <div className="flex-1 space-y-6 pb-10">
        {messages.map((message) => {
          if (message.role === 'SYSTEM') {
            return null;
          }

          const isUser = message.role === 'USER';

          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                isUser
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              {!isUser ? (
                <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-400/25 to-violet-500/20 text-fuchsia-100 ring-1 ring-white/10">
                  <Bot className="size-4" />
                </div>
              ) : null}

              <div
                className={`max-w-[85%] rounded-[24px] px-5 py-4 text-sm leading-7 sm:max-w-2xl ${
                  isUser
                    ? 'rounded-br-lg bg-white text-[#170d20]'
                    : 'rounded-bl-lg border border-white/[0.09] bg-white/[0.045] text-white/78'
                }`}
              >
               {message.content ? (
  <MessageContent
    content={message.content}
    isUser={isUser}
  />
) : isStreaming ? (
                  <span className="flex items-center gap-2 text-white/40">
                    <LoaderCircle className="size-4 animate-spin" />
                    {characterName} is thinking…
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 border-t border-white/[0.08] bg-[#09070d]/90 pt-5 backdrop-blur-xl">
        {error ? (
          <div className="mb-3 flex items-center gap-2 rounded-2xl border border-rose-300/20 bg-rose-300/[0.08] px-4 py-3 text-sm text-rose-100">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        ) : null}

        <ChatComposer
          characterName={characterName}
          content={content}
          isStreaming={isStreaming}
          textareaRef={textareaRef}
          onContentChange={setContent}
          onSubmit={handleSubmit}
        />

        <p className="py-3 text-center text-[11px] text-white/20">
          AI responses may be inaccurate. Do not rely on them
          for medical, legal, financial, or emergency advice.
        </p>
      </div>
    </div>
  );
}