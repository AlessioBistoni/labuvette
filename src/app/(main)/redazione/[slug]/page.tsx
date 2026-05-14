import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverImagePicker } from "@/components/cover-image-picker";
import { RichTextEditor } from "@/components/rich-text-editor";
import { getPostBySlug } from "@/lib/posts";
import { updatePostAction } from "../actions";
import { DeletePostForm } from "../delete-post-form";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string; err?: string }>;
};

function errMsg(code: string | undefined) {
  switch (code) {
    case "title":
      return "Il titolo è obbligatorio.";
    case "body":
      return "Il testo dell’articolo è troppo breve.";
    case "date":
      return "La data non è valida.";
    case "cover":
      return "Immagine di copertina non valida o formato non supportato.";
    default:
      return null;
  }
}

export default async function ModificaArticoloPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const saved = sp.saved === "1";
  const alert = errMsg(sp.err);
  const dateStr = new Date(post.date).toISOString().slice(0, 10);

  return (
    <main className="mx-auto max-w-2xl px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
      <Link
        href="/redazione"
        className="font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)] hover:text-[var(--wine)] transition-colors duration-300"
      >
        ← Redazione
      </Link>

      <header className="mt-8 border-b border-[var(--line)] pb-10">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-[var(--ink)]">
          Modifica articolo
        </h1>
        <p className="mt-2 font-mono text-sm text-[var(--ink-soft)]">{post.slug}</p>
      </header>

      {saved ? (
        <p
          className="mt-8 rounded border border-[var(--line)] bg-[var(--cream-dark)]/60 px-4 py-3 font-sans text-sm text-[var(--ink)]"
          role="status"
        >
          Modifiche salvate.{" "}
          <Link href={`/?post=${post.slug}`} className="text-[var(--wine)] underline underline-offset-2">
            Vedi sul sito
          </Link>
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

      <form action={updatePostAction} className="mt-10 space-y-6 max-w-xl">
        <input type="hidden" name="originalSlug" value={post.slug} />
        <div>
          <label
            htmlFor="title"
            className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]"
          >
            Titolo
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={post.title}
            className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-serif text-lg text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--wine)]/25"
          />
        </div>
        <div>
          <label
            htmlFor="date"
            className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]"
          >
            Data
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={dateStr}
            className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-sans text-sm text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--wine)]/25"
          />
        </div>
        <div>
          <label
            htmlFor="author"
            className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]"
          >
            Autore (opzionale)
          </label>
          <input
            id="author"
            name="author"
            defaultValue={post.author ?? ""}
            className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-serif text-lg text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--wine)]/25"
          />
        </div>
        <div>
          <label
            htmlFor="excerpt"
            className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]"
          >
            Estratto (opzionale)
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={post.excerpt ?? ""}
            className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-serif text-base text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--wine)]/25"
          />
        </div>
        <div>
          <span className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
            Copertina
          </span>
          <div className="mt-2">
            <CoverImagePicker currentCover={post.cover} />
          </div>
        </div>
        <div>
          <span className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
            Testo articolo
          </span>
          <div className="mt-2">
            <RichTextEditor name="body" defaultValue={post.content} />
          </div>
          <p className="mt-2 font-sans text-xs text-[var(--ink-faint)]">
            Seleziona il testo per la barra rapida, oppure usa gli strumenti che
            compaiono quando il cursore è nel campo.
          </p>
        </div>
        <button
          type="submit"
          className="border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-sans text-xs uppercase tracking-[0.2em] text-[var(--paper)] transition-colors hover:bg-[var(--wine)] hover:border-[var(--wine)]"
        >
          Salva modifiche
        </button>
      </form>

      <DeletePostForm slug={post.slug} />
    </main>
  );
}
