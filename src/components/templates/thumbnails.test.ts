import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { beforeAll, describe, expect, it } from "vitest";
import { TEMPLATE_MANIFEST } from "@/templates/manifest";

/* ==========================================================================
   Thumbnail integrity.

   Failure modes this guards against:

   1. A template with no thumbnail — which used to mean the card silently showed
      *someone else's* artwork, because the gallery drew one generic SVG.
   2. Two templates sharing identical or near-identical artwork, which is what
      "every card shows the same image" actually looked like.

   IMPORTANT: comparison decodes the image at real resolution and compares RGB
   pixels. An earlier version of this test resized to 16x16 grayscale and
   thresholded against the *global* mean, which collapsed genuinely different
   designs (a dark sidebar template and a bright one) onto the same hash and
   produced false passes. Do not "optimise" this back into a tiny grayscale
   average hash — it cannot tell those designs apart.
   ========================================================================== */

const THUMBNAIL_DIR = join(process.cwd(), "public", "thumbnails");

/** Comparison size — small enough to be fast, large enough to keep structure. */
const SAMPLE_W = 64;
const SAMPLE_H = 90;

/** Mean absolute per-channel difference (0–255). */
const DUPLICATE_THRESHOLD = 2;

const MISSING_HINT =
  "Missing thumbnails. Run `npm run dev` in one terminal, then `npm run thumbnails`.";

function thumbnailPath(slug: string) {
  return join(THUMBNAIL_DIR, `${slug}.webp`);
}

function readThumbnail(slug: string): Buffer | null {
  const path = thumbnailPath(slug);
  return existsSync(path) ? readFileSync(path) : null;
}

/** Decoded RGB bytes at a fixed size, so any two thumbnails are comparable. */
async function signature(slug: string): Promise<Buffer | null> {
  const buffer = readThumbnail(slug);
  if (!buffer) return null;
  return sharp(buffer).resize(SAMPLE_W, SAMPLE_H, { fit: "fill" }).removeAlpha().raw().toBuffer();
}

function meanAbsoluteDifference(a: Buffer, b: Buffer): number {
  const length = Math.min(a.length, b.length);
  let total = 0;
  for (let index = 0; index < length; index += 1) total += Math.abs(a[index] - b[index]);
  return total / length;
}

const slugs = TEMPLATE_MANIFEST.map((entry) => entry.id);

describe("template thumbnails", () => {
  it("has a thumbnail file for every registered template", () => {
    const missing = slugs.filter((slug) => readThumbnail(slug) === null);
    expect(missing, `${MISSING_HINT}\nMissing: ${missing.join(", ")}`).toEqual([]);
  });

  it("does not ship byte-identical thumbnails", () => {
    const groups = new Map<string, string[]>();
    for (const slug of slugs) {
      const buffer = readThumbnail(slug);
      if (!buffer) continue;
      const digest = buffer.toString("base64");
      const bucket = groups.get(digest);
      if (bucket) bucket.push(slug);
      else groups.set(digest, [slug]);
    }

    const duplicates = [...groups.values()]
      .filter((ids) => ids.length > 1)
      .map((ids) => ids.join(" = "));
    expect(duplicates, `Identical thumbnails: ${duplicates.join("; ")}`).toEqual([]);
  });

  describe("perceptual uniqueness", () => {
    const signatures = new Map<string, Buffer>();

    beforeAll(async () => {
      for (const slug of slugs) {
        const sig = await signature(slug);
        if (sig) signatures.set(slug, sig);
      }
    });

    it("decodes every thumbnail it is asked to compare", () => {
      expect(signatures.size).toBe(slugs.length);
    });

    it("has no two thumbnails that look the same", () => {
      const ids = [...signatures.keys()];
      const collisions: string[] = [];

      for (let a = 0; a < ids.length; a += 1) {
        for (let b = a + 1; b < ids.length; b += 1) {
          const difference = meanAbsoluteDifference(
            signatures.get(ids[a])!,
            signatures.get(ids[b])!,
          );
          if (difference <= DUPLICATE_THRESHOLD) {
            collisions.push(`${ids[a]} ~ ${ids[b]} (mean diff ${difference.toFixed(2)})`);
          }
        }
      }

      expect(
        collisions,
        `Near-identical template previews:\n  ${collisions.join("\n  ")}`,
      ).toEqual([]);
    });

    it("spans a wide range of designs rather than a few recolours", () => {
      // A CV is mostly white paper, so the *mean* pixel difference between any
      // two templates is naturally small — that makes "most pairs are far
      // apart" the wrong question. The meaningful signals are:
      //   • nothing sits near the duplicate threshold (structural sameness), and
      //   • a healthy tail of pairs differs substantially (real variety).
      // Measured on the current 60: min 2.01, median 10.9, p75 21.6, max 74.4.
      const ids = [...signatures.keys()];
      const differences: number[] = [];

      for (let a = 0; a < ids.length; a += 1) {
        for (let b = a + 1; b < ids.length; b += 1) {
          differences.push(
            meanAbsoluteDifference(signatures.get(ids[a])!, signatures.get(ids[b])!),
          );
        }
      }

      differences.sort((a, b) => a - b);
      const median = differences[Math.floor(differences.length / 2)];

      // No pair should be closer than the duplicate threshold (checked in more
      // detail above), and the spread should be wide, not clustered.
      expect(differences[0]).toBeGreaterThan(DUPLICATE_THRESHOLD);
      expect(median).toBeGreaterThan(6);
      expect(differences[differences.length - 1]).toBeGreaterThan(40);
    });
  });

  it("keeps every thumbnail within a sane size budget", () => {
    const tooBig = slugs
      .map((slug) => {
        const buffer = readThumbnail(slug);
        if (!buffer) return null;
        return buffer.length > 400 * 1024
          ? `${slug} (${Math.round(buffer.length / 1024)} kB)`
          : null;
      })
      .filter((value): value is string => value !== null);
    expect(tooBig, `Oversized thumbnails: ${tooBig.join(", ")}`).toEqual([]);
  });
});
