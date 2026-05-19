/**
 * Rimuove lo sfondo chiaro dal logo tendone e salva PNG trasparente.
 */
import sharp from "sharp";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const output = join(__dirname, "../public/brand/labuvette-awning.png");

const PAPER = { r: 244, g: 241, b: 235 };
const THRESHOLD = 42;

function colorDistance(r, g, b, ref) {
  return Math.sqrt(
    (r - ref.r) ** 2 + (g - ref.g) ** 2 + (b - ref.b) ** 2,
  );
}

const { data, info } = await sharp(output)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const pixels = new Uint8Array(data);
for (let i = 0; i < pixels.length; i += 4) {
  const r = pixels[i];
  const g = pixels[i + 1];
  const b = pixels[i + 2];
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  const nearPaper = colorDistance(r, g, b, PAPER) < THRESHOLD;
  const nearWhite = lum > 238 && Math.max(r, g, b) - Math.min(r, g, b) < 28;
  if (nearPaper || nearWhite) {
    pixels[i + 3] = 0;
  }
}

await sharp(pixels, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toFile(output);

console.log(`OK: ${output} (${info.width}×${info.height})`);
