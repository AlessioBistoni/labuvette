/**
 * Ottimizza tutte le copertine in public/uploads/posts/ (WebP, ridimensionate).
 * Aggiorna i path nel database se cambia l'estensione.
 *
 * Esegui: npm run optimize-uploads
 */
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { optimizeCoverFile } from "../src/lib/optimize-image";

const prisma = new PrismaClient();
const UPLOADS_DIR = path.join(process.cwd(), "public/uploads/posts");

const IMAGE_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".heic",
  ".heif",
]);

async function main() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.log("Nessuna cartella uploads da ottimizzare.");
    return;
  }

  const files = fs
    .readdirSync(UPLOADS_DIR)
    .filter((f) => f !== ".gitkeep" && IMAGE_EXT.has(path.extname(f).toLowerCase()));

  let count = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const base = path.basename(file, ext);
    const src = path.join(UPLOADS_DIR, file);
    const destName = `${base}.webp`;
    const dest = path.join(UPLOADS_DIR, destName);
    const oldPublic = `/uploads/posts/${file}`;
    const newPublic = `/uploads/posts/${destName}`;
    const beforeKb = Math.round(fs.statSync(src).size / 1024);

    const tmp = path.join(UPLOADS_DIR, `${base}.opt.tmp.webp`);
    await optimizeCoverFile(src, tmp);
    fs.renameSync(tmp, dest);

    if (file !== destName && fs.existsSync(src)) {
      fs.unlinkSync(src);
    }

    if (oldPublic !== newPublic) {
      const updated = await prisma.post.updateMany({
        where: { cover: oldPublic },
        data: { cover: newPublic },
      });
      if (updated.count > 0) {
        console.log(`DB aggiornato: ${oldPublic} → ${newPublic}`);
      }
    }

    const afterKb = Math.round(fs.statSync(dest).size / 1024);
    console.log(`Ottimizzato: ${destName} (${beforeKb} KB → ${afterKb} KB)`);
    count += 1;
  }

  console.log(`Completato (${count} immagini).`);
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
