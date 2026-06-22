import { execSync } from "child_process";
import { prisma } from "../src/lib/prisma";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} non configurata.`);
  return value;
}

async function main() {
  const adminUsername = requiredEnv("SEED_ADMIN_USERNAME");
  const adminName = requiredEnv("SEED_ADMIN_NAME");
  const adminPasswordHash = requiredEnv("SEED_ADMIN_PASSWORD_HASH");

  await prisma.admin.upsert({
    where: { username: adminUsername },
    update: {
      name: adminName,
      passwordHash: adminPasswordHash,
      role: "OWNER",
    },
    create: {
      username: adminUsername,
      name: adminName,
      passwordHash: adminPasswordHash,
      role: "OWNER",
    },
  });

  execSync("tsx prisma/import-posts.ts", { stdio: "inherit", cwd: process.cwd() });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
