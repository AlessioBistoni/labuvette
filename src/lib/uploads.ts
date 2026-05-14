import fs from "fs";
import path from "path";
import { optimizeCoverBuffer } from "@/lib/optimize-image";

const UPLOADS_DIR = path.join(process.cwd(), "public/uploads/posts");

export function isManagedUpload(publicPath: string | null | undefined): boolean {
  return Boolean(publicPath?.startsWith("/uploads/posts/"));
}

export function deleteUploadFile(publicPath: string): void {
  if (!isManagedUpload(publicPath)) return;
  const relative = publicPath.replace(/^\/uploads\/posts\//, "");
  if (relative.includes("..") || relative.includes("/")) return;
  const full = path.join(UPLOADS_DIR, relative);
  if (fs.existsSync(full)) fs.unlinkSync(full);
}

function isAllowedImage(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  const ext = path.extname(file.name).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif"].includes(
    ext,
  );
}

export async function saveCoverUpload(
  file: File,
  slug: string,
): Promise<string> {
  if (!isAllowedImage(file)) {
    throw new Error("Formato immagine non supportato.");
  }

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const safeName = `${slug}-${Date.now()}.webp`;
  const full = path.join(UPLOADS_DIR, safeName);
  const raw = Buffer.from(await file.arrayBuffer());
  const optimized = await optimizeCoverBuffer(raw);
  fs.writeFileSync(full, optimized);
  return `/uploads/posts/${safeName}`;
}

export async function copyPublicAssetToUploads(
  publicPath: string,
  slug: string,
): Promise<string | null> {
  if (!publicPath.startsWith("/") || publicPath.startsWith("//")) return null;
  const relative = publicPath.replace(/^\//, "");
  const src = path.join(process.cwd(), "public", relative);
  if (!fs.existsSync(src)) return null;

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const destName = `${slug}.webp`;
  const dest = path.join(UPLOADS_DIR, destName);
  const raw = fs.readFileSync(src);
  const optimized = await optimizeCoverBuffer(raw);
  fs.writeFileSync(dest, optimized);
  return `/uploads/posts/${destName}`;
}
