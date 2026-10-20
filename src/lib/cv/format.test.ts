import { describe, expect, it } from "vitest";
import {
  DEGREE_LEVEL_LABELS,
  EMPLOYMENT_TYPE_LABELS,
  LANGUAGE_LEVEL_LABELS,
  MONTH_OPTIONS,
  YEAR_OPTIONS,
  formatDateRange,
  formatMonthYear,
  splitLabel,
} from "./format";

describe("formatMonthYear", () => {
  it("turns YYYY-MM into a readable month and year", () => {
    expect(formatMonthYear("2022-03")).toBe("March 2022");
    expect(formatMonthYear("2022-03", true)).toBe("Mar 2022");
  });

  it("passes through a bare year", () => {
    expect(formatMonthYear("2019")).toBe("2019");
  });

  it("normalises Present in any case", () => {
    expect(formatMonthYear("present")).toBe("Present");
    expect(formatMonthYear("PRESENT")).toBe("Present");
  });

  it("returns an empty string for empty input", () => {
    expect(formatMonthYear("")).toBe("");
    expect(formatMonthYear(null)).toBe("");
    expect(formatMonthYear(undefined)).toBe("");
  });

  it("leaves unknown free text untouched", () => {
    expect(formatMonthYear("Summer 2020")).toBe("Summer 2020");
  });
});

describe("formatDateRange", () => {
  it("joins a start and end date with an en dash", () => {
    expect(formatDateRange("2020-01", "2022-06")).toBe("January 2020 – June 2022");
  });

  it("uses Present for a current role", () => {
    expect(formatDateRange("2020-01", "", true)).toBe("January 2020 – Present");
  });

  it("handles a missing start date", () => {
    expect(formatDateRange("", "2022-06")).toBe("June 2022");
  });
});

describe("splitLabel", () => {
  it("title-cases hyphenated enum values", () => {
    expect(splitLabel("full-time")).toBe("Full Time");
    expect(splitLabel("limited-working")).toBe("Limited Working");
  });
});

describe("label maps", () => {
  it("covers every employment type", () => {
    expect(EMPLOYMENT_TYPE_LABELS["part-time"]).toBe("Part Time");
    expect(Object.keys(EMPLOYMENT_TYPE_LABELS).length).toBeGreaterThan(0);
  });

  it("covers degree and language levels", () => {
    expect(DEGREE_LEVEL_LABELS.bachelor).toBe("Bachelor");
    expect(LANGUAGE_LEVEL_LABELS.native).toBe("Native / bilingual");
  });
});

describe("option lists", () => {
  it("offers twelve months with zero-padded values", () => {
    expect(MONTH_OPTIONS).toHaveLength(12);
    expect(MONTH_OPTIONS[0]).toEqual({ value: "01", label: "January" });
  });

  it("offers a descending list of recent years", () => {
    expect(YEAR_OPTIONS.length).toBe(60);
    const first = Number(YEAR_OPTIONS[0].value);
    const second = Number(YEAR_OPTIONS[1].value);
    expect(first).toBeGreaterThan(second);
  });
});
