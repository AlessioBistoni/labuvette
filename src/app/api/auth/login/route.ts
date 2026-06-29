import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { redirectToPath } from "@/lib/redirect-response";
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
    return redirectToPath(request, "/login?error=config");
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return redirectToPath(request, "/login?error=1");
  }

  const name = String(form.get("name") ?? form.get("username") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const fromRaw = form.get("from");
  const from =
    typeof fromRaw === "string" ? safeInternalPath(fromRaw) : "/";

  if (!name || !password) {
    return redirectToPath(request, "/login?error=1");
  }

  let admin;
  try {
    const normalizedName = name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_-]/g, "")
      .replace(/_+/g, "_")
      .replace(/^[-_]|[-_]$/g, "");

    admin = await prisma.admin.findFirst({
      where: {
        OR: [{ name }, { username: normalizedName }],
      },
    });
  } catch {
    return redirectToPath(request, "/login?error=config");
  }

  if (!admin) {
    return redirectToPath(request, "/login?error=1");
  }

  const passwordOk = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordOk) {
    return redirectToPath(request, "/login?error=1");
  }

  const session: SessionPayload = {
    sub: admin.id,
    username: admin.username,
    name: admin.name,
    role: admin.role === "OWNER" ? "OWNER" : "ADMIN",
  };

  const token = await createSessionToken(session);
  if (!token) {
    return redirectToPath(request, "/login?error=config");
  }

  const res = redirectToPath(request, from);
  res.cookies.set(SESSION_COOKIE, token, getSessionCookieOptions());
  return res;
}
