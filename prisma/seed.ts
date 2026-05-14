import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

const prisma = new PrismaClient();

const ALESSIO_USERNAME = "alessio";
const ALESSIO_NAME = "Alessio Bistoni";
const ALESSIO_PASSWORD_HASH =
  "$2b$12$l/amlTaXIROTqQwXFzoRxugX/APFACCBMmwlZgx42JiBpW1UxbvY6";

async function main() {
  await prisma.$executeRaw`
    UPDATE Admin SET username = 'alessio' WHERE username = 'alessio_bistoni'
  `;

  await prisma.admin.upsert({
    where: { username: ALESSIO_USERNAME },
    update: {},
    create: {
      username: ALESSIO_USERNAME,
      name: ALESSIO_NAME,
      passwordHash: ALESSIO_PASSWORD_HASH,
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
