import Link from "next/link";
import { CoverImagePicker } from "@/components/cover-image-picker";
import { RichTextEditor } from "@/components/rich-text-editor";
import { createPostAction } from "../actions";

function errMsg(code: string | undefined) {
  switch (code) {
    case "slug":
      return "Lo slug non è valido (solo lettere minuscole, numeri e trattini).";
    case "exists":
      return "Esiste già un articolo con questo slug.";
    case "title":
      return "Il titolo è obbligatorio.";
    case "body":
      return "Il testo dell’articolo è troppo breve.";
    case "date":
      return "La data non è valida (usa il formato del calendario).";
    case "cover":
      return "Immagine di copertina non valida o formato non supportato.";
    default:
      return null;
  }
}

type Props = {
  searchParams: Promise<{ err?: string }>;
};

export default async function NuovoArticoloPage({ searchParams }: Props) {
  const sp = await searchParams;
  const alert = errMsg(sp.err);
  const today = new Date().toISOString().slice(0, 10);

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
          Nuovo articolo
        </h1>
      </header>

      {alert ? (
        <p
          className="mt-8 rounded border border-[var(--wine)]/30 bg-[var(--cream-dark)] px-4 py-3 font-sans text-sm text-[var(--wine)]"
          role="alert"
        >
          {alert}
        </p>
      ) : null}

      <form action={createPostAction} className="mt-10 space-y-6 max-w-xl">
        <div>
          <label
            htmlFor="slug"
            className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]"
          >
            Slug URL (es. il-mio-articolo)
          </label>
          <input
            id="slug"
            name="slug"
            required
            placeholder="es. mio-nuovo-articolo"
            className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-mono text-sm text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--wine)]/25"
          />
        </div>
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
            defaultValue={today}
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
            className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-serif text-base text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--wine)]/25"
          />
        </div>
        <div>
          <span className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
            Copertina (opzionale)
          </span>
          <div className="mt-2">
            <CoverImagePicker />
          </div>
          <p className="mt-2 font-sans text-xs text-[var(--ink-faint)]">
            Se non scegli un&apos;immagine, si usa una copertina di default.
          </p>
        </div>
        <div>
          <span className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
            Testo articolo
          </span>
          <div className="mt-2">
            <RichTextEditor name="body" />
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
          Pubblica
        </button>
      </form>
    </main>
  );
}
