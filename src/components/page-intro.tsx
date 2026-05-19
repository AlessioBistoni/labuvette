import { site } from "@/config/site";
import type { PostSection } from "@/config/sections";

type Props = {
  activeSection?: PostSection | null;
};

export function PageIntro({ activeSection = null }: Props) {
  return (
    <section className="mb-10 sm:mb-20">
      <p className="font-sans text-[10px] uppercase tracking-[0.38em] text-[var(--orange)]">
        {activeSection ?? site.name}
      </p>
      <h1
        className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight text-[var(--ink)] sm:mt-5 sm:text-5xl md:text-[3.25rem]"
        style={{
          fontFamily: "var(--font-playfair), ui-serif, Georgia, serif",
        }}
      >
        {activeSection ? activeSection : site.description}
      </h1>
      <p className="mt-6 max-w-xl border-l border-[var(--ink)] pl-4 font-serif text-base leading-relaxed text-[var(--ink-soft)] sm:mt-8 sm:pl-5 sm:text-lg">
        {activeSection
          ? `Articoli nella sezione ${activeSection}.`
          : "Non prendiamo prenotazioni: arriviamo quando abbiamo qualcosa da condividere. Un articolo ogni dieci giorni, più o meno."}
      </p>
    </section>
  );
}
