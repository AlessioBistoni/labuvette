"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { SectionNav, SectionNavFallback } from "@/components/section-nav";
import { site } from "@/config/site";

const LOGO = {
  mobile: { src: "/brand/labuvette-awing-mobile.png", width: 800, height: 130 },
  desktop: { src: "/brand/labuvette-awing-desktop.png", width: 1632, height: 220 },
} as const;

function isAdminArea(pathname: string) {
  return (
    pathname.startsWith("/redazione") ||
    pathname.startsWith("/gestione")
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const showSections = !isAdminArea(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur-sm supports-[backdrop-filter]:bg-[var(--paper)]/80">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-10 sm:py-8">
        <Link
          href="/"
          aria-label={`${site.name} — torna alla home`}
          className="group block w-full"
        >
          <div className="-mx-4 h-[3.75rem] w-[calc(100%+2rem)] overflow-hidden sm:-mx-10 sm:h-[6.875rem] sm:w-[calc(100%+5rem)]">
            <Image
              src={LOGO.desktop.src}
              alt=""
              width={LOGO.desktop.width}
              height={LOGO.desktop.height}
              priority
              className="hidden h-full w-full origin-center scale-x-[1.45] object-contain object-center sm:block"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <Image
              src={LOGO.mobile.src}
              alt=""
              width={LOGO.mobile.width}
              height={LOGO.mobile.height}
              priority
              className="h-full w-full origin-center scale-x-[1.2] object-contain object-center sm:hidden"
              sizes="100vw"
            />
          </div>
          <span className="sr-only">{site.name}</span>
        </Link>

        {showSections ? (
          <Suspense fallback={<SectionNavFallback />}>
            <SectionNav />
          </Suspense>
        ) : null}
      </div>
    </header>
  );
}
