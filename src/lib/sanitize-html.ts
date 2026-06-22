import sanitizeHtml from "sanitize-html";

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

export function sanitizeArticleHtml(html: string): string {
  const clean = sanitizeHtml(html.trim(), {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      "*": ["class", "style"],
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedStyles: {
      "*": {
        color: [/^#[0-9a-f]{6}$/i],
        "font-size": [/^(?:12|14|16|18|20|24|30|36)px$/],
      },
    },
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
