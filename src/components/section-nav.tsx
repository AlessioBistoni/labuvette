"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SECTION_NAV } from "@/config/sections";

const ICON_SIZE = 48;

function sectionHref(id: string) {
  return `/?section=${encodeURIComponent(id)}`;
}

const itemClass =
  "group flex w-14 shrink-0 flex-col items-center gap-1.5 text-[var(--ink-muted)] transition-colors duration-300 ease-out hover:text-[var(--ink)] sm:w-16";

const frameClass =
  "relative box-border block h-11 w-11 shrink-0 overflow-hidden border-2 border-[var(--ink)] bg-[var(--paper)] transition-[transform,box-shadow] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.06] group-hover:shadow-[0_2px_0_0_var(--ink)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:shadow-none sm:h-12 sm:w-12";

const imageClass =
  "object-cover object-center grayscale contrast-[1.05] transition-[filter] duration-300 ease-out group-hover:grayscale-0 motion-reduce:transition-none";

const labelClass =
  "block w-full text-center font-sans text-[8px] uppercase leading-none tracking-[0.2em] transition-transform duration-300 ease-out group-hover:translate-y-px sm:text-[9px]";

export function SectionNav() {
  const searchParams = useSearchParams();
  const active = searchParams.get("section");

  return (
    <nav
      className="mt-4 flex flex-wrap items-end justify-center gap-5 sm:mt-5 sm:gap-8"
      aria-label="Sezioni del blog"
    >
      {SECTION_NAV.map((item) => {
        const isActive = active === item.id;
        return (
          <Link
            key={item.id}
            href={sectionHref(item.id)}
            className={`${itemClass} ${isActive ? "text-[var(--ink)]" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span
              className={`${frameClass} ${
                isActive
                  ? "-translate-y-0.5 scale-[1.04] shadow-[0_2px_0_0_var(--ink)]"
                  : ""
              }`}
            >
              <Image
                src={item.icon}
                alt=""
                width={ICON_SIZE}
                height={ICON_SIZE}
                sizes={`${ICON_SIZE}px`}
                className={`${imageClass} ${isActive ? "grayscale-0" : ""}`}
              />
            </span>
            <span className={labelClass}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function SectionNavFallback() {
  return (
    <nav
      className="mt-4 flex flex-wrap items-end justify-center gap-5 sm:mt-5 sm:gap-8"
      aria-hidden
    >
      {SECTION_NAV.map((item) => (
        <div key={item.id} className={itemClass}>
          <span className={`${frameClass} bg-[var(--cream-dark)]`} />
          <span className="block h-2 w-full bg-[var(--cream-dark)]" />
        </div>
      ))}
    </nav>
  );
}
