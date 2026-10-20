#!/usr/bin/env node
/**
 * Generates a real thumbnail for every template.
 *
 * Each image is a screenshot of `/preview/<slug>` — the same component the
 * editor and print route render — so a card can never show artwork that belongs
 * to a different template, and the gallery stays consistent with the PDF.
 *
 * Usage:
 *   node scripts/generate-thumbnails.mjs                 # all templates
 *   node scripts/generate-thumbnails.mjs atlas aurora    # only these slugs
 *   node scripts/generate-thumbnails.mjs --force         # ignore cache
 *
 * Requires a running dev/prod server. `npm run thumbnails` starts nothing; it
 * expects `npm run dev` (or `next start`) on the configured base URL.
 */
import { mkdirSync, existsSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const templatesDir = join(root, "src", "templates");
const outDir = join(root, "public", "thumbnails");

const BASE_URL = process.env.THUMBNAIL_BASE_URL ?? "http://127.0.0.1:3000";

/** Rendered at 2x for crisp text, then downscaled to this CSS width. */
const SCALE = 2;
const A4_WIDTH = 794; // 210mm at 96dpi
const A4_HEIGHT = 1123; // 297mm at 96dpi
const OUTPUT_WIDTH = 600;

const args = process.argv.slice(2);
const force = args.includes("--force");
const explicit = args.filter((arg) => !arg.startsWith("--"));

function templateSlugs() {
  return readdirSync(templatesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "_kit")
    .map((entry) => entry.name)
    .filter((slug) => existsSync(join(templatesDir, slug, "config.ts")))
    .filter((slug) => existsSync(join(templatesDir, slug, "index.tsx")))
    .sort();
}

async function main() {
  const slugs = explicit.length > 0 ? explicit : templateSlugs();
  if (slugs.length === 0) {
    console.error("No templates found.");
    process.exit(1);
  }

  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error(
      "Playwright is not installed. Run:\n  npm i -D playwright\n  npx playwright install chromium",
    );
    process.exit(1);
  }

  let sharp;
  try {
    ({ default: sharp } = await import("sharp"));
  } catch {
    console.error("sharp is required to resize thumbnails.");
    process.exit(1);
  }

  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: A4_WIDTH, height: A4_HEIGHT },
    deviceScaleFactor: SCALE,
  });

  const failures = [];
  let written = 0;
  let skipped = 0;

  // Surface template errors instead of silently screenshotting a blank page.
  const consoleErrors = [];
  page.on("pageerror", (error) => consoleErrors.push(String(error)));

  for (const slug of slugs) {
    const file = join(outDir, `${slug}.webp`);
    if (!force && existsSync(file)) {
      skipped += 1;
      process.stdout.write(`· ${slug} (cached)\n`);
      continue;
    }

    consoleErrors.length = 0;

    try {
      const response = await page.goto(`${BASE_URL}/preview/${slug}`, {
        waitUntil: "domcontentloaded",
        timeout: 45_000,
      });

      if (!response || !response.ok()) {
        throw new Error(`HTTP ${response ? response.status() : "no response"}`);
      }

      // The template is code-split (`ssr: false`), so the sheet exists before
      // the real component mounts. Wait for content inside the sheet.
      await page.waitForSelector("[data-preview-root] .cv-sheet", { timeout: 30_000 });

      await page.waitForFunction(
        () => {
          const sheet = document.querySelector("[data-preview-root] .cv-sheet");
          if (!sheet) return false;
          // The template mounts real nodes; an empty sheet means not yet ready.
          if (sheet.childElementCount === 0) return false;
          return document.documentElement.dataset.cvPreviewReady === "true";
        },
        { timeout: 30_000 },
      ).catch(async () => {
        // Fall back to a generous settle if the ready flag is absent.
        await page.waitForTimeout(1200);
      });

      // Fonts drive template layout; capturing mid-swap produces wrong wrapping.
      await page.evaluate(() => document.fonts?.ready);
      await page.waitForTimeout(250);

      const sheet = await page.$("[data-preview-root] .cv-sheet");
      if (!sheet) throw new Error("no .cv-sheet rendered");

      const png = await sheet.screenshot({ type: "png" });

      const webp = await sharp(png)
        .resize({ width: OUTPUT_WIDTH * SCALE, withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toBuffer();

      writeFileSync(file, webp);
      written += 1;
      process.stdout.write(`✓ ${slug} (${Math.round(webp.length / 1024)} kB)\n`);
    } catch (error) {
      failures.push({ slug, message: error instanceof Error ? error.message : String(error) });
      process.stdout.write(`✗ ${slug} — ${error instanceof Error ? error.message : error}\n`);
    }
  }

  await browser.close();

  console.log(
    `\nThumbnails: ${written} written, ${skipped} cached, ${failures.length} failed (${slugs.length} total)`,
  );

  if (failures.length > 0) {
    console.error("\nFailures:");
    for (const failure of failures) console.error(`  ${failure.slug}: ${failure.message}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
