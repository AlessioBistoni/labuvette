"use client";

import Image from "next/image";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArticleBody } from "@/components/article-body";
import type { Post } from "@/lib/post-types";
import { resolvePostCardPreview, resolvePostCover } from "@/lib/post-display";

const EASE = [0.22, 1, 0.36, 1] as const;

function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

type Props = {
  post: Post | null;
  locale: string;
  onClose: () => void;
  /** Animazioni rapide solo su mobile (feed dedicato). */
  mobile?: boolean;
};

export function PostModal({ post, locale, onClose, mobile = false }: Props) {
  const reduceMotion = useReducedMotion();
  const fast = Boolean(reduceMotion || mobile);

  useEffect(() => {
    if (!post) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [post, onClose]);

  useEffect(() => {
    if (!post) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [post]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {post ? (
        <motion.div
          key={post.slug}
          className="fixed inset-0 z-[200] touch-manipulation"
          role="dialog"
          aria-modal="true"
          aria-labelledby="post-modal-title"
          initial={fast ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={fast ? undefined : { opacity: 0 }}
          transition={{ duration: fast ? 0.12 : 0.25, ease: EASE }}
        >
          <button
            type="button"
            aria-label="Chiudi articolo"
            className="absolute inset-0 z-0 bg-[var(--ink)]/40 sm:bg-[var(--ink)]/35 sm:backdrop-blur-xl"
            onClick={onClose}
          />

          <div className="absolute inset-0 z-10 flex items-end justify-center sm:items-center sm:p-6">
            <motion.article
              className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden bg-[var(--paper)] shadow-2xl sm:max-h-[88dvh] sm:rounded-sm"
              initial={fast ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={fast ? undefined : { opacity: 0, y: 16 }}
              transition={{ duration: fast ? 0.15 : 0.4, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 z-20 min-h-11 min-w-11 px-2 font-sans text-[10px] uppercase tracking-[0.28em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)] sm:right-4 sm:top-4"
              >
                Chiudi ×
              </button>

              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#0a0a0a] sm:aspect-[16/10]">
                <Image
                  src={resolvePostCover(post)}
                  alt=""
                  fill
                  className="object-cover object-center grayscale contrast-[1.06]"
                  sizes="(max-width: 640px) 100vw, 672px"
                  priority
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                  <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-white/80">
                    {formatDate(post.date, locale)}
                    {post.author ? (
                      <span className="text-white/55"> · {post.author}</span>
                    ) : null}
                  </p>
                  <h2
                    id="post-modal-title"
                    className="mt-2 text-balance text-xl font-semibold leading-[1.1] tracking-tight text-white sm:mt-3 sm:text-3xl"
                    style={{
                      fontFamily:
                        "var(--font-playfair), ui-serif, Georgia, serif",
                    }}
                  >
                    {post.title}
                  </h2>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-10 pt-6 sm:px-8 sm:pt-8">
                <p className="border-l border-[var(--ink)] pl-4 font-serif text-base leading-relaxed text-[var(--ink-soft)] sm:pl-5 sm:text-xl">
                  {resolvePostCardPreview(post)}
                </p>
                <div className="mt-8 sm:mt-10">
                  <ArticleBody content={post.content} />
                </div>
              </div>
            </motion.article>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
