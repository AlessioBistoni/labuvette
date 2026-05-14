import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ALESSIO_EMAIL = "alessio.bistoni@labuvette.local";
const ALESSIO_NAME = "Alessio Bistoni";
const ALESSIO_PASSWORD_HASH =
  "$2b$12$l/amlTaXIROTqQwXFzoRxugX/APFACCBMmwlZgx42JiBpW1UxbvY6";

async function main() {
  await prisma.admin.upsert({
    where: { email: ALESSIO_EMAIL },
    update: {},
    create: {
      email: ALESSIO_EMAIL,
      name: ALESSIO_NAME,
      passwordHash: ALESSIO_PASSWORD_HASH,
      role: "OWNER",
    },
  });
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
