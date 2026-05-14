import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article-body";
import { site } from "@/config/site";
import { resolvePostCardPreview, resolvePostCover } from "@/lib/post-display";
import { getPostBySlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

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
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-16 pt-6 sm:px-10 sm:pb-20 sm:pt-10">
      <Link
        href="/"
        className="mb-8 inline-block font-sans text-[10px] uppercase tracking-[0.28em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
      >
        ← Torna al blog
      </Link>

      <article>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0a0a0a] sm:aspect-[16/10] sm:rounded-sm">
          <Image
            src={cover}
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
              {formatDate(post.date, site.locale)}
              {post.author ? (
                <span className="text-white/55"> · {post.author}</span>
              ) : null}
            </p>
            <h1
              className="mt-2 text-balance text-2xl font-semibold leading-[1.1] tracking-tight text-white sm:mt-3 sm:text-3xl"
              style={{
                fontFamily: "var(--font-playfair), ui-serif, Georgia, serif",
              }}
            >
              {post.title}
            </h1>
          </div>
        </div>

        <div className="mt-8 sm:mt-10">
          <p className="border-l border-[var(--ink)] pl-4 font-serif text-base leading-relaxed text-[var(--ink-soft)] sm:pl-5 sm:text-xl">
            {preview}
          </p>
          <div className="mt-8 sm:mt-10">
            <ArticleBody content={post.content} />
          </div>
        </div>
      </article>
    </main>
  );
}
