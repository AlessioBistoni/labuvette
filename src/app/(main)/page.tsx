import { Suspense } from "react";
import { PageIntro } from "@/components/page-intro";
import { BlogFeed } from "@/components/blog-feed";
import { site } from "@/config/site";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ forbidden?: string; post?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const posts = getAllPosts();
  const sp = await searchParams;
  const forbidden = sp.forbidden === "1";

  return (
    <main className="mx-auto max-w-4xl px-5 pb-20 pt-10 sm:px-10 sm:pt-14">
      {forbidden ? (
        <p
          className="mb-10 rounded border border-[var(--wine)]/30 bg-[var(--cream-dark)] px-4 py-3 font-sans text-sm text-[var(--wine)]"
          role="alert"
        >
          Non hai i permessi per accedere a quella pagina.
        </p>
      ) : null}
      <PageIntro />
      {posts.length === 0 ? (
        <p className="font-serif text-lg text-[var(--ink-soft)]">
          Nessun articolo ancora. Aggiungi un file{" "}
          <code className="rounded bg-[var(--cream-dark)] px-1.5 py-0.5 font-mono text-sm">
            .md
          </code>{" "}
          in{" "}
          <code className="rounded bg-[var(--cream-dark)] px-1.5 py-0.5 font-mono text-sm">
            content/posts
          </code>
          .
        </p>
      ) : (
        <Suspense fallback={null}>
          <BlogFeed posts={posts} locale={site.locale} />
        </Suspense>
      )}
    </main>
  );
}
