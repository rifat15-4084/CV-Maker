import { describe, expect, it } from "vitest";
import {
  cvDataSchema,
  cvDataStrictSchema,
  experienceStrictSchema,
  SECTION_KEYS,
  EMPLOYMENT_TYPES,
  DEGREE_LEVELS,
  LANGUAGE_LEVELS,
} from "./schema";
import { createEmptyCVData, newId } from "./defaults";

describe("createEmptyCVData", () => {
  it("produces a document that satisfies both schemas", () => {
    const data = createEmptyCVData();
    expect(cvDataSchema.safeParse(data).success).toBe(true);
    expect(cvDataStrictSchema.safeParse(data).success).toBe(false); // names still empty
  });

  it("keeps every section key in the default order", () => {
    const data = createEmptyCVData();
    expect(data.settings.sectionOrder).toEqual([...SECTION_KEYS]);
  });

  it("accepts settings overrides", () => {
    const data = createEmptyCVData({ accent: "#123456", font: "playfair" });
    expect(data.settings.accent).toBe("#123456");
    expect(data.settings.font).toBe("playfair");
  });
});

describe("permissive schema", () => {
  it("only tolerates enum values and array contents — full documents are still required", () => {
    // `cvDataSchema` is permissive about enum values but not about structure, so
    // a bare patch is rejected and `normalizeCVData` (which merges onto a full
    // empty document first) is what makes partial input safe.
    expect(cvDataSchema.safeParse({ personal: { firstName: "Ada" } }).success).toBe(false);
    expect(cvDataSchema.safeParse(createEmptyCVData()).success).toBe(true);
  });

  it("rewrites unknown enum values back to a valid default", () => {
    const parsed = cvDataSchema.parse({
      ...createEmptyCVData(),
      experience: [
        {
          id: "e1",
          role: "Engineer",
          company: "Northwind",
          location: "Remote",
          employmentType: "not-a-real-type",
          startDate: "2022-01",
          endDate: "",
          current: true,
          description: "",
          bullets: ["Shipped things"],
        },
      ],
    });
    expect(EMPLOYMENT_TYPES).toContain(parsed.experience[0].employmentType);
  });

  it("caps over-long strings instead of accepting them silently", () => {
    const parsed = cvDataSchema.safeParse({ ...createEmptyCVData(), summary: "x".repeat(2000) });
    expect(parsed.success).toBe(false);
  });
});

describe("strict schema", () => {
  it("requires first and last name with a helpful message", () => {
    const parsed = cvDataStrictSchema.safeParse(createEmptyCVData());
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    const messages = parsed.error.issues.map((issue) => issue.message);
    expect(messages).toContain("First name is required");
    expect(messages).toContain("Last name is required");
  });

  it("requires a role on experience entries", () => {
    const parsed = experienceStrictSchema.safeParse({ id: "e1", role: "", bullets: [] });
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    expect(parsed.error.issues.map((issue) => issue.message)).toContain("Job title is required");
  });

  it("accepts a fully filled minimal CV", () => {
    const base = createEmptyCVData();
    const parsed = cvDataStrictSchema.safeParse({
      ...base,
      personal: { ...base.personal, firstName: "Ada", lastName: "Lovelace" },
    });
    expect(parsed.success).toBe(true);
  });
});

describe("enum vocabularies", () => {
  it("exposes the expected option sets", () => {
    expect(DEGREE_LEVELS).toContain("master");
    expect(LANGUAGE_LEVELS).toContain("native");
    expect(EMPLOYMENT_TYPES).toContain("contract");
  });
});

describe("newId", () => {
  it("returns unique, non-empty ids", () => {
    const ids = new Set(Array.from({ length: 200 }, () => newId()));
    expect(ids.size).toBe(200);
    for (const id of ids) expect(id.length).toBeGreaterThan(0);
  });
});
