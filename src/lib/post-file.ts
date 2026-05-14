import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content/posts");

const RESERVED_SLUGS = new Set([
  "nuovo",
  "gestione",
  "login",
  "api",
  "admin",
  "redazione",
  "_next",
]);

export function sanitizeSlug(raw: string): string | null {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (s.length < 2 || s.length > 96) return null;
  if (RESERVED_SLUGS.has(s)) return null;
  return s;
}

export function postFilePath(slug: string): string {
  return path.join(postsDir, `${slug}.md`);
}

export function postExists(slug: string): boolean {
  return fs.existsSync(postFilePath(slug));
}

export function writePostMarkdown(
  slug: string,
  body: string,
  data: {
    title: string;
    date: string;
    author?: string;
    excerpt?: string;
    cover?: string;
  },
): void {
  const safe = sanitizeSlug(slug);
  if (!safe) throw new Error("Slug non valido.");
  const front: Record<string, string> = {
    title: data.title.trim(),
    date: data.date.slice(0, 10),
  };
  if (data.author?.trim()) front.author = data.author.trim();
  if (data.excerpt?.trim()) front.excerpt = data.excerpt.trim();
  if (data.cover?.trim()) front.cover = data.cover.trim();
  const raw = matter.stringify(body.trim(), front);
  fs.mkdirSync(postsDir, { recursive: true });
  fs.writeFileSync(postFilePath(safe), raw, "utf8");
}

export function deletePostFile(slug: string): void {
  const safe = sanitizeSlug(slug);
  if (!safe) throw new Error("Slug non valido.");
  const p = postFilePath(safe);
  if (!fs.existsSync(p)) return;
  fs.unlinkSync(p);
}
