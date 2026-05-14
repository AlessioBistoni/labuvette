import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";

export default async function GestioneLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session || session.role !== "OWNER") {
    redirect("/?forbidden=1");
  }
  return <>{children}</>;
}
