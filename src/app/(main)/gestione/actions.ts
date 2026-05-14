"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/get-session";
import { sanitizeUsername } from "@/lib/username";

export async function createAdminAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "OWNER") {
    redirect("/?forbidden=1");
  }

  const username = sanitizeUsername(String(formData.get("username") ?? ""));
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username) {
    redirect("/gestione?err=username");
  }
  if (name.length < 2) {
    redirect("/gestione?err=name");
  }
  if (!password) {
    redirect("/gestione?err=pwd");
  }

  const exists = await prisma.admin.findUnique({ where: { username } });
  if (exists) {
    redirect("/gestione?err=taken");
  }

  await prisma.admin.create({
    data: {
      username,
      name,
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
  });

  revalidatePath("/gestione");
  redirect("/gestione?created=1");
}

export async function deleteAdminAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "OWNER") {
    redirect("/?forbidden=1");
  }

  const adminId = String(formData.get("adminId") ?? "").trim();
  if (!adminId) {
    redirect("/gestione?err=missing");
  }

  const target = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!target) {
    redirect("/gestione?err=missing");
  }
  if (target.role === "OWNER") {
    redirect("/gestione?err=owner");
  }
  if (target.id === session.sub) {
    redirect("/gestione?err=self");
  }

  await prisma.admin.delete({ where: { id: adminId } });

  revalidatePath("/gestione");
  redirect("/gestione?deleted=1");
}
