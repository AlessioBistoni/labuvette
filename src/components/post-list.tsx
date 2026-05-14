"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Post } from "@/lib/post-types";
import { resolvePostCardPreview, resolvePostCover } from "@/lib/post-display";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 32 },
  },
};

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
  onOpenPost: (slug: string) => void;
};

export function PostList({ posts, locale, onOpenPost }: Props) {
  return (
    <motion.div
      className="flex flex-col gap-16 sm:gap-20"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {posts.map((post, index) => {
        const cover = resolvePostCover(post);
        const preview = resolvePostCardPreview(post);
        return (
          <motion.article key={post.slug} variants={item} className="group">
            <button
              type="button"
              onClick={() => onOpenPost(post.slug)}
              className="block w-full cursor-pointer text-left"
            >
              <motion.div className="relative aspect-[5/4] w-full overflow-hidden bg-[#0a0a0a] sm:aspect-[16/10]">
                <Image
                  src={cover}
                  alt={post.title}
                  fill
                  className="object-cover object-center transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.02] grayscale contrast-[1.08] group-hover:grayscale-0"
                  sizes="(max-width: 896px) 100vw, 896px"
                  priority={index < 2}
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/88 via-black/40 to-black/10"
                  aria-hidden
                />
                <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-8">
                  <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-white/80">
                    {formatDate(post.date, locale)}
                    {post.author ? (
                      <span className="text-white/55"> · {post.author}</span>
                    ) : null}
                  </p>
                  <h2
                    className="mt-3 max-w-4xl text-balance text-2xl font-semibold leading-[1.12] tracking-tight text-white sm:text-3xl md:text-[2.15rem]"
                    style={{
                      fontFamily:
                        "var(--font-playfair), ui-serif, Georgia, serif",
                    }}
                  >
                    {post.title}
                  </h2>
                </motion.div>
              </motion.div>
              <motion.div className="border-b border-[var(--line)] pb-10 pt-6 sm:pt-8">
                <p className="max-w-2xl font-serif text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg line-clamp-4">
                  {preview}
                </p>
                <span className="mt-5 inline-block font-sans text-[10px] uppercase tracking-[0.28em] text-[var(--ink-muted)] underline decoration-[var(--ink-faint)] underline-offset-[6px] transition-colors group-hover:decoration-[var(--ink)]">
                  Leggi
                </span>
              </motion.div>
            </button>
          </motion.article>
        );
      })}
    </motion.div>
  );
}
