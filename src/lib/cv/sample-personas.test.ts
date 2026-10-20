import { describe, expect, it } from "vitest";
import { cvDataSchema } from "./schema";
import { SAMPLE_PERSONAS, personaForCategory, personaForTemplate } from "./sample-personas";
import { TEMPLATE_CATEGORIES } from "@/templates/types";

describe("sample personas", () => {
  it("exposes a persona for every template category", () => {
    for (const category of TEMPLATE_CATEGORIES) {
      const persona = personaForCategory(category);
      expect(persona, `no persona for category ${category}`).toBeDefined();
    }
  });

  it("produces schema-valid data for every persona", () => {
    for (const persona of SAMPLE_PERSONAS) {
      const parsed = cvDataSchema.safeParse(persona.data);
      if (!parsed.success) {
        throw new Error(`${persona.id}: ${JSON.stringify(parsed.error.issues.slice(0, 3))}`);
      }
      expect(parsed.success).toBe(true);
    }
  });

  it("gives every persona a distinct person and headline", () => {
    const names = SAMPLE_PERSONAS.map((p) => `${p.data.personal.firstName} ${p.data.personal.lastName}`);
    expect(new Set(names).size).toBe(SAMPLE_PERSONAS.length);
    const titles = SAMPLE_PERSONAS.map((p) => p.data.personal.jobTitle);
    expect(new Set(titles).size).toBe(SAMPLE_PERSONAS.length);
  });

  it("fills the core sections so layouts have something to render", () => {
    for (const persona of SAMPLE_PERSONAS) {
      expect(persona.data.summary.length, `${persona.id} summary`).toBeGreaterThan(80);
      expect(persona.data.experience.length, `${persona.id} experience`).toBeGreaterThanOrEqual(2);
      expect(persona.data.education.length, `${persona.id} education`).toBeGreaterThanOrEqual(1);
      expect(persona.data.skills.length, `${persona.id} skills`).toBeGreaterThanOrEqual(5);
      expect(persona.data.languages.length, `${persona.id} languages`).toBeGreaterThanOrEqual(2);
    }
  });

  it("is deterministic — the same template always gets the same persona", () => {
    const first = personaForTemplate("atlas", "Creative");
    const second = personaForTemplate("atlas", "Creative");
    expect(first.id).toBe(second.id);
  });

  it("spreads persona choice within a category", () => {
    const ids = ["a", "b", "c", "d", "e", "f", "g", "h"].map(
      (id) => personaForTemplate(id, "Creative").id,
    );
    expect(new Set(ids).size).toBeGreaterThan(1);
  });
});
