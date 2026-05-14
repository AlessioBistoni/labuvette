"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/get-session";

export async function createAdminAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "OWNER") {
    redirect("/?forbidden=1");
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !email.includes("@")) {
    redirect("/gestione?err=email");
  }
  if (name.length < 2) {
    redirect("/gestione?err=name");
  }
  if (password.length < 12) {
    redirect("/gestione?err=pwd");
  }

  const exists = await prisma.admin.findUnique({ where: { email } });
  if (exists) {
    redirect("/gestione?err=taken");
  }

  await prisma.admin.create({
    data: {
      email,
      name,
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
  });

  revalidatePath("/gestione");
  redirect("/gestione?created=1");
}
