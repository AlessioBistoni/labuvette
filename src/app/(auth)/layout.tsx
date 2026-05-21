import Link from "next/link";
import { splitSmClass } from "@/lib/typography";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <Link
        href="/"
        className={`fixed left-0 top-0 z-50 inline-flex items-center gap-2 p-4 text-sm font-normal tracking-[0.26em] transition-opacity hover:opacity-70 sm:p-5 sm:text-base ${splitSmClass}`}
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
