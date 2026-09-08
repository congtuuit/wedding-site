import fs from "fs";
import path from "path";
import sharp from "sharp";

const publicDir = path.resolve("public/images");
const srcDir = path.resolve("src/images");

async function optimizeImages() {
  // Use public/images if TOBI jpgs are placed there, otherwise src/images
  let inputDir = srcDir;
  const publicJpgs = fs.existsSync(publicDir)
    ? fs.readdirSync(publicDir).filter((file) => /\.(jpg|jpeg|png)$/i.test(file))
    : [];

  if (publicJpgs.length > 0) {
    inputDir = publicDir;
  }

  console.log(`Scanning directory: ${inputDir}`);
  const files = fs.readdirSync(inputDir).filter((file) =>
    /\.(jpg|jpeg|png)$/i.test(file) && !file.endsWith(".webp")
  );

  console.log(`Found ${files.length} images to optimize...`);

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.parse(file).name;
    const outputPath = path.join(publicDir, `${baseName}.webp`);

    // Sync file to src/images if inputDir is publicDir
    if (inputDir === publicDir && fs.existsSync(srcDir)) {
      fs.copyFileSync(inputPath, path.join(srcDir, file));
    }

    const originalStats = fs.statSync(inputPath);
    totalOriginalSize += originalStats.size;

    // Convert to WebP with high fidelity and auto EXIF orientation
    await sharp(inputPath)
      .rotate() // Auto-orient based on EXIF metadata (fixes sideways photos)
      .resize({
        width: 2048,
        height: 2048,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 85,
        effort: 6,
        smartSubsample: true,
      })
      .toFile(outputPath);

    const optimizedStats = fs.statSync(outputPath);
    totalOptimizedSize += optimizedStats.size;

    const origMb = (originalStats.size / (1024 * 1024)).toFixed(2);
    const optMb = (optimizedStats.size / (1024 * 1024)).toFixed(2);
    const savedPercent = (
      ((originalStats.size - optimizedStats.size) / originalStats.size) *
      100
    ).toFixed(1);

    console.log(
      `✓ ${file} (${origMb}MB) -> ${baseName}.webp (${optMb}MB) [Saved ${savedPercent}%]`
    );
  }

  const totalOrigMb = (totalOriginalSize / (1024 * 1024)).toFixed(2);
  const totalOptMb = (totalOptimizedSize / (1024 * 1024)).toFixed(2);
  const totalSavedPercent = (
    ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) *
    100
  ).toFixed(1);

  console.log("\n==========================================");
  console.log(`Total Original Size:  ${totalOrigMb} MB`);
  console.log(`Total Optimized Size: ${totalOptMb} MB`);
  console.log(`Total Storage Saved:  ${totalSavedPercent}%`);
  console.log("==========================================\n");
}

optimizeImages().catch((err) => {
  console.error("Error optimizing images:", err);
  process.exit(1);
});
