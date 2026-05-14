import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE,
  createSessionToken,
  getSessionCookieOptions,
  hasProductionAuthConfig,
} from "@/lib/session";
import type { SessionPayload } from "@/lib/session";
import { safeInternalPath } from "@/lib/redirect";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production" && !hasProductionAuthConfig()) {
    return NextResponse.json(
      { error: "Autenticazione non configurata (AUTH_SECRET)." },
      { status: 503 },
    );
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.redirect(new URL("/login?error=config", request.url), 303);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.redirect(new URL("/login?error=1", request.url), 303);
  }

  const username = String(form.get("username") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const fromRaw = form.get("from");
  const from =
    typeof fromRaw === "string" ? safeInternalPath(fromRaw) : "/";

  if (!username || !password) {
    return NextResponse.redirect(new URL("/login?error=1", request.url), 303);
  }

  let admin;
  try {
    admin = await prisma.admin.findUnique({ where: { username } });
  } catch {
    return NextResponse.redirect(new URL("/login?error=config", request.url), 303);
  }

  if (!admin) {
    return NextResponse.redirect(new URL("/login?error=1", request.url), 303);
  }

  const passwordOk = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordOk) {
    return NextResponse.redirect(new URL("/login?error=1", request.url), 303);
  }

  const session: SessionPayload = {
    sub: admin.id,
    username: admin.username,
    name: admin.name,
    role: admin.role === "OWNER" ? "OWNER" : "ADMIN",
  };

  const token = await createSessionToken(session);
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=config", request.url), 303);
  }

  const res = NextResponse.redirect(new URL(from, request.url), 303);
  res.cookies.set(SESSION_COOKIE, token, getSessionCookieOptions());
  return res;
}
