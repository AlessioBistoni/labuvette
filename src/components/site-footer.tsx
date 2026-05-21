import Link from "next/link";
import { getSession } from "@/lib/get-session";
import { site } from "@/config/site";
import { splitSmClass } from "@/lib/typography";

export async function SiteFooter() {
  const session = await getSession();

  return (
    <footer className="mt-28 border-t border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 sm:gap-12 sm:px-10">
        <div>
          <p
            className={`text-[11px] uppercase tracking-[0.28em] ${splitSmClass}`}
          >
            Contatti
          </p>
          <a
            href={`mailto:${site.contactEmail}`}
            className="mt-3 inline-block text-lg text-[var(--ink)] underline decoration-[var(--ink)]/20 underline-offset-4 hover:decoration-[var(--ink)] transition-[text-decoration-color] duration-300"
          >
            {site.contactEmail}
          </a>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-[var(--ink-soft)]">
            Nessuna newsletter, nessun cookie invadente: solo testo e calma.
          </p>
        </div>

        <div className="sm:text-right">
          <p
            className={`text-[11px] uppercase tracking-[0.28em] ${splitSmClass}`}
          >
            Redazione
          </p>
          <nav className="mt-3 flex flex-col gap-2 sm:items-end">
            <Link
              href="/redazione"
              className="text-base text-[var(--ink)] underline decoration-[var(--ink)]/20 underline-offset-4 hover:decoration-[var(--ink)] transition-[text-decoration-color] duration-300"
            >
              Area riservata
            </Link>
            {session?.role === "OWNER" ? (
              <Link
                href="/gestione"
                className={`text-xs uppercase tracking-[0.22em] hover:text-[var(--ink)] transition-colors duration-300 ${splitSmClass}`}
              >
                Gestione amministratori
              </Link>
            ) : null}
            {session ? (
              <div className="mt-4 flex flex-col gap-1 sm:items-end">
                <span className="text-xs text-[var(--ink-soft)]">
                  Connesso come {session.name}
                </span>
                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className={`text-xs uppercase tracking-[0.22em] hover:text-[var(--ink)] transition-colors duration-300 ${splitSmClass}`}
                  >
                    Esci
                  </button>
                </form>
              </div>
            ) : null}
          </nav>
        </div>
      </div>

      <div className="border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-10">
          <p className={`text-[10px] uppercase tracking-[0.28em] ${splitSmClass}`}>
            {site.name}
          </p>
          <p className={`text-[10px] uppercase tracking-[0.28em] text-[var(--ink-faint)] ${splitSmClass}`}>
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
