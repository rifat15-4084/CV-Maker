import { z } from "zod";

/* ==========================================================================
   CVForge — shared CV data schema
   Used by the editor form (strict variant: friendly validation messages) and
   by the persistence layer (permissive variant: never blocks an auto-save).
   ========================================================================== */

export const SECTION_KEYS = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
  "awards",
  "references",
  "hobbies",
  "custom",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export const EMPLOYMENT_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "freelance",
  "temporary",
  "volunteer",
] as const;

export const DEGREE_LEVELS = [
  "high-school",
  "associate",
  "bachelor",
  "master",
  "doctorate",
  "certificate",
  "diploma",
  "other",
] as const;

export const LANGUAGE_LEVELS = [
  "elementary",
  "limited-working",
  "professional-working",
  "full-professional",
  "native",
] as const;

export const PROFICIENCY_LEVELS = ["beginner", "intermediate", "advanced", "expert"] as const;

export const SPACING_OPTIONS = ["compact", "normal", "relaxed"] as const;

/* ---------------------------------- atoms -------------------------------- */

const idSchema = z.string().min(1).max(64);

/** Loose string with a length cap — safe for auto-save at any typing stage. */
const loose = (max: number) => z.string().max(max, `Must be ${max} characters or fewer`);

/** Same field, but required — used by the editor form for clear messages. */
const required = (max: number, message: string) =>
  z.string().min(1, message).max(max, `Must be ${max} characters or fewer`);

const bullets = z.array(loose(400));

/* -------------------------------- sections ------------------------------- */

function personalShape(strict: boolean) {
  const name = (message: string) => (strict ? required(80, message) : loose(80));
  return {
    firstName: name("First name is required"),
    lastName: name("Last name is required"),
    jobTitle: loose(140),
    email: loose(200),
    phone: loose(60),
    address: loose(200),
    website: loose(300),
    linkedin: loose(300),
    github: loose(300),
    photo: loose(600),
    tagline: loose(180),
    extraLinks: z.array(
      z.object({
        id: idSchema,
        label: loose(60),
        url: loose(400),
      }),
    ),
  };
}

export const personalStrictSchema = z.object(personalShape(true));
export const personalSchema = z.object(personalShape(false));

function experienceShape(strict: boolean) {
  const role = strict ? required(140, "Job title is required") : loose(140);
  return {
    id: idSchema,
    role,
    company: loose(140),
    location: loose(140),
    employmentType: z.enum(EMPLOYMENT_TYPES).catch("full-time"),
    startDate: loose(20),
    endDate: loose(20),
    current: z.boolean().catch(false),
    description: loose(600),
    bullets: bullets.catch([]),
  };
}

export const experienceStrictSchema = z.object(experienceShape(true));
export const experienceSchema = z.object(experienceShape(false));

export const educationSchema = z.object({
  id: idSchema,
  degree: loose(140),
  degreeLevel: z.enum(DEGREE_LEVELS).catch("bachelor"),
  field: loose(140),
  school: loose(160),
  location: loose(140),
  startDate: loose(20),
  endDate: loose(20),
  current: z.boolean().catch(false),
  grade: loose(60),
  description: loose(600),
  bullets: bullets.catch([]),
});

export const skillSchema = z.object({
  id: idSchema,
  name: loose(80),
  category: loose(60),
  level: z.number().min(0).max(5).catch(3),
  showBar: z.boolean().catch(true),
  extra: loose(120),
});

export const projectSchema = z.object({
  id: idSchema,
  name: loose(140),
  role: loose(120),
  link: loose(400),
  tech: loose(200),
  startDate: loose(20),
  endDate: loose(20),
  description: loose(600),
  bullets: bullets.catch([]),
});

export const certificationSchema = z.object({
  id: idSchema,
  name: loose(160),
  issuer: loose(140),
  date: loose(20),
  credentialId: loose(80),
  url: loose(400),
});

export const languageSchema = z.object({
  id: idSchema,
  name: loose(80),
  level: z.enum(LANGUAGE_LEVELS).catch("professional-working"),
  detail: loose(80),
});

export const awardSchema = z.object({
  id: idSchema,
  title: loose(160),
  issuer: loose(140),
  date: loose(20),
  description: loose(400),
});

export const referenceSchema = z.object({
  id: idSchema,
  name: loose(120),
  role: loose(120),
  company: loose(120),
  contact: loose(200),
  relationship: loose(120),
});

export const hobbySchema = z.object({
  id: idSchema,
  name: loose(80),
});

export const customItemSchema = z.object({
  id: idSchema,
  heading: loose(160),
  subheading: loose(160),
  date: loose(40),
  description: loose(800),
  bullets: bullets.catch([]),
});

export const customSectionSchema = z.object({
  id: idSchema,
  title: loose(80),
  items: z.array(customItemSchema).catch([]),
});

/* -------------------------------- settings ------------------------------- */

function settingsShape() {
  return {
    accent: z
      .string()
      .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a hex colour")
      .catch("#0ea5e9"),
    font: loose(60).catch("inter"),
    spacing: z.enum(SPACING_OPTIONS).catch("normal"),
    sectionOrder: z.array(z.enum(SECTION_KEYS)).catch([]),
    sectionVisibility: z.record(z.string(), z.boolean()).catch({}),
    letterSpacing: z.enum(["tight", "normal", "wide"]).catch("normal"),
  };
}

export const settingsStrictSchema = z.object(settingsShape());
export const settingsSchema = z.object(settingsShape());

/* ------------------------------- whole CV -------------------------------- */

function cvShape(strict: boolean) {
  return {
    personal: strict ? personalStrictSchema : personalSchema,
    summary: loose(1200),
    experience: z.array(strict ? experienceStrictSchema : experienceSchema).catch([]),
    education: z.array(educationSchema).catch([]),
    skills: z.array(skillSchema).catch([]),
    projects: z.array(projectSchema).catch([]),
    certifications: z.array(certificationSchema).catch([]),
    languages: z.array(languageSchema).catch([]),
    awards: z.array(awardSchema).catch([]),
    references: z.array(referenceSchema).catch([]),
    hobbies: z.array(hobbySchema).catch([]),
    customSections: z.array(customSectionSchema).catch([]),
    settings: strict ? settingsStrictSchema : settingsSchema,
    /** Template specific extra fields (photo crop, toggles, tagline, …). */
    extra: z.record(z.string(), z.any()).catch({}),
  };
}

/** Strict — used as the React Hook Form resolver so inputs show clear errors. */
export const cvDataStrictSchema = z.object(cvShape(true));

/** Permissive — used before every persist so a partial CV can always be saved. */
export const cvDataSchema = z.object(cvShape(false));

export type CVData = Omit<z.infer<typeof cvDataSchema>, "settings"> & {
  settings: CVSettings;
};
export type PersonalInfo = z.infer<typeof personalSchema>;
export type ExperienceItem = z.infer<typeof experienceSchema>;
export type EducationItem = z.infer<typeof educationSchema>;
export type SkillItem = z.infer<typeof skillSchema>;
export type ProjectItem = z.infer<typeof projectSchema>;
export type CertificationItem = z.infer<typeof certificationSchema>;
export type LanguageItem = z.infer<typeof languageSchema>;
export type AwardItem = z.infer<typeof awardSchema>;
export type ReferenceItem = z.infer<typeof referenceSchema>;
export type HobbyItem = z.infer<typeof hobbySchema>;
export type CustomSection = z.infer<typeof customSectionSchema>;
export type CustomItem = z.infer<typeof customItemSchema>;
export type CVSettings = Omit<z.infer<typeof settingsSchema>, "sectionVisibility"> & {
  sectionVisibility: Partial<Record<SectionKey, boolean>>;
};
export type SocialLink = z.infer<typeof personalSchema>["extraLinks"][number];

/* -------------------------- DB row <-> CV data --------------------------- */

export const cvRowSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  template_id: z.string(),
  data: cvDataSchema,
  settings: settingsSchema,
  thumbnail_url: z.string().nullable().catch(null),
  created_at: z.string().catch(""),
  updated_at: z.string().catch(""),
});

export type CVRow = z.infer<typeof cvRowSchema>;
