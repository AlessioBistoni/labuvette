import { POST_SECTIONS } from "@/config/sections";

type Props = {
  name?: string;
  defaultValue?: string;
  required?: boolean;
};

export function SectionSelect({
  name = "section",
  defaultValue = "",
  required = true,
}: Props) {
  return (
    <div>
      <label
        htmlFor="section"
        className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]"
      >
        Sezione
      </label>
      <select
        id="section"
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-sans text-sm text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--wine)]/25"
      >
        {!required ? <option value="">— Nessuna —</option> : null}
        {POST_SECTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
