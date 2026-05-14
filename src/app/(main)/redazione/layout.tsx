import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";

export const metadata: Metadata = {
  title: "Redazione",
  robots: { index: false, follow: false },
};

export default async function RedazioneLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session) {
    redirect("/login?from=/redazione");
  }
  return <>{children}</>;
}
