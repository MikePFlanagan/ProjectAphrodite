'use client';

import type {
  FormEvent,
  KeyboardEvent,
  RefObject,
} from 'react';
import { useEffect } from 'react';
import {
  LoaderCircle,
  Send,
  Sparkles,
} from 'lucide-react';

const MAX_MESSAGE_LENGTH = 8_000;
const MAX_TEXTAREA_HEIGHT = 220;

type ChatComposerProps = {
  characterName: string;
  content: string;
  isStreaming: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onContentChange: (content: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ChatComposer({
  characterName,
  content,
  isStreaming,
  textareaRef,
  onContentChange,
  onSubmit,
}: ChatComposerProps) {
  const remainingCharacters =
    MAX_MESSAGE_LENGTH - content.length;

  const isNearLimit = remainingCharacters <= 500;
  const isAtLimit = remainingCharacters === 0;
  const canSubmit =
    content.trim().length > 0 && !isStreaming;

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';

    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      MAX_TEXTAREA_HEIGHT,
    )}px`;

    textarea.style.overflowY =
      textarea.scrollHeight > MAX_TEXTAREA_HEIGHT
        ? 'auto'
        : 'hidden';
  }, [content, textareaRef]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="group relative overflow-hidden rounded-[26px] border border-white/[0.1] bg-white/[0.045] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.28)] transition duration-200 focus-within:border-fuchsia-200/30 focus-within:bg-white/[0.055] focus-within:shadow-[0_20px_70px_rgba(217,70,239,0.08)]"
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-200/20 to-transparent opacity-0 transition group-focus-within:opacity-100" />

      <label
        htmlFor="chat-message"
        className="sr-only"
      >
        Message {characterName}
      </label>

      <textarea
        id="chat-message"
        ref={textareaRef}
        value={content}
        onChange={(event) =>
          onContentChange(event.target.value)
        }
        onKeyDown={handleKeyDown}
        disabled={isStreaming}
        maxLength={MAX_MESSAGE_LENGTH}
        rows={1}
        placeholder={`Message ${characterName}…`}
        aria-describedby="chat-composer-help chat-character-count"
        className="min-h-14 max-h-[220px] w-full resize-none overflow-hidden bg-transparent px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/30 disabled:cursor-not-allowed disabled:opacity-55"
      />

      <div className="flex items-end justify-between gap-3 px-2 pb-1 pt-1">
        <div className="min-w-0">
          <div
            id="chat-composer-help"
            className="flex items-center gap-2 text-[11px] text-white/25 sm:text-xs"
          >
            <Sparkles className="hidden size-3.5 shrink-0 sm:block" />

            <span className="hidden sm:inline">
              Enter to send · Shift + Enter for a new line
            </span>

            <span className="sm:hidden">
              Enter to send
            </span>
          </div>

          <p
            id="chat-character-count"
            aria-live="polite"
            className={`mt-1 text-[10px] transition ${
              isAtLimit
                ? 'text-rose-300'
                : isNearLimit
                  ? 'text-amber-200/80'
                  : 'text-white/20'
            }`}
          >
            {content.length.toLocaleString()} /{' '}
            {MAX_MESSAGE_LENGTH.toLocaleString()}
          </p>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          aria-label={
            isStreaming
              ? 'Generating response'
              : 'Send message'
          }
          className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-[#170d20] shadow-[0_8px_24px_rgba(255,255,255,0.08)] transition duration-200 hover:-translate-y-0.5 hover:bg-fuchsia-100 hover:shadow-[0_12px_30px_rgba(217,70,239,0.18)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0 disabled:hover:bg-white disabled:hover:shadow-none"
        >
          {isStreaming ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Send className="size-4 transition-transform group-focus-within:translate-x-0.5" />
          )}
        </button>
      </div>
    </form>
  );
}