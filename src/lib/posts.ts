import type { Post as DbPost } from "@prisma/client";
import { prisma } from "@/lib/prisma";
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
    content: row.content,
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const rows = await prisma.post.findMany({
    orderBy: { date: "desc" },
  });
  return rows.map(toPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const row = await prisma.post.findUnique({ where: { slug } });
  return row ? toPost(row) : null;
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
