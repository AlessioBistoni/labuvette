import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
};

export function MarkdownBody({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: (p) => (
          <h1 className="mb-4 mt-10 text-left text-3xl" {...p} />
        ),
        h2: (p) => (
          <h2
            className="mb-3 mt-8 text-left text-2xl font-bold leading-snug text-[var(--ink)]"
            {...p}
          />
        ),
        h3: (p) => (
          <h3
            className="mb-2 mt-6 text-left text-lg font-bold leading-snug text-[var(--ink-soft)]"
            {...p}
          />
        ),
        p: (p) => (
          <p
            className="mb-4 text-lg leading-relaxed text-[var(--ink)]"
            {...p}
          />
        ),
        a: ({ href, children, ...rest }) => (
          <a
            href={href}
            className="text-[var(--ink)] underline decoration-[var(--ink)]/25 underline-offset-4 hover:decoration-[var(--ink)]"
            {...rest}
          >
            {children}
          </a>
        ),
        ul: (p) => (
          <ul
            className="my-4 list-disc space-y-2 pl-6 text-lg text-[var(--ink)]"
            {...p}
          />
        ),
        ol: (p) => (
          <ol
            className="my-4 list-decimal space-y-2 pl-6 text-lg text-[var(--ink)]"
            {...p}
          />
        ),
        li: (p) => <li className="leading-relaxed pl-1" {...p} />,
        strong: (p) => (
          <strong className="font-bold text-[var(--ink)]" {...p} />
        ),
        em: (p) => <em className="italic text-[var(--ink-soft)]" {...p} />,
        blockquote: (p) => (
          <blockquote
            className="my-6 border-l border-[var(--ink)]/25 pl-5 text-lg italic text-[var(--ink-soft)]"
            {...p}
          />
        ),
        hr: () => <hr className="my-10 border-t border-[var(--line)]" />,
        code: ({ className, children, ...rest }) => {
          const inline = !className;
          if (inline) {
            return (
              <code
                className="rounded bg-[var(--cream-dark)] px-1.5 py-0.5 text-[0.9em] text-[var(--ink)]"
                {...rest}
              >
                {children}
              </code>
            );
          }
          return (
            <code
              className={`block overflow-x-auto rounded-lg bg-[var(--cream-dark)] p-4 text-sm text-[var(--ink)] ${className ?? ""}`}
              {...rest}
            >
              {children}
            </code>
          );
        },
        pre: (p) => <pre className="my-6 overflow-x-auto rounded-lg" {...p} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
