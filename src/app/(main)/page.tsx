import Link from "next/link";
import { redirect } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { PostList } from "@/components/post-list";
import { site } from "@/config/site";
import { parsePostSection } from "@/lib/sections";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ forbidden?: string; post?: string; section?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const sp = await searchParams;

  if (sp.post) {
    redirect(`/post/${encodeURIComponent(sp.post)}`);
  }

  const section = parsePostSection(sp.section);
  const posts = await getAllPosts(section);
  const forbidden = sp.forbidden === "1";

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-8 sm:px-10 sm:pb-20 sm:pt-14">
      {forbidden ? (
        <p
          className="mb-10 rounded border border-[var(--wine)]/30 bg-[var(--cream-dark)] px-4 py-3 font-sans text-sm text-[var(--wine)]"
          role="alert"
        >
          Non hai i permessi per accedere a quella pagina.
        </p>
      ) : null}
      <PageIntro activeSection={section} />
      {posts.length === 0 ? (
        <p className="font-serif text-lg text-[var(--ink-soft)]">
          {section
            ? `Nessun articolo in «${section}» per ora.`
            : "Nessun articolo ancora."}{" "}
          Pubblicane uno dalla{" "}
          <Link href="/redazione" className="text-[var(--wine)] underline underline-offset-2">
            redazione
          </Link>
          .
        </p>
      ) : (
        <PostList posts={posts} locale={site.locale} />
      )}
    </main>
  );
}
