import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/get-session";
import { createAdminAction, updateOwnAccountAction } from "./actions";
import { DeleteAdminForm } from "./delete-admin-form";

type Props = {
  searchParams: Promise<{
    created?: string;
    deleted?: string;
    updated?: string;
    err?: string;
  }>;
};

function errMessage(code: string | undefined) {
  switch (code) {
    case "username":
      return "Il nome non è valido: usa almeno 3 caratteri con lettere o numeri.";
    case "name":
      return "Il nome deve avere almeno 2 caratteri.";
    case "pwd":
      return "La password è obbligatoria.";
    case "pwdmatch":
      return "Le due password non coincidono.";
    case "pwdshort":
      return "La nuova password deve avere almeno 8 caratteri.";
    case "taken":
      return "Questo nome è già in uso.";
    case "missing":
      return "Account non trovato.";
    case "owner":
      return "Non puoi eliminare un proprietario.";
    case "self":
      return "Non puoi eliminare il tuo account da qui.";
    default:
      return null;
  }
}

export default async function GestionePage({ searchParams }: Props) {
  const sp = await searchParams;
  const session = await getSession();
  const adminsRaw = await prisma.admin.findMany({
    orderBy: { createdAt: "asc" },
  });
  const admins = [...adminsRaw].sort((a, b) => {
    if (a.role === b.role) return 0;
    return a.role === "OWNER" ? -1 : 1;
  });
  const alert = errMessage(sp.err);
  const created = sp.created === "1";
  const deleted = sp.deleted === "1";
  const updated = sp.updated === "1";
  const isOwner = session?.role === "OWNER";
  const currentAdmin = adminsRaw.find((a) => a.id === session?.sub);

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
          Area riservata
        </p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-[var(--ink)]">
          Gestione account
        </h1>
        <p className="mt-4 max-w-xl font-serif text-lg leading-relaxed text-[var(--ink-soft)]">
          Cambia liberamente il nome con cui accedi e la password. Il campo{" "}
          <strong className="font-semibold text-[var(--ink)]">Nome</strong> è
          l’unico identificativo dell’account.
        </p>
      </header>

      {deleted ? (
        <p
          className="mt-8 rounded border border-[var(--line)] bg-[var(--cream-dark)]/60 px-4 py-3 font-sans text-sm text-[var(--ink)]"
          role="status"
        >
          Account amministratore eliminato.
        </p>
      ) : null}

      {created ? (
        <p
          className="mt-8 rounded border border-[var(--line)] bg-[var(--cream-dark)]/60 px-4 py-3 font-sans text-sm text-[var(--ink)]"
          role="status"
        >
          Nuovo amministratore creato. Comunica nome e password usati qui per il
          primo accesso.
        </p>
      ) : null}

      {updated ? (
        <p
          className="mt-8 rounded border border-[var(--line)] bg-[var(--cream-dark)]/60 px-4 py-3 font-sans text-sm text-[var(--ink)]"
          role="status"
        >
          Account aggiornato.
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
          Il tuo account
        </h2>
        <form action={updateOwnAccountAction} className="mt-6 max-w-lg space-y-6">
          <div>
            <label
              htmlFor="account-name"
              className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]"
            >
              Nome
            </label>
            <input
              id="account-name"
              name="name"
              required
              minLength={2}
              maxLength={64}
              autoComplete="username"
              defaultValue={currentAdmin?.name ?? session?.name ?? ""}
              className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-serif text-lg text-[var(--ink)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--wine)]/25"
            />
            <p className="mt-2 font-sans text-xs leading-relaxed text-[var(--ink-soft)]">
              Userai questo nome per accedere al sito.
            </p>
          </div>
          <div>
            <label
              htmlFor="account-password"
              className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]"
            >
              Nuova password
            </label>
            <input
              id="account-password"
              name="password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              placeholder="Lascia vuoto per non cambiarla"
              className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-serif text-lg text-[var(--ink)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--wine)]/25"
            />
          </div>
          <div>
            <label
              htmlFor="account-password-confirm"
              className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]"
            >
              Ripeti nuova password
            </label>
            <input
              id="account-password-confirm"
              name="passwordConfirm"
              type="password"
              minLength={8}
              autoComplete="new-password"
              className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-serif text-lg text-[var(--ink)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--wine)]/25"
            />
          </div>
          <button
            type="submit"
            className="border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-sans text-xs uppercase tracking-[0.2em] text-[var(--paper)] transition-colors hover:border-[var(--wine)] hover:bg-[var(--wine)]"
          >
            Salva account
          </button>
        </form>
      </section>

      {isOwner ? (
        <>
          <section className="mt-16 border-t border-[var(--line)] pt-12">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
              Account esistenti
            </h2>
            <ul className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {admins.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div>
                    <p className="font-serif text-xl text-[var(--ink)]">{a.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                      {a.role === "OWNER" ? "Proprietario" : "Amministratore"}
                    </span>
                    {a.role === "ADMIN" && a.id !== session?.sub ? (
                      <DeleteAdminForm adminId={a.id} name={a.name} />
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16 border-t border-[var(--line)] pt-12">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
              Nuovo amministratore
            </h2>
            <form action={createAdminAction} className="mt-6 max-w-lg space-y-6">
              <div>
                <label
                  htmlFor="g-name"
                  className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]"
                >
                  Nome
                </label>
                <input
                  id="g-name"
                  name="name"
                  required
                  minLength={2}
                  maxLength={64}
                  autoComplete="username"
                  className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-serif text-lg text-[var(--ink)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--wine)]/25"
                />
              </div>
              <div>
                <label
                  htmlFor="g-password"
                  className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]"
                >
                  Password
                </label>
                <input
                  id="g-password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-serif text-lg text-[var(--ink)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--wine)]/25"
                />
              </div>
              <button
                type="submit"
                className="border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-sans text-xs uppercase tracking-[0.2em] text-[var(--paper)] transition-colors hover:border-[var(--wine)] hover:bg-[var(--wine)]"
              >
                Crea account
              </button>
            </form>
          </section>
        </>
      ) : null}
    </main>
  );
}
