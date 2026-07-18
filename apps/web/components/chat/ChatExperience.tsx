'use client';

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { AlertCircle, Bot, LoaderCircle, Send, Sparkles } from 'lucide-react';

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

type ChatUsageInfo = {
  plan: string;
  used?: number;
  limit: number;
  remaining: number;
  resetsAt: string;
};

export function ChatExperience({
  conversationId,
  characterName,
  initialMessages,
}: ChatExperienceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [content, setContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<ChatUsageInfo | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    const assistantMessageId = `assistant-${crypto.randomUUID()}`;

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      {
        id: assistantMessageId,
        role: 'ASSISTANT',
        content: '',
      },
    ]);

    let messagePersisted = false;

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
        const responseBody = (await response.json().catch(() => null)) as {
          error?: string;
          messagePersisted?: boolean;
          usage?: ChatUsageInfo;
        } | null;

        messagePersisted = responseBody?.messagePersisted ?? false;
        if (responseBody?.usage) setUsage(responseBody.usage);

        throw new Error(responseBody?.error ?? 'Unable to generate a response.');
      }

      const limit = Number(response.headers.get('X-Chat-Limit'));
      const remaining = Number(response.headers.get('X-Chat-Remaining'));
      const resetsAt = response.headers.get('X-Chat-Resets-At');
      const plan = response.headers.get('X-Chat-Plan');
      if (Number.isFinite(limit) && Number.isFinite(remaining) && resetsAt && plan) {
        setUsage({ plan, limit, remaining, resetsAt });
      }

      if (!response.body) {
        throw new Error('The server returned no response stream.');
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
            message.id !== assistantMessageId &&
            (messagePersisted || message.id !== userMessage.id),
        ),
      );

      if (!messagePersisted) setContent(trimmedContent);

      setError(caughtError instanceof Error ? caughtError.message : 'Something went wrong.');
    } finally {
      setIsStreaming(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
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
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
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
                    : 'text-white/78 rounded-bl-lg border border-white/[0.09] bg-white/[0.045]'
                }`}
              >
                {message.content ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
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

        <form
          onSubmit={handleSubmit}
          className="rounded-[26px] border border-white/[0.1] bg-white/[0.045] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.28)] transition focus-within:border-fuchsia-200/25"
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming || usage?.remaining === 0}
            maxLength={8_000}
            rows={2}
            placeholder={
              usage?.remaining === 0 ? 'Daily message limit reached' : `Message ${characterName}…`
            }
            className="min-h-20 w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 text-white outline-none placeholder:text-white/30 disabled:opacity-60"
          />

          <div className="flex items-center justify-between gap-3 px-2 pb-1">
            <div className="flex items-center gap-2 text-xs text-white/25">
              <Sparkles className="size-3.5" />
              {usage
                ? `${usage.remaining} of ${usage.limit} messages remaining today`
                : 'Enter to send · Shift + Enter for a new line'}
            </div>

            <button
              type="submit"
              disabled={isStreaming || usage?.remaining === 0 || !content.trim()}
              aria-label="Send message"
              className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-[#170d20] transition hover:bg-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {isStreaming ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </button>
          </div>
        </form>

        <p className="py-3 text-center text-[11px] text-white/20">
          AI responses may be inaccurate. Do not rely on them for medical, legal, financial, or
          emergency advice.
        </p>
      </div>
    </div>
  );
}
