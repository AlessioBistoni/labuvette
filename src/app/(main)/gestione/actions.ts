"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/get-session";
import {
  SESSION_COOKIE,
  createSessionToken,
  getSessionCookieOptions,
} from "@/lib/session";
import { sanitizeUsername } from "@/lib/username";

function normalizeName(raw: FormDataEntryValue | null): string {
  return String(raw ?? "").trim().replace(/\s+/g, " ");
}

async function nameTakenByAnother(name: string, username: string, currentId?: string) {
  const admins = await prisma.admin.findMany({
    select: { id: true, name: true, username: true },
  });
  const lowerName = name.toLowerCase();
  const lowerUsername = username.toLowerCase();

  return admins.some((admin) => {
    if (admin.id === currentId) return false;
    return (
      admin.name.trim().toLowerCase() === lowerName ||
      admin.username.trim().toLowerCase() === lowerUsername
    );
  });
}

export async function createAdminAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "OWNER") {
    redirect("/?forbidden=1");
  }

  const name = normalizeName(formData.get("name"));
  const username = sanitizeUsername(name);
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
  if (password.length < 8) {
    redirect("/gestione?err=pwdshort");
  }

  if (await nameTakenByAnother(name, username)) {
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

export async function updateOwnAccountAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/login?from=/gestione");
  }

  const name = normalizeName(formData.get("name"));
  const username = sanitizeUsername(name);
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (!username) {
    redirect("/gestione?err=username");
  }
  if (name.length < 2) {
    redirect("/gestione?err=name");
  }
  if ((password || passwordConfirm) && password !== passwordConfirm) {
    redirect("/gestione?err=pwdmatch");
  }
  if (password && password.length < 8) {
    redirect("/gestione?err=pwdshort");
  }
  if (await nameTakenByAnother(name, username, session.sub)) {
    redirect("/gestione?err=taken");
  }

  const current = await prisma.admin.findUnique({ where: { id: session.sub } });
  if (!current) {
    redirect("/gestione?err=missing");
  }

  const updated = await prisma.admin.update({
    where: { id: session.sub },
    data: {
      name,
      username,
      ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}),
    },
  });

  const token = await createSessionToken({
    sub: updated.id,
    username: updated.username,
    name: updated.name,
    role: updated.role === "OWNER" ? "OWNER" : "ADMIN",
  });
  if (token) {
    (await cookies()).set(SESSION_COOKIE, token, getSessionCookieOptions());
  }

  revalidatePath("/gestione");
  redirect("/gestione?updated=1");
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
