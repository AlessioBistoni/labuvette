import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { parsePostSection } from "@/lib/sections";
import type { Post } from "@/lib/post-types";

const postsDir = path.join(process.cwd(), "content/posts");

function sanitizeCover(raw: unknown): string | undefined {
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  const s = raw.trim();
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  if (s.startsWith("https://")) return s;
  return undefined;
}

function parseFile(slug: string, raw: string): Post {
  const { data, content } = matter(raw);
  const title = typeof data.title === "string" ? data.title : slug;
  const date =
    typeof data.date === "string" || data.date instanceof Date
      ? new Date(data.date).toISOString()
      : new Date().toISOString();
  return {
    slug,
    title,
    date,
    author: typeof data.author === "string" ? data.author : undefined,
    excerpt: typeof data.excerpt === "string" ? data.excerpt : undefined,
    cover: sanitizeCover(data.cover),
    section: parsePostSection(
      typeof data.section === "string" ? data.section : undefined,
    ) ?? undefined,
    content: content.trim(),
  };
}

/** Articoli da content/posts/*.md — funziona su Vercel senza database remoto. */
export function getAllPostsFromFiles(): Post[] {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
      return parseFile(slug, raw);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlugFromFiles(slug: string): Post | null {
  const full = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(full)) return null;
  const raw = fs.readFileSync(full, "utf8");
  return parseFile(slug, raw);
}
