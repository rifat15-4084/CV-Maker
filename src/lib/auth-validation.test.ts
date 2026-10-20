import { describe, expect, it } from "vitest";
import {
  confirmPasswordError,
  emailField,
  fieldErrors,
  passwordField,
  safeNext,
  signInSchema,
  signUpSchema,
} from "@/lib/auth-validation";

describe("emailField", () => {
  it("accepts and normalises a valid address", () => {
    const parsed = emailField.parse("  Alex@Example.COM ");
    expect(parsed).toBe("alex@example.com");
  });

  it("rejects malformed addresses", () => {
    for (const value of ["", "not-an-email", "a@b", "a b@c.com"]) {
      expect(emailField.safeParse(value).success).toBe(false);
    }
  });
});

describe("passwordField", () => {
  it("requires at least 6 characters", () => {
    expect(passwordField.safeParse("12345").success).toBe(false);
    expect(passwordField.safeParse("123456").success).toBe(true);
  });

  it("rejects passwords longer than bcrypt can hash (72)", () => {
    expect(passwordField.safeParse("a".repeat(73)).success).toBe(false);
    expect(passwordField.safeParse("a".repeat(72)).success).toBe(true);
  });
});

describe("signUpSchema", () => {
  const valid = { fullName: "Alex Morgan", email: "alex@example.com", password: "Password123!" };

  it("accepts a complete, valid payload", () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true);
  });

  it("trims the full name", () => {
    const parsed = signUpSchema.parse({ ...valid, fullName: "  Alex Morgan  " });
    expect(parsed.fullName).toBe("Alex Morgan");
  });

  it("rejects a missing or one-character name", () => {
    expect(signUpSchema.safeParse({ ...valid, fullName: "" }).success).toBe(false);
    expect(signUpSchema.safeParse({ ...valid, fullName: "A" }).success).toBe(false);
  });

  it("rejects a weak password", () => {
    expect(signUpSchema.safeParse({ ...valid, password: "short" }).success).toBe(false);
  });
});

describe("signInSchema", () => {
  it("requires only a non-empty password (strength is not re-checked on login)", () => {
    expect(signInSchema.safeParse({ email: "alex@example.com", password: "x" }).success).toBe(true);
    expect(signInSchema.safeParse({ email: "alex@example.com", password: "" }).success).toBe(false);
  });
});

describe("fieldErrors", () => {
  it("returns the first message per field", () => {
    const result = signUpSchema.safeParse({ fullName: "A", email: "nope", password: "short" });
    expect(result.success).toBe(false);
    if (result.success) return;
    const errors = fieldErrors(result.error);
    expect(errors.fullName).toBe("Please enter your name.");
    expect(errors.email).toBe("Enter a valid email address.");
    expect(errors.password).toBe("Use at least 6 characters.");
  });
});

describe("confirmPasswordError", () => {
  it("returns null when the two match", () => {
    expect(confirmPasswordError("Password123!", "Password123!")).toBeNull();
  });

  it("flags a mismatch on the confirm field", () => {
    expect(confirmPasswordError("Password123!", "password123")).toEqual({
      confirmPassword: "Passwords do not match.",
    });
  });

  it("flags a missing confirmation", () => {
    expect(confirmPasswordError("Password123!", null)).toEqual({
      confirmPassword: "Passwords do not match.",
    });
  });
});

describe("safeNext", () => {
  it("defaults to /dashboard when absent", () => {
    expect(safeNext(null)).toBe("/dashboard");
    expect(safeNext(undefined)).toBe("/dashboard");
    expect(safeNext("")).toBe("/dashboard");
  });

  it("keeps same-origin relative paths", () => {
    expect(safeNext("/editor/abc")).toBe("/editor/abc");
    expect(safeNext("/settings?tab=profile")).toBe("/settings?tab=profile");
  });

  it("blocks open redirects", () => {
    expect(safeNext("https://evil.com")).toBe("/dashboard");
    expect(safeNext("//evil.com")).toBe("/dashboard");
    expect(safeNext("javascript:alert(1)")).toBe("/dashboard");
  });
});
