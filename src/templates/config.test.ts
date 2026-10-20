import { describe, expect, it } from "vitest";
import { TEMPLATE_CATEGORIES } from "@/templates/types";
import { listTemplates, templateCount } from "@/templates/registry";

/* ==========================================================================
   Template config integrity.

   The brief requires every config to declare the same set of fields, and each
   template component to be genuinely its own design. These tests are the
   guard-rail: without them a field like `designNotes` silently rots (which is
   exactly what happened to the old `preview` spec, unused for months before it
   was removed).

   NOTE: uniqueness of the *rendered* designs is enforced separately by
   `thumbnails.test.ts`, which compares real pixel output. A config can look
   distinct on paper and still render identically — that test is the one that
   actually catches it, so do not treat these assertions as covering it.
   ========================================================================== */

const templates = listTemplates();

describe("template configs", () => {
  it("registers every template in the manifest", () => {
    expect(templateCount()).toBe(60);
    expect(templates).toHaveLength(60);
  });

  it("has a config id matching its manifest id", () => {
    const mismatched = templates
      .filter((config) => !config.id || config.id !== config.id.trim().toLowerCase())
      .map((config) => config.id);
    expect(mismatched, `Ids should be lowercase slugs: ${mismatched.join(", ")}`).toEqual([]);
  });

  it("declares every required field", () => {
    const required = [
      "id",
      "name",
      "category",
      "defaultAccent",
      "accentOptions",
      "fonts",
      "supportedSections",
      "extraFields",
      "hasPhoto",
      "description",
      "designNotes",
    ] as const;

    const missing: string[] = [];
    for (const config of templates) {
      for (const field of required) {
        const value = config[field];
        const empty =
          value === undefined ||
          value === null ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === "string" && value.trim() === "");
        if (empty) missing.push(`${config.id}.${field}`);
      }
    }
    expect(missing, `Missing or empty config fields:\n  ${missing.join("\n  ")}`).toEqual([]);
  });

  it("writes a substantial designNotes line for every template", () => {
    // A design note that just restates the marketing `description` is useless;
    // require enough substance to describe a layout.
    const thin = templates
      .filter((config) => config.designNotes.trim().length < 80)
      .map((config) => `${config.id} (${config.designNotes.trim().length} chars)`);
    expect(thin, `designNotes too short to be descriptive:\n  ${thin.join("\n  ")}`).toEqual([]);
  });

  it("does not reuse identical designNotes between templates", () => {
    const byNote = new Map<string, string[]>();
    for (const config of templates) {
      const key = config.designNotes.trim();
      byNote.set(key, [...(byNote.get(key) ?? []), config.id]);
    }
    const reused = [...byNote.values()]
      .filter((ids) => ids.length > 1)
      .map((ids) => ids.join(" = "));
    expect(reused, `These templates share one designNote:\n  ${reused.join("\n  ")}`)
      .toEqual([]);
  });

  it("uses a valid category", () => {
    const invalid = templates
      .filter((config) => !TEMPLATE_CATEGORIES.includes(config.category))
      .map((config) => `${config.id}: ${config.category}`);
    expect(invalid, `Unknown categories:\n  ${invalid.join("\n  ")}`).toEqual([]);
  });

  it("offers a valid colour system", () => {
    const problems: string[] = [];
    const hex = /^#[0-9a-f]{6}$/i;
    for (const config of templates) {
      if (!hex.test(config.defaultAccent)) {
        problems.push(`${config.id}: defaultAccent "${config.defaultAccent}"`);
      }
      if (config.accentOptions.length < 2) {
        problems.push(`${config.id}: only ${config.accentOptions.length} accent option(s)`);
      }
      const bad = config.accentOptions.filter((colour) => !hex.test(colour));
      if (bad.length) problems.push(`${config.id}: bad accent options ${bad.join(", ")}`);
      if (!config.accentOptions.includes(config.defaultAccent)) {
        problems.push(`${config.id}: defaultAccent not among accentOptions`);
      }
    }
    expect(problems, `Colour system problems:\n  ${problems.join("\n  ")}`).toEqual([]);
  });

  it("offers at least one font pairing per template", () => {
    const problems = templates
      .filter((config) => config.fonts.length === 0)
      .map((config) => config.id);
    expect(problems, `No fonts declared: ${problems.join(", ")}`).toEqual([]);
  });

  it("declares unique extra field keys within each template", () => {
    const problems: string[] = [];
    for (const config of templates) {
      const keys = config.extraFields.map((field) => field.key);
      const seen = new Set<string>();
      for (const key of keys) {
        if (seen.has(key)) problems.push(`${config.id}: duplicate extraField key "${key}"`);
        seen.add(key);
      }
    }
    expect(problems, `Extra field problems:\n  ${problems.join("\n  ")}`).toEqual([]);
  });

  it("spreads templates across every category", () => {
    const used = new Set(templates.map((config) => config.category));
    const empty = TEMPLATE_CATEGORIES.filter((category) => !used.has(category));
    expect(empty, `Categories with no templates: ${empty.join(", ")}`).toEqual([]);
  });

  it("gives every template a distinct id and name", () => {
    const ids = templates.map((config) => config.id);
    const names = templates.map((config) => config.name);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);
  });
});
