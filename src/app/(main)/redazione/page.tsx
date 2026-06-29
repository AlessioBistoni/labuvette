import Link from "next/link";
import { getCategories } from "@/lib/categories";
import { getAllPosts } from "@/lib/posts";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "./actions";

function errMessage(code: string | undefined) {
  switch (code) {
    case "missing":
      return "Articolo non trovato.";
    case "category-name":
      return "Inserisci un nome categoria valido.";
    case "category-exists":
      return "Esiste già una categoria con questo nome.";
    case "category-missing":
      return "Categoria non trovata.";
    default:
      return null;
  }
}

type Props = {
  searchParams: Promise<{ err?: string; deleted?: string; category?: string }>;
};

export default async function RedazioneHome({ searchParams }: Props) {
  const sp = await searchParams;
  const posts = await getAllPosts();
  const categories = await getCategories();
  const alert = errMessage(sp.err);
  const deleted = sp.deleted === "1";
  const categoryMessage =
    sp.category === "created"
      ? "Categoria creata."
      : sp.category === "updated"
        ? "Categoria aggiornata."
        : sp.category === "deleted"
          ? "Categoria eliminata dagli elenchi e rimossa dagli articoli collegati."
          : null;

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

      {categoryMessage ? (
        <p
          className="mt-8 rounded border border-[var(--line)] bg-[var(--cream-dark)]/60 px-4 py-3 font-sans text-sm text-[var(--ink)]"
          role="status"
        >
          {categoryMessage}
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

      <section className="mt-12 border-y border-[var(--line)] py-10">
        <div>
          <h2 className="font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
            Categorie
          </h2>
          <p className="mt-3 max-w-xl font-serif text-base leading-relaxed text-[var(--ink-soft)]">
            Modifica le categorie disponibili negli articoli. Se elimini una
            categoria, gli articoli collegati restano pubblicati ma senza
            categoria.
          </p>
        </div>

        <form action={createCategoryAction} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="new-category">
            Nuova categoria
          </label>
          <input
            id="new-category"
            name="name"
            placeholder="Nuova categoria"
            className="min-w-0 flex-1 border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-serif text-base text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--wine)]/25"
          />
          <button
            type="submit"
            className="border border-[var(--ink)] bg-[var(--ink)] px-5 py-3 font-sans text-xs uppercase tracking-[0.2em] text-[var(--paper)] transition-colors hover:border-[var(--wine)] hover:bg-[var(--wine)]"
          >
            Aggiungi
          </button>
        </form>

        <ul className="mt-6 space-y-3">
          {categories.map((category) => (
            <li key={category.id} className="border border-[var(--line)] p-4">
              <form action={updateCategoryAction} className="flex flex-col gap-3 sm:flex-row">
                <input type="hidden" name="id" value={category.id} />
                <label className="sr-only" htmlFor={`category-${category.id}`}>
                  Nome categoria
                </label>
                <input
                  id={`category-${category.id}`}
                  name="name"
                  defaultValue={category.name}
                  className="min-w-0 flex-1 border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-serif text-base text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--wine)]/25"
                />
                <button
                  type="submit"
                  className="border border-[var(--ink)] px-5 py-3 font-sans text-xs uppercase tracking-[0.2em] text-[var(--ink)] transition-colors hover:border-[var(--wine)] hover:text-[var(--wine)]"
                >
                  Salva
                </button>
              </form>
              <form action={deleteCategoryAction} className="mt-3">
                <input type="hidden" name="id" value={category.id} />
                <button
                  type="submit"
                  className="font-sans text-[10px] uppercase tracking-[0.22em] text-[var(--ink-muted)] underline decoration-[var(--ink-faint)] underline-offset-4 transition-colors hover:text-[var(--wine)]"
                >
                  Elimina categoria
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>

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
