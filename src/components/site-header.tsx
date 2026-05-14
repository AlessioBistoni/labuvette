import Link from "next/link";
import { getSession } from "@/lib/get-session";
import { site } from "@/config/site";

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur-sm supports-[backdrop-filter]:bg-[var(--paper)]/80">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-6 sm:gap-y-3 sm:px-10 sm:py-5">
        <Link href="/" className="group block">
          <span className="font-serif text-2xl tracking-tight text-[var(--orange)] group-hover:text-[#c96a24] transition-colors duration-300">
            {site.name}
          </span>
          <span className="mt-1 block font-sans text-[11px] uppercase tracking-[0.28em] text-[var(--ink-muted)]">
            {site.tagline}
          </span>
        </Link>
        <nav className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6">
          <Link
            href="/redazione"
            className="inline-flex items-center border border-[var(--ink)] bg-[var(--ink)] px-3 py-2 font-sans text-[10px] uppercase tracking-[0.18em] text-[var(--paper)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--ink)] sm:px-4"
          >
            Area Riservata
          </Link>
          {session?.role === "OWNER" ? (
            <Link
              href="/gestione"
              className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors duration-300"
            >
              Gestione amministratori
            </Link>
          ) : null}
          {session ? (
            <>
              <span className="hidden text-[var(--ink-faint)] sm:inline" aria-hidden>
                |
              </span>
              <span className="font-sans text-xs normal-case tracking-normal text-[var(--ink-soft)]">
                {session.name}
              </span>
              <form action="/api/auth/logout" method="POST" className="inline">
                <button
                  type="submit"
                  className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors duration-300"
                >
                  Esci
                </button>
              </form>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
