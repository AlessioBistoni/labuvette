import { plainPreviewFromMarkdown } from "@/lib/post-preview";
import type { Post } from "@/lib/post-types";

const FALLBACK_COVERS = [
  "/covers/buvette-1.png",
  "/covers/buvette-2.png",
  "/covers/buvette-3.png",
];

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) {
    h = (h << 5) - h + slug.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Immagine in card: frontmatter `cover` oppure rotazione tra le cover di default. */
export function resolvePostCover(post: Post): string {
  if (post.cover) return post.cover;
  return FALLBACK_COVERS[hashSlug(post.slug) % FALLBACK_COVERS.length];
}

/** Testo sotto il titolo in overlay: excerpt oppure prime righe del corpo. */
export function resolvePostCardPreview(post: Post): string {
  if (post.excerpt?.trim()) return post.excerpt.trim();
  return plainPreviewFromMarkdown(post.content);
}
