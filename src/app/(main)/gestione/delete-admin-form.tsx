"use client";

import { deleteAdminAction } from "./actions";

type Props = {
  adminId: string;
  username: string;
};

export function DeleteAdminForm({ adminId, username }: Props) {
  return (
    <form
      action={deleteAdminAction}
      className="shrink-0"
      onSubmit={(e) => {
        if (
          !confirm(
            `Eliminare definitivamente l’account @${username}? L’operazione non è annullabile.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="adminId" value={adminId} />
      <button
        type="submit"
        className="font-sans text-[10px] uppercase tracking-[0.18em] text-[var(--wine)] underline decoration-[var(--wine)]/30 underline-offset-4 hover:decoration-[var(--wine)]"
      >
        Elimina
      </button>
    </form>
  );
}
