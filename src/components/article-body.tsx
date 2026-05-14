import { MarkdownBody } from "@/components/markdown-body";
import {
  isHtmlContent,
  sanitizeArticleHtml,
} from "@/lib/sanitize-html";

type Props = {
  content: string;
};

export function ArticleBody({ content }: Props) {
  if (isHtmlContent(content)) {
    const html = sanitizeArticleHtml(content);
    return (
      <div
        className="article-body font-serif text-lg leading-relaxed text-[var(--ink)] [&_a]:text-[var(--ink)] [&_a]:underline [&_a]:decoration-[var(--ink)]/25 [&_a]:underline-offset-4 hover:[&_a]:decoration-[var(--ink)] [&_blockquote]:my-6 [&_blockquote]:border-l [&_blockquote]:border-[var(--ink)]/25 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-[var(--ink-soft)] [&_em]:italic [&_em]:text-[var(--ink-soft)] [&_h1]:mb-4 [&_h1]:mt-10 [&_h1]:font-serif [&_h1]:text-3xl [&_h1]:font-medium [&_h1]:tracking-tight [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-medium [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-sans [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-[var(--ink-soft)] [&_li]:leading-relaxed [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:mb-4 [&_strong]:font-semibold [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return <MarkdownBody content={content} />;
}
