import {
  cvDataSchema,
  SECTION_KEYS,
  type CVData,
  type CVSettings,
  type SectionKey,
} from "./schema";

/** Unique id for repeatable form entries. */
export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Math.random().toString(36).slice(2, 11)}-${Date.now().toString(36)}`;
}

export function createEmptySettings(overrides: Partial<CVSettings> = {}): CVSettings {
  return {
    accent: "#0ea5e9",
    font: "inter",
    spacing: "normal",
    letterSpacing: "normal",
    sectionOrder: [...SECTION_KEYS],
    sectionVisibility: {},
    ...overrides,
  };
}

/** A brand-new, schema-valid empty CV. */
export function createEmptyCVData(settings: Partial<CVSettings> = {}): CVData {
  return {
    personal: {
      firstName: "",
      lastName: "",
      jobTitle: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      linkedin: "",
      github: "",
      photo: "",
      tagline: "",
      extraLinks: [],
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    awards: [],
    references: [],
    hobbies: [],
    customSections: [],
    settings: createEmptySettings(settings),
    extra: {},
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Recursively merges `patch` onto `base`. Arrays replace the base value so a
 * user's list never gets merged with an unrelated default list.
 */
export function mergeDeep<T>(base: T, patch: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(patch)) {
    return (patch === undefined ? base : (patch as T)) ?? base;
  }
  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    const current = result[key];
    if (isPlainObject(current) && isPlainObject(value)) {
      result[key] = mergeDeep(current, value);
    } else if (Array.isArray(value)) {
      result[key] = value;
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

/**
 * Empty template for one entry in each repeatable section.
 *
 * `loose()` fields in the schema are length-capped but still required, so a
 * partially-specified entry (an old export, a row written by an earlier schema
 * version) would otherwise fail validation and take the whole array down with
 * it. Padding each entry with these defaults before parsing keeps such entries.
 */
const DEFAULT_ITEM: Record<string, () => Record<string, unknown>> = {
  experience: () => ({
    id: newId(),
    role: "",
    company: "",
    location: "",
    employmentType: "full-time",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    bullets: [],
  }),
  education: () => ({
    id: newId(),
    degree: "",
    degreeLevel: "bachelor",
    field: "",
    school: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    grade: "",
    description: "",
    bullets: [],
  }),
  skills: () => ({ id: newId(), name: "", category: "", level: 3, showBar: true, extra: "" }),
  projects: () => ({
    id: newId(),
    name: "",
    role: "",
    link: "",
    tech: "",
    startDate: "",
    endDate: "",
    description: "",
    bullets: [],
  }),
  certifications: () => ({ id: newId(), name: "", issuer: "", date: "", credentialId: "", url: "" }),
  languages: () => ({ id: newId(), name: "", level: "professional-working", detail: "" }),
  awards: () => ({ id: newId(), title: "", issuer: "", date: "", description: "" }),
  references: () => ({ id: newId(), name: "", role: "", company: "", contact: "", relationship: "" }),
  hobbies: () => ({ id: newId(), name: "" }),
  customSections: () => ({ id: newId(), title: "", items: [] }),
};

function padSectionItems(section: string, value: unknown): unknown {
  const factory = DEFAULT_ITEM[section];
  if (!factory || !Array.isArray(value)) return value;
  return value.map((entry) => (isPlainObject(entry) ? mergeDeep(factory(), entry) : entry));
}

/**
 * Makes arbitrary JSON (from Supabase, an import, or an old version of the
 * schema) safe to render: missing fields are filled, invalid fields fall back
 * to defaults. Never throws.
 */
export function normalizeCVData(input: unknown, fallback?: CVData): CVData {
  const base = fallback ?? createEmptyCVData();
  const candidate = mergeDeep(base, isPlainObject(input) ? input : {}) as unknown as Record<
    string,
    unknown
  >;
  for (const section of Object.keys(DEFAULT_ITEM)) {
    candidate[section] = padSectionItems(section, candidate[section]);
  }
  const parsed = cvDataSchema.safeParse(candidate);
  if (parsed.success) return parsed.data as CVData;
  // Last resort: hand back the empty document rather than crashing a render.
  return base;
}

/* ----------------------------- section helpers --------------------------- */

export function isSectionVisible(settings: CVSettings, key: SectionKey) {
  if (key === "custom") {
    return settings.sectionVisibility.custom !== false;
  }
  return settings.sectionVisibility[key] !== false;
}

/** Sections in the user's configured order. */
export function orderedSections(settings: CVSettings): SectionKey[] {
  const known = settings.sectionOrder.filter((key) =>
    (SECTION_KEYS as readonly string[]).includes(key),
  ) as SectionKey[];
  const missing = SECTION_KEYS.filter((key) => !known.includes(key));
  return [...known, ...missing];
}

export function sectionHasContent(data: CVData, key: SectionKey): boolean {
  switch (key) {
    case "summary":
      return data.summary.trim().length > 0;
    case "experience":
      return data.experience.length > 0;
    case "education":
      return data.education.length > 0;
    case "skills":
      return data.skills.length > 0;
    case "projects":
      return data.projects.length > 0;
    case "certifications":
      return data.certifications.length > 0;
    case "languages":
      return data.languages.length > 0;
    case "awards":
      return data.awards.length > 0;
    case "references":
      return data.references.length > 0;
    case "hobbies":
      return data.hobbies.length > 0;
    case "custom":
      return data.customSections.some((section) => section.items.length > 0);
    default:
      return false;
  }
}

export const SECTION_LABELS: Record<SectionKey, string> = {
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
  awards: "Awards & Honors",
  references: "References",
  hobbies: "Interests",
  custom: "Custom Sections",
};
