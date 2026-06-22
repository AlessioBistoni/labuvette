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
          <h1
            className="font-serif text-3xl font-medium tracking-tight text-[var(--ink)] mt-10 mb-4"
            {...p}
          />
        ),
        h2: (p) => (
          <h2
            className="font-serif text-2xl font-medium text-[var(--ink)] mt-8 mb-3"
            {...p}
          />
        ),
        h3: (p) => (
          <h3
            className="font-sans text-lg font-medium text-[var(--ink-soft)] mt-6 mb-2"
            {...p}
          />
        ),
        p: (p) => (
          <p
            className="font-serif text-lg leading-relaxed text-[var(--ink)] mb-4"
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
            className="my-4 list-disc pl-6 font-serif text-lg text-[var(--ink)] space-y-2"
            {...p}
          />
        ),
        ol: (p) => (
          <ol
            className="my-4 list-decimal pl-6 font-serif text-lg text-[var(--ink)] space-y-2"
            {...p}
          />
        ),
        li: (p) => <li className="leading-relaxed pl-1" {...p} />,
        strong: (p) => (
          <strong className="font-semibold text-[var(--ink)]" {...p} />
        ),
        em: (p) => <em className="italic text-[var(--ink-soft)]" {...p} />,
        blockquote: (p) => (
          <blockquote
            className="border-l border-[var(--ink)]/25 pl-5 my-6 font-serif text-lg italic text-[var(--ink-soft)]"
            {...p}
          />
        ),
        hr: () => <hr className="my-10 border-t border-[var(--line)]" />,
        code: ({ className, children, ...rest }) => {
          const inline = !className;
          if (inline) {
            return (
              <code
                className="rounded bg-[var(--cream-dark)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--ink)]"
                {...rest}
              >
                {children}
              </code>
            );
          }
          return (
            <code
              className={`block overflow-x-auto rounded-lg bg-[var(--cream-dark)] p-4 font-mono text-sm text-[var(--ink)] ${className ?? ""}`}
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
