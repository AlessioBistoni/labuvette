import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createAdminAction } from "./actions";

type Props = {
  searchParams: Promise<{
    created?: string;
    err?: string;
  }>;
};

function errMessage(code: string | undefined) {
  switch (code) {
    case "email":
      return "Inserisci un indirizzo email valido.";
    case "name":
      return "Il nome deve avere almeno 2 caratteri.";
    case "pwd":
      return "La password deve avere almeno 12 caratteri.";
    case "taken":
      return "Questa email è già registrata.";
    default:
      return null;
  }
}

export default async function GestionePage({ searchParams }: Props) {
  const sp = await searchParams;
  const adminsRaw = await prisma.admin.findMany({
    orderBy: { createdAt: "asc" },
  });
  const admins = [...adminsRaw].sort((a, b) => {
    if (a.role === b.role) return 0;
    return a.role === "OWNER" ? -1 : 1;
  });
  const alert = errMessage(sp.err);
  const created = sp.created === "1";

  return (
    <main className="mx-auto max-w-2xl px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
      <Link
        href="/"
        className="font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)] hover:text-[var(--wine)] transition-colors duration-300"
      >
        ← Home
      </Link>

      <header className="mt-8 border-b border-[var(--line)] pb-10">
        <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-[var(--ink-muted)]">
          Solo proprietario
        </p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-[var(--ink)]">
          Gestione amministratori
        </h1>
        <p className="mt-4 max-w-xl font-serif text-lg leading-relaxed text-[var(--ink-soft)]">
          Crea account per gli altri amici: avranno accesso al sito come{" "}
          <strong className="font-semibold text-[var(--ink)]">amministratori</strong>
          , ma non potranno entrare in questa pagina.
        </p>
      </header>

      {created ? (
        <p
          className="mt-8 rounded border border-[var(--line)] bg-[var(--cream-dark)]/60 px-4 py-3 font-sans text-sm text-[var(--ink)]"
          role="status"
        >
          Nuovo amministratore creato. Comunica loro email e password usate qui per
          il primo accesso.
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
          Account esistenti
        </h2>
        <ul className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {admins.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-baseline justify-between gap-3 py-4"
            >
              <div>
                <p className="font-serif text-xl text-[var(--ink)]">{a.name}</p>
                <p className="mt-1 font-sans text-sm text-[var(--ink-soft)]">
                  {a.email}
                </p>
              </div>
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                {a.role === "OWNER" ? "Proprietario" : "Amministratore"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 border-t border-[var(--line)] pt-12">
        <h2 className="font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
          Nuovo amministratore
        </h2>
        <form action={createAdminAction} className="mt-6 space-y-6 max-w-lg">
          <div>
            <label
              htmlFor="g-name"
              className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]"
            >
              Nome completo
            </label>
            <input
              id="g-name"
              name="name"
              required
              minLength={2}
              autoComplete="name"
              className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-serif text-lg text-[var(--ink)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--wine)]/25"
            />
          </div>
          <div>
            <label
              htmlFor="g-email"
              className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]"
            >
              Email (usata per accedere)
            </label>
            <input
              id="g-email"
              name="email"
              type="email"
              required
              autoComplete="off"
              className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-serif text-lg text-[var(--ink)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--wine)]/25"
            />
          </div>
          <div>
            <label
              htmlFor="g-password"
              className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]"
            >
              Password iniziale (min. 12 caratteri)
            </label>
            <input
              id="g-password"
              name="password"
              type="password"
              required
              minLength={12}
              autoComplete="new-password"
              className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-serif text-lg text-[var(--ink)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--wine)]/25"
            />
          </div>
          <button
            type="submit"
            className="border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-sans text-xs uppercase tracking-[0.2em] text-[var(--paper)] transition-colors hover:bg-[var(--wine)] hover:border-[var(--wine)]"
          >
            Crea account
          </button>
        </form>
      </section>
    </main>
  );
}
