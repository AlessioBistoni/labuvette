import { MarkdownBody } from "@/components/markdown-body";
import {
  isHtmlContent,
  sanitizeArticleHtml,
} from "@/lib/sanitize-html";

const articleProseClass =
  "article-body w-full min-w-0 max-w-full break-words text-left [overflow-wrap:anywhere] font-serif text-lg leading-[1.75] text-[var(--ink)] [&_*]:max-w-full [&_*]:break-words [&_*]:whitespace-normal [&_a]:text-[var(--ink)] [&_a]:underline [&_a]:decoration-[var(--ink)]/25 [&_a]:underline-offset-4 hover:[&_a]:decoration-[var(--ink)] [&_blockquote]:my-6 [&_blockquote]:border-l [&_blockquote]:border-[var(--ink)]/25 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-[var(--ink-soft)] [&_em]:italic [&_em]:text-[var(--ink-soft)] [&_h1]:mb-4 [&_h1]:mt-10 [&_h1]:text-left [&_h1]:font-serif [&_h1]:text-3xl [&_h1]:font-medium [&_h1]:leading-tight [&_h1]:tracking-tight [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-left [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:leading-snug [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-left [&_h3]:font-sans [&_h3]:text-lg [&_h3]:font-medium [&_h3]:leading-snug [&_h3]:text-[var(--ink-soft)] [&_li]:leading-[1.75] [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:mb-4 [&_p]:text-left [&_span]:leading-[1.75] [&_strong]:font-semibold [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6";

type Props = {
  content: string;
};

export function ArticleBody({ content }: Props) {
  if (isHtmlContent(content)) {
    const html = sanitizeArticleHtml(content);
    return (
      <div
        className={articleProseClass}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className={articleProseClass}>
      <MarkdownBody content={content} />
    </div>
  );
}
