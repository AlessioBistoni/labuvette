/**
 * Importa articoli da content/posts/*.md nel database.
 * Copia le copertine locali su Blob in produzione o negli upload locali in sviluppo.
 * Esegui: npx tsx prisma/import-posts.ts
 */
import "../src/lib/load-env";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { copyPublicAssetToUploads } from "../src/lib/uploads";
import { prisma } from "../src/lib/prisma";

const postsDir = path.join(process.cwd(), "content/posts");

function sanitizeCover(raw: unknown): string | undefined {
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  const s = raw.trim();
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  if (s.startsWith("https://")) return s;
  return undefined;
}

async function resolveCoverForImport(
  slug: string,
  cover?: string,
): Promise<string | null> {
  if (!cover) return null;
  if (cover.startsWith("https://")) return cover;
  if (cover.startsWith("/uploads/posts/")) return cover;
  if (cover.startsWith("/covers/") || cover.startsWith("/")) {
    return copyPublicAssetToUploads(cover, slug);
  }
  return null;
}

async function main() {
  if (!fs.existsSync(postsDir)) {
    console.log("Nessuna cartella content/posts da importare.");
    return;
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  let imported = 0;

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const exists = await prisma.post.findUnique({ where: { slug } });
    if (exists) continue;

    const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
    const { data, content } = matter(raw);
    const title = typeof data.title === "string" ? data.title : slug;
    const dateRaw = data.date;
    const date =
      typeof dateRaw === "string" || dateRaw instanceof Date
        ? new Date(dateRaw)
        : new Date();
    const cover = await resolveCoverForImport(
      slug,
      sanitizeCover(data.cover),
    );

    await prisma.post.create({
      data: {
        slug,
        title,
        date,
        author: typeof data.author === "string" ? data.author : null,
        excerpt: typeof data.excerpt === "string" ? data.excerpt : null,
        cover,
        content: content.trim(),
      },
    });
    imported += 1;
    console.log(`Importato: ${slug}`);
  }

  console.log(`Import completato (${imported} nuovi articoli).`);
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
