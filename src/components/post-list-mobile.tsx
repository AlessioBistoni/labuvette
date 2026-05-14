"use client";

import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/post-types";
import { resolvePostCardPreview, resolvePostCover } from "@/lib/post-display";

function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

type Props = {
  posts: Post[];
  locale: string;
};

export function PostListMobile({ posts, locale }: Props) {
  return (
    <div className="flex flex-col gap-12">
      {posts.map((post, index) => {
        const cover = resolvePostCover(post);
        const preview = resolvePostCardPreview(post);

        return (
          <article key={post.slug} className="group">
            <Link
              href={`/post/${post.slug}`}
              className="block w-full cursor-pointer text-left touch-manipulation [-webkit-tap-highlight-color:transparent]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0a0a0a]">
                <Image
                  src={cover}
                  alt={post.title}
                  fill
                  className="object-cover object-center grayscale contrast-[1.08]"
                  sizes="100vw"
                  priority={index < 2}
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/88 via-black/40 to-black/10"
                  aria-hidden
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-white/80">
                    {formatDate(post.date, locale)}
                    {post.author ? (
                      <span className="text-white/55"> · {post.author}</span>
                    ) : null}
                  </p>
                  <h2
                    className="mt-2 max-w-4xl text-balance text-xl font-semibold leading-[1.12] tracking-tight text-white"
                    style={{
                      fontFamily:
                        "var(--font-playfair), ui-serif, Georgia, serif",
                    }}
                  >
                    {post.title}
                  </h2>
                </div>
              </div>
              <div className="border-b border-[var(--line)] pb-8 pt-5">
                <p className="max-w-2xl font-serif text-base leading-relaxed text-[var(--ink-soft)] line-clamp-4">
                  {preview}
                </p>
                <span className="mt-4 inline-block font-sans text-[10px] uppercase tracking-[0.28em] text-[var(--ink-muted)] underline decoration-[var(--ink-faint)] underline-offset-[6px]">
                  Leggi
                </span>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
