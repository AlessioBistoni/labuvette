import { site } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto max-w-4xl px-5 py-14 sm:px-10">
        <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-[var(--ink-muted)]">
          Contatti
        </p>
        <a
          href={`mailto:${site.contactEmail}`}
          className="mt-3 inline-block font-serif text-lg text-[var(--ink)] underline decoration-[var(--ink)]/20 underline-offset-4 hover:decoration-[var(--ink)] transition-[text-decoration-color] duration-300"
        >
          {site.contactEmail}
        </a>
        <p className="mt-10 font-serif text-sm text-[var(--ink-soft)] leading-relaxed">
          Nessuna newsletter, nessun cookie invadente: solo testo e calma.
        </p>
      </div>
    </footer>
  );
}
