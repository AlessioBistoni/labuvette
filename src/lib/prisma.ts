import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function isTursoDatabaseUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.startsWith("libsql://") || url.startsWith("https://");
}

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;
  const tursoUrl = process.env.TURSO_DATABASE_URL ?? databaseUrl;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  const log: ("error" | "warn")[] =
    process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];

  if (isTursoDatabaseUrl(tursoUrl) && tursoToken) {
    const libsql = createClient({
      url: tursoUrl!,
      authToken: tursoToken,
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter, log });
  }

  return new PrismaClient({ log });
}

function isClientUpToDate(client: PrismaClient | undefined): client is PrismaClient {
  if (!client || !("post" in client) || !("category" in client)) return false;
  return "section" in Prisma.PostScalarFieldEnum;
}

function getPrismaClient(): PrismaClient {
  const cached = globalForPrisma.prisma;
  if (isClientUpToDate(cached)) {
    return cached;
  }
  if (cached) {
    void (cached as PrismaClient).$disconnect().catch(() => undefined);
    globalForPrisma.prisma = undefined;
  }
  const client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

/** Client Prisma con accesso lazy: evita singleton obsoleti dopo migrate/generate in dev. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});
