import Link from "next/link";
import { getSession } from "@/lib/get-session";
import { site } from "@/config/site";

export async function SiteFooter() {
  const session = await getSession();

  return (
    <footer className="mt-28 border-t border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 px-5 py-14 sm:grid-cols-2 sm:gap-12 sm:px-10">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-[var(--orange)]">
              Contatti
            </p>
            <a
              href={`mailto:${site.contactEmail}`}
              className="mt-3 inline-block font-serif text-lg text-[var(--ink)] underline decoration-[var(--ink)]/20 underline-offset-4 hover:decoration-[var(--ink)] transition-[text-decoration-color] duration-300"
            >
              {site.contactEmail}
            </a>
            <p className="mt-8 max-w-sm font-serif text-sm text-[var(--ink-soft)] leading-relaxed">
              Nessuna newsletter, nessun cookie invadente: solo testo e calma.
            </p>
          </div>

          <div className="sm:text-right">
            <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-[var(--orange)]">
              Redazione
            </p>
            <nav className="mt-3 flex flex-col gap-2 sm:items-end">
              <Link
                href="/redazione"
                className="font-serif text-base text-[var(--ink)] underline decoration-[var(--ink)]/20 underline-offset-4 hover:decoration-[var(--ink)] transition-[text-decoration-color] duration-300"
              >
                Area riservata
              </Link>
              {session ? (
                <Link
                  href="/gestione"
                  className="font-sans text-xs uppercase tracking-[0.22em] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors duration-300"
                >
                  Gestione account
                </Link>
              ) : null}
              {session ? (
                <div className="mt-4 flex flex-col gap-1 sm:items-end">
                  <span className="font-sans text-xs text-[var(--ink-soft)]">
                    Connesso come {session.name}
                  </span>
                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      className="font-sans text-xs uppercase tracking-[0.22em] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors duration-300"
                    >
                      Esci
                    </button>
                  </form>
                </div>
              ) : null}
            </nav>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 pb-5 pt-3 sm:px-10 sm:pb-10">
          <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-[var(--ink-muted)]">
            {site.name}
          </p>
          <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-[var(--ink-faint)]">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
