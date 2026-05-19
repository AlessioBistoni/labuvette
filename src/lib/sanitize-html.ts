import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "s",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "span",
];

const ALLOWED_ATTR = ["style", "href", "target", "rel", "class"];

export function sanitizeArticleHtml(html: string): string {
  const clean = DOMPurify.sanitize(html.trim(), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
  return clean.replace(/white-space\s*:\s*nowrap/gi, "white-space:normal");
}

export function htmlPlainTextLength(html: string): number {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim().length;
}

export function isHtmlContent(content: string): boolean {
  const t = content.trim();
  if (!t) return false;
  return /^<[a-z][\s\S]*>/i.test(t);
}
