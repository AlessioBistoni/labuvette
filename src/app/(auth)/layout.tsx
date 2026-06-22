import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <Link
        href="/"
        className="fixed left-0 top-0 z-50 inline-flex items-center gap-2 p-4 font-sans text-sm font-normal uppercase tracking-[0.26em] text-[var(--ink)] transition-colors hover:text-[var(--ink-soft)] sm:p-5 sm:text-base"
        aria-label="Torna alla home"
      >
        <span className="leading-none" aria-hidden>
          ←
        </span>
        <span className="leading-none">Home</span>
      </Link>
      {children}
    </div>
  );
}
