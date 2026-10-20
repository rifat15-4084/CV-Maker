import { z } from "zod";

export const CONTACT_SUBJECTS = [
  "General question",
  "Bug report",
  "Feature request",
  "Billing or account",
  "Privacy request",
  "Other",
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

/** Shared client + server validation for the contact form. */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please tell us your name (at least 2 characters).")
    .max(80, "That name is a little too long."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  subject: z.enum(CONTACT_SUBJECTS, { message: "Choose a subject." }),
  message: z
    .string()
    .trim()
    .min(20, "Please add a little more detail (at least 20 characters).")
    .max(4000, "Please keep messages under 4000 characters."),
  // Simple honeypot: must stay empty. Bots fill every field they find.
  company: z.string().max(0, "Something went wrong. Please try again.").optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
