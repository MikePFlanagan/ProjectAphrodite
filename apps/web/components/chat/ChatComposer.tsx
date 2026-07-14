'use client';

import type {
  FormEvent,
  KeyboardEvent,
  RefObject,
} from 'react';
import {
  LoaderCircle,
  Send,
  Sparkles,
} from 'lucide-react';

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
      className="rounded-[26px] border border-white/[0.1] bg-white/[0.045] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.28)] transition focus-within:border-fuchsia-200/25"
    >
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(event) =>
          onContentChange(event.target.value)
        }
        onKeyDown={handleKeyDown}
        disabled={isStreaming}
        maxLength={8_000}
        rows={2}
        placeholder={`Message ${characterName}…`}
        className="min-h-20 w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 text-white outline-none placeholder:text-white/30 disabled:opacity-60"
      />

      <div className="flex items-center justify-between gap-3 px-2 pb-1">
        <div className="flex items-center gap-2 text-xs text-white/25">
          <Sparkles className="size-3.5" />
          Enter to send · Shift + Enter for a new line
        </div>

        <button
          type="submit"
          disabled={isStreaming || !content.trim()}
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
  );
}
