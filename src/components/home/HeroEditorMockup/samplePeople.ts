/**
 * Sample people for the hero mockup's typing loop.
 *
 * Order matters: the demo walks this array top to bottom and wraps around.
 * The copy is deliberately concrete (numbers, domains, real role names) so the
 * preview reads like a finished CV rather than lorem ipsum.
 */
export interface SamplePerson {
  name: string;
  title: string;
  summary: string;
  email: string;
  phone: string;
}

export const SAMPLE_PEOPLE: SamplePerson[] = [
  {
    name: "Amara Okafor",
    title: "Product Designer",
    summary: "Designer with 6 years of experience shaping clear, human-centred products.",
    email: "amara@mail.com",
    phone: "+234 801 234 5678",
  },
  {
    name: "Daniel Reyes",
    title: "Frontend Engineer",
    summary: "Engineer who loves fast, accessible interfaces and clean component systems.",
    email: "daniel@mail.com",
    phone: "+1 415 555 0142",
  },
  {
    name: "Mei Tanaka",
    title: "Marketing Manager",
    summary: "Growth-focused marketer turning stories and data into measurable results.",
    email: "mei@mail.com",
    phone: "+81 90 1234 5678",
  },
];

/** The five auto-typed fields, in the order the demo fills them. */
export type FieldKey = "name" | "title" | "summary" | "email" | "phone";

export const FIELD_ORDER: FieldKey[] = ["name", "title", "summary", "email", "phone"];

/** Per-character typing delay (ms) before jitter is added. */
export const TYPE_BASE: Record<FieldKey, number> = {
  name: 55,
  title: 45,
  summary: 22,
  email: 38,
  phone: 38,
};

/** Placeholder shown while a field is still empty. */
export const PLACEHOLDERS: Record<FieldKey, string> = {
  name: "Your Name",
  title: "Job title",
  summary: "Short professional summary appears here.",
  email: "email@mail.com",
  phone: "+00 000 000",
};

export const EMPTY_FIELDS: Record<FieldKey, string> = {
  name: "",
  title: "",
  summary: "",
  email: "",
  phone: "",
};
