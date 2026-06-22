"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Post } from "@/lib/post-types";
import { formatDate } from "@/lib/format-date";
import { resolvePostCardPreview, resolvePostCover } from "@/lib/post-display";
import { playfairStyle } from "@/lib/typography";

const listMotion = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
};

const cardMotion = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 32 },
  },
};

type Props = {
  posts: Post[];
  locale: string;
};

export function PostList({ posts, locale }: Props) {
  return (
    <motion.div
      className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-16 lg:gap-x-10"
      variants={listMotion}
      initial="hidden"
      animate="show"
    >
      {posts.map((post, index) => {
        const cover = resolvePostCover(post);
        const preview = resolvePostCardPreview(post);

        return (
          <motion.article
            key={post.slug}
            variants={cardMotion}
            className="group min-w-0"
          >
            <Link
              href={`/post/${post.slug}`}
              className="block w-full min-w-0 cursor-pointer text-left touch-manipulation [-webkit-tap-highlight-color:transparent]"
            >
              <div className="relative block aspect-[4/3] w-full max-w-full overflow-hidden bg-[#0a0a0a]">
                <Image
                  src={cover}
                  alt={post.title}
                  fill
                  className="object-cover object-center grayscale contrast-[1.08] transition-transform duration-700 ease-out sm:group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1280px) 50vw, 640px"
                  priority={index < 2}
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/88 via-black/40 to-black/10"
                  aria-hidden
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-6">
                  <p className="font-sans text-[8px] uppercase tracking-[0.28em] text-white/80 sm:text-[10px] sm:tracking-[0.35em]">
                    {formatDate(post.date, locale)}
                    {post.author ? (
                      <span className="hidden text-white/55 sm:inline">
                        {" "}
                        · {post.author}
                      </span>
                    ) : null}
                  </p>
                  <h2
                    className="mt-1.5 text-balance text-base font-semibold leading-[1.12] tracking-tight text-white sm:mt-3 sm:text-2xl"
                    style={playfairStyle}
                  >
                    {post.title}
                  </h2>
                </div>
              </div>
              <div className="border-b border-[var(--line)] pb-6 pt-4 sm:pb-10 sm:pt-6">
                <p className="font-serif text-sm leading-relaxed text-[var(--ink-soft)] line-clamp-3 sm:text-base sm:line-clamp-4">
                  {preview}
                </p>
                <span className="mt-3 inline-block font-sans text-[9px] uppercase tracking-[0.24em] text-[var(--ink-muted)] underline decoration-[var(--ink-faint)] underline-offset-[6px] transition-colors group-hover:decoration-[var(--ink)] sm:mt-5 sm:text-[10px] sm:tracking-[0.28em]">
                  Leggi
                </span>
              </div>
            </Link>
          </motion.article>
        );
      })}
    </motion.div>
  );
}
