"use client";

import { deletePostAction } from "./actions";

type Props = {
  slug: string;
};

export function DeletePostForm({ slug }: Props) {
  return (
    <form
      action={deletePostAction}
      className="mt-10 border-t border-[var(--line)] pt-8"
      onSubmit={(e) => {
        if (
          !confirm(
            "Eliminare definitivamente questo articolo dal database? L’operazione non è annullabile.",
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--wine)] underline decoration-[var(--wine)]/30 underline-offset-4 hover:decoration-[var(--wine)]"
      >
        Elimina articolo
      </button>
    </form>
  );
}
