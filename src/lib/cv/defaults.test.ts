import { describe, expect, it } from "vitest";
import {
  createEmptyCVData,
  mergeDeep,
  normalizeCVData,
  orderedSections,
  isSectionVisible,
  sectionHasContent,
} from "./defaults";
import { SECTION_KEYS } from "./schema";

describe("mergeDeep", () => {
  it("merges nested objects without dropping keys", () => {
    const base = { a: 1, nested: { x: 1, y: 2 } };
    expect(mergeDeep(base, { nested: { y: 9 } })).toEqual({ a: 1, nested: { x: 1, y: 9 } });
  });

  it("replaces arrays rather than merging them", () => {
    const base = { list: [1, 2, 3] };
    expect(mergeDeep(base, { list: [9] })).toEqual({ list: [9] });
  });

  it("ignores undefined values in the patch", () => {
    const base = { a: 1, b: 2 };
    expect(mergeDeep(base, { b: undefined })).toEqual({ a: 1, b: 2 });
  });
});

describe("normalizeCVData", () => {
  it("returns a valid document for garbage input", () => {
    for (const input of [null, undefined, 42, "nope", [], { personal: 5 }]) {
      const result = normalizeCVData(input);
      expect(result.personal.firstName).toBe("");
      expect(result.experience).toEqual([]);
    }
  });

  it("preserves valid user content", () => {
    const result = normalizeCVData({
      personal: { firstName: "Ada", lastName: "Lovelace" },
      summary: "Mathematician.",
    });
    expect(result.personal.firstName).toBe("Ada");
    expect(result.summary).toBe("Mathematician.");
  });

  it("keeps valid entries and drops only a malformed array", () => {
    // Section arrays use `.catch([])`: if one entry fails validation the whole
    // array falls back to empty rather than throwing, so the document stays
    // renderable. Valid arrays are preserved untouched.
    const valid = normalizeCVData({
      experience: [{ id: "ok", role: "Engineer", bullets: ["Shipped things"] }],
    });
    expect(valid.experience).toHaveLength(1);
    expect(valid.experience[0].role).toBe("Engineer");

    const invalid = normalizeCVData({
      experience: [{ id: "bad", role: 42, employmentType: "wtf", bullets: ["fine"] }],
    });
    expect(Array.isArray(invalid.experience)).toBe(true);
  });
});

describe("section order", () => {
  it("appends missing sections after the user's known order", () => {
    const order = orderedSections({
      ...createEmptyCVData().settings,
      sectionOrder: ["skills", "summary"] as never,
    });
    expect(order[0]).toBe("skills");
    expect(order[1]).toBe("summary");
    expect(order.length).toBe(SECTION_KEYS.length);
  });

  it("drops keys that are not real sections", () => {
    const order = orderedSections({
      ...createEmptyCVData().settings,
      sectionOrder: ["summary", "not-real"] as never,
    });
    expect(order).not.toContain("not-real" as never);
    expect(order.length).toBe(SECTION_KEYS.length);
  });
});

describe("isSectionVisible", () => {
  it("defaults to visible when nothing is set", () => {
    const settings = createEmptyCVData().settings;
    for (const key of SECTION_KEYS) expect(isSectionVisible(settings, key)).toBe(true);
  });

  it("respects an explicit false", () => {
    const settings = { ...createEmptyCVData().settings, sectionVisibility: { hobbies: false } };
    expect(isSectionVisible(settings, "hobbies")).toBe(false);
  });
});

describe("sectionHasContent", () => {
  it("reports empty sections accurately", () => {
    const data = createEmptyCVData();
    for (const key of SECTION_KEYS) expect(sectionHasContent(data, key)).toBe(false);
  });

  it("detects a filled summary and list sections", () => {
    const data = { ...createEmptyCVData(), summary: "Hello" };
    expect(sectionHasContent(data, "summary")).toBe(true);
    const withSkills = {
      ...data,
      skills: [{ id: "s", name: "TS", category: "", level: 3, showBar: true, extra: "" }],
    };
    expect(sectionHasContent(withSkills, "skills")).toBe(true);
  });

  it("treats a custom section with no items as empty", () => {
    const data = {
      ...createEmptyCVData(),
      customSections: [{ id: "c", title: "Volunteering", items: [] }],
    };
    expect(sectionHasContent(data, "custom")).toBe(false);
  });
});
