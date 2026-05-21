import type { Viewport } from "next";
import type { Metadata } from "next";
import { Bebas_Neue, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";

const ui = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-ui",
  display: "swap",
});

const post = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-post",
  display: "swap",
});

/** Titoli e scritte del sito — effetto split (metà superiore chiara, metà inferiore piena). */
const display = Bebas_Neue({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${ui.variable} ${post.variable} ${display.variable} min-h-dvh antialiased`}
    >
      <body className="flex min-h-dvh flex-col overflow-x-hidden">{children}</body>
    </html>
  );
}
