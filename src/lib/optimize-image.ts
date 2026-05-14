import sharp from "sharp";

/** Larghezza massima display ~896px (max-w-4xl) × 2 per retina. */
export const COVER_MAX_WIDTH = 1800;
/** Altezza coerente con aspect 16:10 sulla pagina. */
export const COVER_MAX_HEIGHT = 1125;
export const COVER_WEBP_QUALITY = 82;

export async function optimizeCoverBuffer(input: Buffer): Promise<Buffer> {
  return sharp(input, { failOn: "none" })
    .rotate()
    .resize(COVER_MAX_WIDTH, COVER_MAX_HEIGHT, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: COVER_WEBP_QUALITY, effort: 4 })
    .toBuffer();
}

export async function optimizeCoverFile(
  sourcePath: string,
  destPath: string,
): Promise<void> {
  const input = await sharp(sourcePath, { failOn: "none" })
    .rotate()
    .resize(COVER_MAX_WIDTH, COVER_MAX_HEIGHT, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: COVER_WEBP_QUALITY, effort: 4 })
    .toBuffer();
  await sharp(input).toFile(destPath);
}
