'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MessageContentProps = {
  content: string;
  isUser: boolean;
};

export function MessageContent({
  content,
  isUser,
}: MessageContentProps) {
  if (isUser) {
    return (
      <p className="whitespace-pre-wrap">
        {content}
      </p>
    );
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-3 mt-5 text-xl font-semibold first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-3 mt-5 text-lg font-semibold first:mt-0">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 mt-4 font-semibold first:mt-0">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="my-3 first:mt-0 last:mb-0">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="my-3 list-disc space-y-1 pl-6">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="my-3 list-decimal space-y-1 pl-6">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="pl-1">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-4 border-l-2 border-fuchsia-300/40 pl-4 text-white/60">
            {children}
          </blockquote>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-white">
            {children}
          </strong>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-fuchsia-200 underline decoration-fuchsia-200/30 underline-offset-4 transition hover:text-white"
          >
            {children}
          </a>
        ),
        code: ({ className, children, ...props }) => {
          const isBlock =
            className?.startsWith('language-');

          if (!isBlock) {
            return (
              <code
                className="rounded-md border border-white/10 bg-black/30 px-1.5 py-0.5 font-mono text-[0.9em] text-fuchsia-100"
                {...props}
              >
                {children}
              </code>
            );
          }

          return (
            <code
              className={`${className ?? ''} font-mono text-sm`}
              {...props}
            >
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="my-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-6">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="my-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-white/10 bg-white/[0.05] px-3 py-2 font-semibold text-white">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-white/10 px-3 py-2 text-white/65">
            {children}
          </td>
        ),
        hr: () => (
          <hr className="my-5 border-white/10" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
