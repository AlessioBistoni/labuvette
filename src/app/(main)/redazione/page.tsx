import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

function errMessage(code: string | undefined) {
  switch (code) {
    case "missing":
      return "Articolo non trovato.";
    default:
      return null;
  }
}

type Props = {
  searchParams: Promise<{ err?: string; deleted?: string }>;
};

export default async function RedazioneHome({ searchParams }: Props) {
  const sp = await searchParams;
  const posts = await getAllPosts();
  const alert = errMessage(sp.err);
  const deleted = sp.deleted === "1";

  return (
    <main className="mx-auto max-w-2xl px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
      <Link
        href="/"
        className="font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)] hover:text-[var(--wine)] transition-colors duration-300"
      >
        ← Sito pubblico
      </Link>

      <header className="mt-8 border-b border-[var(--line)] pb-10">
        <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-[var(--ink-muted)]">
          Amministratori
        </p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-[var(--ink)]">
          Redazione
        </h1>
        <p className="mt-4 max-w-xl font-serif text-lg leading-relaxed text-[var(--ink-soft)]">
          Crea e modifica gli articoli salvati nel database. Il blog resta visibile a
          tutti; solo chi ha accesso può entrare qui.
        </p>
        <div className="mt-8">
          <Link
            href="/redazione/nuovo"
            className="inline-flex border border-[var(--ink)] bg-[var(--ink)] px-5 py-3 font-sans text-xs uppercase tracking-[0.2em] text-[var(--paper)] transition-colors hover:bg-[var(--wine)] hover:border-[var(--wine)]"
          >
            Nuovo articolo
          </Link>
        </div>
      </header>

      {deleted ? (
        <p
          className="mt-8 rounded border border-[var(--line)] bg-[var(--cream-dark)]/60 px-4 py-3 font-sans text-sm text-[var(--ink)]"
          role="status"
        >
          Articolo eliminato definitivamente dal database.
        </p>
      ) : null}

      {alert ? (
        <p
          className="mt-8 rounded border border-[var(--wine)]/30 bg-[var(--cream-dark)] px-4 py-3 font-sans text-sm text-[var(--wine)]"
          role="alert"
        >
          {alert}
        </p>
      ) : null}

      <section className="mt-12">
        <h2 className="font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
          Articoli
        </h2>
        <ul className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {posts.map((p) => (
            <li key={p.slug} className="py-4">
              <Link
                href={`/redazione/${p.slug}`}
                className="group block font-serif text-xl text-[var(--ink)] hover:text-[var(--wine)] transition-colors"
              >
                {p.title}
              </Link>
              <p className="mt-1 font-sans text-sm text-[var(--ink-soft)]">
                {p.slug} ·{" "}
                {new Date(p.date).toLocaleDateString("it-IT", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
