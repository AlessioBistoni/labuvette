import { PageIntro } from "@/components/page-intro";
import { BlogFeed } from "@/components/blog-feed";
import { site } from "@/config/site";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ forbidden?: string; post?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const posts = await getAllPosts();
  const sp = await searchParams;
  const forbidden = sp.forbidden === "1";

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16 pt-8 sm:px-10 sm:pb-20 sm:pt-14">
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
          Nessun articolo ancora. Pubblicane uno dalla{" "}
          <a href="/redazione" className="text-[var(--wine)] underline underline-offset-2">
            redazione
          </a>
          .
        </p>
      ) : (
        <BlogFeed
          posts={posts}
          locale={site.locale}
          postSlug={sp.post ?? null}
        />
      )}
    </main>
  );
}
