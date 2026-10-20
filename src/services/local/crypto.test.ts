import { describe, expect, it } from "vitest";
import { createCredential, createSalt, hashPassword, verifyPassword } from "./crypto";

describe("createSalt", () => {
  it("produces a 32-character hex string (16 bytes)", () => {
    const salt = createSalt();
    expect(salt).toHaveLength(32);
    expect(salt).toMatch(/^[0-9a-f]+$/);
  });

  it("produces a different salt each call", () => {
    expect(createSalt()).not.toBe(createSalt());
  });
});

describe("hashPassword", () => {
  it("is deterministic for the same password and salt", async () => {
    const salt = createSalt();
    expect(await hashPassword("hunter2", salt)).toBe(await hashPassword("hunter2", salt));
  });

  it("produces a different digest for a different salt", async () => {
    const a = await hashPassword("hunter2", createSalt());
    const b = await hashPassword("hunter2", createSalt());
    expect(a).not.toBe(b);
  });

  it("never returns the plain password", async () => {
    const digest = await hashPassword("hunter2", createSalt());
    expect(digest).not.toContain("hunter2");
    expect(digest).toHaveLength(64); // 256 bits, hex encoded
  });
});

describe("verifyPassword", () => {
  it("accepts the matching digest and rejects everything else", () => {
    const digest = "a".repeat(64);
    expect(verifyPassword(digest, digest)).toBe(true);
    expect(verifyPassword("b".repeat(64), digest)).toBe(false);
    expect(verifyPassword("short", digest)).toBe(false);
    expect(verifyPassword("", digest)).toBe(false);
  });
});

describe("createCredential", () => {
  it("round-trips a password through hash and verify", async () => {
    const { salt, passwordHash } = await createCredential("correct horse battery staple");
    const candidate = await hashPassword("correct horse battery staple", salt);
    expect(verifyPassword(candidate, passwordHash)).toBe(true);
  });

  it("rejects the wrong password", async () => {
    const { salt, passwordHash } = await createCredential("correct horse battery staple");
    const candidate = await hashPassword("wrong password", salt);
    expect(verifyPassword(candidate, passwordHash)).toBe(false);
  });
});
