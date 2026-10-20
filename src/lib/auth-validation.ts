import { z } from "zod";

/* ==========================================================================
   Auth form schemas.

   Shared by the server actions and exercised directly in unit tests. Keeping
   them out of the `"use server"` module means they can be imported anywhere
   without triggering the server-action transform.
   ========================================================================== */

export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.");

export const passwordField = z
  .string()
  .min(6, "Use at least 6 characters.")
  .max(72, "Passwords can be at most 72 characters.");

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name.").max(80),
  email: emailField,
  password: passwordField,
});

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Enter your password."),
});

/** Flattens a ZodError into one message per field, keyed by field name. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}

/**
 * Confirm-password check shared by signup and reset. Returns a field-error map
 * (or null when the two match) so both call sites behave identically.
 */
export function confirmPasswordError(
  password: FormDataEntryValue | null,
  confirm: FormDataEntryValue | null,
): Record<string, string> | null {
  if (password === confirm) return null;
  return { confirmPassword: "Passwords do not match." };
}

/** Only allow same-origin relative redirects — never an absolute URL from a user. */
export function safeNext(raw: FormDataEntryValue | null | undefined): string {
  const value = typeof raw === "string" ? raw : "";
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}
