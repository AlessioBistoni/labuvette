type Props = {
  categories: string[];
  name?: string;
  defaultValue?: string;
  required?: boolean;
};

export function SectionSelect({
  categories,
  name = "section",
  defaultValue = "",
  required = false,
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
        <option value="">Nessuna categoria</option>
        {categories.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
