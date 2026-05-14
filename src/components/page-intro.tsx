"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { site } from "@/config/site";

export function PageIntro() {
  return (
    <motion.section
      className="mb-16 sm:mb-24"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="font-sans text-[10px] uppercase tracking-[0.38em] text-[var(--ink-muted)]">
        {site.name}
      </p>
      <h1
        className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--ink)] sm:text-5xl md:text-[3.25rem]"
        style={{
          fontFamily: "var(--font-playfair), ui-serif, Georgia, serif",
        }}
      >
        {site.description}
      </h1>
      <p className="mt-8 max-w-xl border-l border-[var(--ink)] pl-5 font-serif text-lg leading-relaxed text-[var(--ink-soft)]">
        Non prendiamo prenotazioni: arriviamo quando abbiamo qualcosa da
        condividere. Un articolo ogni dieci giorni, più o meno.
      </p>
      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.45 }}
      >
        <Link
          href="/redazione"
          className="inline-flex items-center border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-sans text-[10px] uppercase tracking-[0.26em] text-[var(--paper)] transition-colors hover:bg-transparent hover:text-[var(--ink)]"
        >
          Area Riservata
        </Link>
      </motion.div>
    </motion.section>
  );
}
