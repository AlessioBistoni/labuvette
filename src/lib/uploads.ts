import fs from "fs";
import path from "path";
import { del, put } from "@vercel/blob";
import { MAX_COVER_UPLOAD_BYTES } from "@/config/uploads";
import { optimizeCoverBuffer } from "@/lib/optimize-image";

const UPLOADS_DIR = path.join(process.cwd(), "public/uploads/posts");

function isBlobUpload(publicPath: string): boolean {
  try {
    const url = new URL(publicPath);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".public.blob.vercel-storage.com") &&
      url.pathname.startsWith("/posts/")
    );
  } catch {
    return false;
  }
}

export function isManagedUpload(publicPath: string | null | undefined): boolean {
  return Boolean(
    publicPath &&
      (publicPath.startsWith("/uploads/posts/") || isBlobUpload(publicPath)),
  );
}

export async function deleteUploadFile(publicPath: string): Promise<void> {
  if (!isManagedUpload(publicPath)) return;
  if (isBlobUpload(publicPath)) {
    try {
      await del(publicPath);
    } catch (error) {
      console.error("[uploads] Impossibile eliminare il blob", error);
    }
    return;
  }
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

async function persistOptimizedCover(
  optimized: Buffer,
  fileName: string,
): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`posts/${fileName}`, optimized, {
      access: "public",
      addRandomSuffix: false,
      contentType: "image/webp",
    });
    return blob.url;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("BLOB_READ_WRITE_TOKEN non configurato.");
  }

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const full = path.join(UPLOADS_DIR, fileName);
  fs.writeFileSync(full, optimized);
  return `/uploads/posts/${fileName}`;
}

export async function saveCoverUpload(
  file: File,
  slug: string,
): Promise<string> {
  if (!isAllowedImage(file)) {
    throw new Error("Formato immagine non supportato.");
  }
  if (file.size > MAX_COVER_UPLOAD_BYTES) {
    throw new Error("Immagine troppo grande. Dimensione massima: 3 MB.");
  }

  const safeName = `${slug}-${Date.now()}.webp`;
  const raw = Buffer.from(await file.arrayBuffer());
  const optimized = await optimizeCoverBuffer(raw);
  return persistOptimizedCover(optimized, safeName);
}

export async function copyPublicAssetToUploads(
  publicPath: string,
  slug: string,
): Promise<string | null> {
  if (!publicPath.startsWith("/") || publicPath.startsWith("//")) return null;
  const relative = publicPath.replace(/^\//, "");
  const src = path.join(process.cwd(), "public", relative);
  if (!fs.existsSync(src)) return null;

  const destName = `${slug}.webp`;
  const raw = fs.readFileSync(src);
  const optimized = await optimizeCoverBuffer(raw);
  return persistOptimizedCover(optimized, destName);
}
