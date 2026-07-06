import { site } from "@/config/site";
import type { PostSection } from "@/config/sections";
import { playfairStyle } from "@/lib/typography";

type Props = {
  activeSection?: PostSection | null;
};

export function PageIntro({ activeSection = null }: Props) {
  return (
    <section className="mb-16 sm:mb-32">
      <p className="font-sans text-[10px] uppercase tracking-[0.38em] text-[var(--orange)] sm:tracking-[0.52em]">
        {activeSection ?? site.name}
      </p>
      <h1
        className="mt-7 max-w-[58rem] text-[2rem] font-semibold leading-[1.18] tracking-normal text-[var(--ink)] sm:mt-10 sm:text-[2.65rem] sm:leading-[1.18] md:text-[2.9rem] lg:text-[3.1rem]"
        style={playfairStyle}
      >
        {activeSection ? (
          activeSection
        ) : (
          <>
            {site.heroTitle[0]}
            <br />
            {site.heroTitle[1]}
          </>
        )}
      </h1>
      <p className="mt-10 max-w-[42rem] border-l border-[var(--ink)] pl-5 font-serif text-[1.05rem] leading-[2] text-[var(--ink-soft)] sm:mt-14 sm:pl-9 sm:text-lg sm:leading-[2.1] md:text-[1.22rem]">
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
