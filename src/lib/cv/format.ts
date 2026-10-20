import {
  DEGREE_LEVELS,
  EMPLOYMENT_TYPES,
  LANGUAGE_LEVELS,
  PROFICIENCY_LEVELS,
} from "./schema";

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/**
 * Accepts "2021-05", "2021", "Present", "Present" or free text and returns a
 * human readable label. Unknown values pass through untouched.
 */
export function formatMonthYear(value?: string | null, short = false): string {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  if (/^present$/i.test(raw)) return "Present";
  const match = /^(\d{4})-(\d{1,2})$/.exec(raw);
  if (match) {
    const year = match[1];
    const monthIndex = Number(match[2]) - 1;
    const names = short ? MONTH_ABBR : MONTH_NAMES;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${names[monthIndex]} ${year}`;
    }
    return year;
  }
  if (/^\d{4}$/.test(raw)) return raw;
  return raw;
}

/** "May 2021 – Present" style range. */
export function formatDateRange(
  start?: string | null,
  end?: string | null,
  current?: boolean,
  short = false,
): string {
  const from = formatMonthYear(start, short);
  const to = current ? "Present" : formatMonthYear(end, short);
  if (from && to) return `${from} – ${to}`;
  return from || to || "";
}

export function splitLabel(value: string): string {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const EMPLOYMENT_TYPE_LABELS = Object.fromEntries(
  EMPLOYMENT_TYPES.map((value) => [value, splitLabel(value)]),
) as Record<(typeof EMPLOYMENT_TYPES)[number], string>;

export const DEGREE_LEVEL_LABELS = Object.fromEntries(
  DEGREE_LEVELS.map((value) => [value, splitLabel(value)]),
) as Record<(typeof DEGREE_LEVELS)[number], string>;

export const LANGUAGE_LEVEL_LABELS: Record<(typeof LANGUAGE_LEVELS)[number], string> = {
  elementary: "Elementary",
  "limited-working": "Limited working proficiency",
  "professional-working": "Professional working proficiency",
  "full-professional": "Full professional proficiency",
  native: "Native / bilingual",
};

export const PROFICIENCY_LABELS = Object.fromEntries(
  PROFICIENCY_LEVELS.map((value) => [value, splitLabel(value)]),
) as Record<(typeof PROFICIENCY_LEVELS)[number], string>;

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1).padStart(2, "0"),
  label: MONTH_NAMES[index],
}));

export const YEAR_OPTIONS = Array.from({ length: 60 }, (_, index) => {
  const year = new Date().getFullYear() + 1 - index;
  return { value: String(year), label: String(year) };
});
