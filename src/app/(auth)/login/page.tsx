import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { safeInternalPath } from "@/lib/redirect";
import {
  SESSION_COOKIE,
  verifySessionToken,
  hasProductionAuthConfig,
} from "@/lib/session";

type Props = {
  searchParams: Promise<{
    error?: string;
    from?: string;
  }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const user = token ? await verifySessionToken(token) : null;

  if (user) {
    redirect(safeInternalPath(sp.from ?? null));
  }

  const from = safeInternalPath(sp.from ?? null);
  const showError = sp.error === "1";
  const showConfigError = sp.error === "config";
  const missingProdSecret =
    process.env.NODE_ENV === "production" && !hasProductionAuthConfig();

  return (
    <div className="w-full max-w-md">
      <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-[var(--ink-muted)]">
        Accesso riservato
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-[var(--ink)]">
        Accedi
      </h1>
      <p className="mt-4 font-serif text-lg leading-relaxed text-[var(--ink-soft)]">
        Accedi con nome e password per aprire la redazione.
      </p>

      {missingProdSecret ? (
        <p
          className="mt-6 rounded border border-[var(--wine)]/30 bg-[var(--cream-dark)] px-4 py-3 font-sans text-sm text-[var(--wine)]"
          role="alert"
        >
          In produzione imposta{" "}
          <code className="font-mono text-xs">AUTH_SECRET</code> (almeno 32
          caratteri) sul server.
        </p>
      ) : null}

      {showConfigError ? (
        <p
          className="mt-6 rounded border border-[var(--wine)]/30 bg-[var(--cream-dark)] px-4 py-3 font-sans text-sm text-[var(--wine)]"
          role="alert"
        >
          Configurazione incompleta: verifica{" "}
          <code className="font-mono text-xs">DATABASE_URL</code> e che il
          database sia stato inizializzato (
          <code className="font-mono text-xs">npx prisma migrate dev</code> e{" "}
          <code className="font-mono text-xs">npx prisma db seed</code>).
        </p>
      ) : null}

      {showError ? (
        <p
          className="mt-6 rounded border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-sans text-sm text-[var(--ink-soft)]"
          role="status"
        >
          Nome o password non corretti.
        </p>
      ) : null}

      <form
        method="POST"
        action="/api/auth/login"
        className="mt-10 space-y-6 border-t border-[var(--line)] pt-10"
      >
        <input type="hidden" name="from" value={from} />
        <div>
          <label
            htmlFor="name"
            className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]"
          >
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="username"
            required
            className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-serif text-lg text-[var(--ink)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--wine)]/25"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-serif text-lg text-[var(--ink)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--wine)]/25"
          />
        </div>
        <button
          type="submit"
          disabled={missingProdSecret}
          className="w-full border border-[var(--ink)] bg-[var(--ink)] px-4 py-3 font-sans text-xs uppercase tracking-[0.2em] text-[var(--paper)] transition-colors hover:bg-[var(--wine)] hover:border-[var(--wine)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Entra
        </button>
      </form>
    </div>
  );
}
