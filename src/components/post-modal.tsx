"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArticleBody } from "@/components/article-body";
import type { Post } from "@/lib/post-types";
import { resolvePostCardPreview, resolvePostCover } from "@/lib/post-display";

const EASE = [0.22, 1, 0.36, 1] as const;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Velina scura: entra in ~0,9 s */
const dimTransition = {
  duration: 0.9,
  ease: EASE_OUT,
};

/** Blur: opacità 0→1 su strato già sfocato (~1,7 s) — più fluido che animare backdrop-filter */
const blurTransition = {
  duration: 1.7,
  ease: EASE_OUT,
};

const panelTransition = {
  duration: 0.52,
  ease: EASE,
  delay: 0.12,
};

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
};

export function PostModal({ post, locale, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!post) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [post, onClose]);

  useEffect(() => {
    document.body.style.overflow = post ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [post]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {post ? (
        <motion.div
          key={post.slug}
          className="fixed inset-0 z-[200]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="post-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          {/* Sfondo cliccabile: velina + blur che si intensifica lentamente */}
          <div
            className="absolute inset-0 z-0"
            role="presentation"
            onClick={onClose}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onClose();
            }}
          >
            <motion.div
              className="absolute inset-0 bg-[var(--ink)]/35"
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={dimTransition}
            />
            <motion.div
              className="absolute inset-0 backdrop-blur-2xl sm:backdrop-blur-3xl"
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={blurTransition}
            />
          </div>

          {/* Pannello articolo sopra lo sfondo */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center sm:items-center sm:p-8">
            <motion.article
              className="pointer-events-auto flex max-h-[min(92vh,900px)] w-full max-w-2xl flex-col overflow-hidden bg-[var(--paper)] shadow-2xl sm:max-h-[88vh] sm:rounded-sm"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={panelTransition}
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 z-20 font-sans text-[10px] uppercase tracking-[0.28em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
              >
                Chiudi ×
              </button>

              <motion.div
                className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#0a0a0a]"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.08, duration: 0.35, ease: EASE }}
              >
                <Image
                  src={resolvePostCover(post)}
                  alt=""
                  fill
                  className="object-cover object-center grayscale contrast-[1.06]"
                  sizes="(max-width: 672px) 100vw, 672px"
                />
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                  aria-hidden
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
                />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-white/80">
                    {formatDate(post.date, locale)}
                    {post.author ? (
                      <span className="text-white/55"> · {post.author}</span>
                    ) : null}
                  </p>
                  <h2
                    id="post-modal-title"
                    className="mt-3 text-balance text-2xl font-semibold leading-[1.1] tracking-tight text-white sm:text-3xl"
                    style={{
                      fontFamily:
                        "var(--font-playfair), ui-serif, Georgia, serif",
                    }}
                  >
                    {post.title}
                  </h2>
                </div>
              </motion.div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-10 pt-8 sm:px-8">
                <p className="border-l border-[var(--ink)] pl-5 font-serif text-lg leading-relaxed text-[var(--ink-soft)] sm:text-xl">
                  {resolvePostCardPreview(post)}
                </p>
                <div className="mt-10">
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
