import type { Post as DbPost } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  getAllPostsFromFiles,
  getPostBySlugFromFiles,
} from "@/lib/posts-from-files";
import type { PostSection } from "@/config/sections";
import type { Post } from "@/lib/post-types";

export type { Post, PostMeta } from "@/lib/post-types";

function toPost(row: DbPost): Post {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date.toISOString(),
    author: row.author ?? undefined,
    excerpt: row.excerpt ?? undefined,
    cover: row.cover ?? undefined,
    section: row.section ?? undefined,
    content: row.content,
  };
}

/** Su Vercel senza Turso usiamo i .md nel repo (come prima del passaggio a Prisma). */
function shouldUseDatabase(): boolean {
  const url = process.env.DATABASE_URL ?? "";
  if (!url) return false;
  if (process.env.VERCEL) {
    return (
      Boolean(process.env.TURSO_AUTH_TOKEN) &&
      (url.startsWith("libsql://") || url.startsWith("https://"))
    );
  }
  return true;
}

export async function getAllPosts(section?: PostSection | null): Promise<Post[]> {
  if (shouldUseDatabase()) {
    try {
      const rows = await prisma.post.findMany({
        where: section ? { section } : undefined,
        orderBy: { date: "desc" },
      });
      return rows.map(toPost);
    } catch (error) {
      console.error("[posts] DB non disponibile, fallback su file markdown", error);
    }
  }
  const all = getAllPostsFromFiles();
  if (!section) return all;
  return all.filter((p) => p.section === section);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (shouldUseDatabase()) {
    try {
      const row = await prisma.post.findUnique({ where: { slug } });
      if (row) return toPost(row);
    } catch (error) {
      console.error("[posts] DB non disponibile, fallback su file markdown", error);
    }
  }
  return getPostBySlugFromFiles(slug);
}

export async function postExists(slug: string): Promise<boolean> {
  const row = await prisma.post.findUnique({
    where: { slug },
    select: { id: true },
  });
  return Boolean(row);
}

export type PostInput = {
  slug: string;
  title: string;
  date: string;
  author?: string;
  excerpt?: string;
  cover?: string;
  section?: PostSection;
  content: string;
};

export async function createPost(data: PostInput): Promise<Post> {
  const row = await prisma.post.create({
    data: {
      slug: data.slug,
      title: data.title,
      date: new Date(data.date),
      author: data.author ?? null,
      excerpt: data.excerpt ?? null,
      cover: data.cover ?? null,
      section: data.section ?? null,
      content: data.content,
    },
  });
  return toPost(row);
}

export async function updatePost(
  slug: string,
  data: Omit<PostInput, "slug">,
): Promise<Post> {
  const row = await prisma.post.update({
    where: { slug },
    data: {
      title: data.title,
      date: new Date(data.date),
      author: data.author ?? null,
      excerpt: data.excerpt ?? null,
      cover: data.cover ?? null,
      section: data.section ?? null,
      content: data.content,
    },
  });
  return toPost(row);
}

export async function deletePostBySlug(slug: string): Promise<Post | null> {
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (!existing) return null;
  await prisma.post.delete({ where: { slug } });
  return toPost(existing);
}
