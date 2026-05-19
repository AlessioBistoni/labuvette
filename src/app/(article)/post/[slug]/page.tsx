import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article-body";
import { site } from "@/config/site";
import { formatDate } from "@/lib/format-date";
import { resolvePostCardPreview, resolvePostCover } from "@/lib/post-display";
import { playfairStyle } from "@/lib/typography";
import { getPostBySlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Articolo non trovato" };
  return {
    title: post.title,
    description: post.excerpt ?? resolvePostCardPreview(post),
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const cover = resolvePostCover(post);
  const preview = resolvePostCardPreview(post);

  return (
    <article className="min-h-dvh w-full min-w-0 bg-[var(--paper)] text-left">
      <div className="mx-auto w-full min-w-0 max-w-5xl px-5 pt-6 sm:px-10 sm:pt-10 lg:px-16 lg:pt-12">
        <Link
          href="/"
          className="inline-block font-sans text-[10px] uppercase tracking-[0.28em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
        >
          ← Blog
        </Link>

        <header className="mt-8 border-b border-[var(--line)] pb-8 sm:mt-10 sm:pb-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[10px] uppercase tracking-[0.32em] text-[var(--ink-muted)]">
            <time dateTime={post.date}>{formatDate(post.date, site.locale)}</time>
            {post.section ? (
              <>
                <span className="text-[var(--ink-faint)]" aria-hidden>
                  ·
                </span>
                <span>{post.section}</span>
              </>
            ) : null}
            {post.author ? (
              <>
                <span className="text-[var(--ink-faint)]" aria-hidden>
                  ·
                </span>
                <span className="normal-case tracking-normal">{post.author}</span>
              </>
            ) : null}
          </div>
          <h1
            className="mt-5 max-w-4xl break-words text-left text-[2rem] font-semibold leading-[1.08] tracking-tight text-[var(--ink)] sm:mt-6 sm:text-5xl lg:text-[3.25rem]"
            style={playfairStyle}
          >
            {post.title}
          </h1>
        </header>

        <figure className="mt-8 max-w-[42rem] sm:mt-10">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0a0a0a] sm:aspect-[3/2]">
            <Image
              src={cover}
              alt=""
              fill
              className="object-cover object-center grayscale contrast-[1.04]"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>
        </figure>
      </div>

      <div className="mx-auto w-full min-w-0 max-w-5xl px-5 pb-10 pt-2 sm:px-10 sm:pb-14 sm:pt-4 lg:px-16 lg:pb-16 lg:pt-6">
        <div className="w-full min-w-0 max-w-[42rem] text-left">
          {preview ? (
            <p className="break-words font-serif text-xl leading-[1.55] text-[var(--ink-soft)] sm:text-[1.35rem]">
              {preview}
            </p>
          ) : null}
          <div
            className={
              preview
                ? "mt-10 border-t border-[var(--line)] pt-10 sm:mt-12 sm:pt-12"
                : ""
            }
          >
            <ArticleBody content={post.content} />
          </div>
        </div>
      </div>
    </article>
  );
}
