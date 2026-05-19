"use client";

import Image from "next/image";
import Link from "next/link";
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
};

export function PostList({ posts, locale }: Props) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-y-14 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 lg:gap-x-10"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {posts.map((post, index) => {
        const cover = resolvePostCover(post);
        const preview = resolvePostCardPreview(post);
        return (
          <motion.article
            key={post.slug}
            variants={item}
            className="group min-w-0"
          >
            <Link
              href={`/post/${post.slug}`}
              className="block w-full min-w-0 cursor-pointer text-left"
            >
              <div className="relative block aspect-[4/3] w-full max-w-full overflow-hidden bg-[#0a0a0a]">
                <Image
                  src={cover}
                  alt={post.title}
                  fill
                  className="object-cover object-center grayscale contrast-[1.08] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 640px"
                  priority={index < 2}
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/88 via-black/40 to-black/10"
                  aria-hidden
                />
                <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-6">
                  <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-white/80">
                    {formatDate(post.date, locale)}
                    {post.author ? (
                      <span className="text-white/55"> · {post.author}</span>
                    ) : null}
                  </p>
                  <h2
                    className="mt-2 text-balance text-xl font-semibold leading-[1.12] tracking-tight text-white sm:mt-3 sm:text-2xl"
                    style={{
                      fontFamily:
                        "var(--font-playfair), ui-serif, Georgia, serif",
                    }}
                  >
                    {post.title}
                  </h2>
                </motion.div>
              </div>
              <motion.div className="border-b border-[var(--line)] pb-8 pt-5 sm:pb-10 sm:pt-6">
                <p className="font-serif text-sm leading-relaxed text-[var(--ink-soft)] line-clamp-3 sm:text-base sm:line-clamp-4">
                  {preview}
                </p>
                <span className="mt-5 inline-block font-sans text-[10px] uppercase tracking-[0.28em] text-[var(--ink-muted)] underline decoration-[var(--ink-faint)] underline-offset-[6px] transition-colors group-hover:decoration-[var(--ink)]">
                  Leggi
                </span>
              </motion.div>
            </Link>
          </motion.article>
        );
      })}
    </motion.div>
  );
}
