import { site } from "@/config/site";
import type { PostSection } from "@/config/sections";
import { playfairStyle } from "@/lib/typography";

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
        className="mt-6 max-w-3xl text-[2rem] font-semibold leading-[1.18] tracking-normal text-[var(--ink)] sm:mt-8 sm:text-[2.75rem] sm:leading-[1.16] md:text-[3rem]"
        style={playfairStyle}
      >
        {activeSection ? activeSection : site.description}
      </h1>
      <p className="mt-10 max-w-2xl border-l border-[var(--ink)] pl-5 font-serif text-[1.05rem] leading-[2] text-[var(--ink-soft)] sm:mt-12 sm:pl-8 sm:text-lg sm:leading-[2.05]">
        {activeSection
          ? `Articoli nella sezione ${activeSection}.`
          : (
              <>
                {site.intro[0]}
                <br />
                {site.intro[1]}
              </>
            )}
      </p>
    </section>
  );
}
