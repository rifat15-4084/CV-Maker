import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocalAuthService, SESSION_KEY, USERS_KEY } from "./auth-service";
import { AuthError } from "@/services/types";

/** Minimal in-memory Web Storage. */
function fakeStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => (map.has(key) ? (map.get(key) as string) : null),
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => void map.delete(key),
    setItem: (key: string, value: string) => void map.set(key, value),
  } as Storage;
}

let local: Storage;
let session: Storage;

beforeEach(() => {
  local = fakeStorage();
  session = fakeStorage();
  vi.stubGlobal("window", { localStorage: local, sessionStorage: session });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const auth = new LocalAuthService();

const signup = (overrides: Partial<{ fullName: string; email: string; password: string }> = {}) =>
  auth.signup({
    fullName: "Alex Morgan",
    email: "alex@example.com",
    password: "secret123",
    ...overrides,
  });

describe("LocalAuthService.signup", () => {
  it("creates an account, hashes the password and signs the user in", async () => {
    const { user } = await signup();

    expect(user.email).toBe("alex@example.com");
    expect(user.fullName).toBe("Alex Morgan");

    // The password must never be stored in plain text.
    expect(local.getItem(USERS_KEY)).not.toContain("secret123");

    // A session exists, so the user is logged in immediately.
    expect(await auth.getCurrentUser()).not.toBeNull();
    expect(local.getItem(SESSION_KEY)).not.toBeNull();
  });

  it("normalises the email to lowercase", async () => {
    const { user } = await signup({ email: "Alex@Example.COM" });
    expect(user.email).toBe("alex@example.com");
  });

  it("rejects a duplicate email with a friendly message", async () => {
    await signup();
    await expect(signup({ email: "alex@example.com" })).rejects.toMatchObject({
      code: "EMAIL_TAKEN",
    });
  });

  it("treats a duplicate email as case-insensitive", async () => {
    await signup();
    await expect(signup({ email: "ALEX@EXAMPLE.COM" })).rejects.toBeInstanceOf(AuthError);
  });
});

describe("LocalAuthService.login", () => {
  beforeEach(async () => {
    await signup();
    await auth.logout();
  });

  it("accepts the right password", async () => {
    const { user } = await auth.login({ email: "alex@example.com", password: "secret123" });
    expect(user.email).toBe("alex@example.com");
    expect(await auth.getCurrentUser()).not.toBeNull();
  });

  it("rejects the wrong password with a generic message", async () => {
    await expect(
      auth.login({ email: "alex@example.com", password: "wrong" }),
    ).rejects.toMatchObject({ code: "INVALID_CREDENTIALS" });
  });

  it("gives the same message for an unknown email (no account enumeration)", async () => {
    const unknown = await auth.login({ email: "nobody@example.com", password: "x" }).catch((e) => e);
    const wrong = await auth.login({ email: "alex@example.com", password: "x" }).catch((e) => e);
    expect((unknown as AuthError).message).toBe((wrong as AuthError).message);
  });

  it("keeps the session in localStorage when 'remember me' is on", async () => {
    await auth.login({ email: "alex@example.com", password: "secret123", remember: true });
    expect(local.getItem(SESSION_KEY)).not.toBeNull();
    expect(session.getItem(SESSION_KEY)).toBeNull();
  });

  it("keeps the session in sessionStorage when 'remember me' is off", async () => {
    await auth.login({ email: "alex@example.com", password: "secret123", remember: false });
    expect(session.getItem(SESSION_KEY)).not.toBeNull();
    expect(local.getItem(SESSION_KEY)).toBeNull();
  });
});

describe("LocalAuthService sessions", () => {
  it("resolves the user on a fresh page load (session persistence)", async () => {
    await signup();
    // A new service instance models a page reload: same storage, new object.
    const reloaded = new LocalAuthService();
    const user = await reloaded.getCurrentUser();
    expect(user?.email).toBe("alex@example.com");
  });

  it("returns null after logout", async () => {
    await signup();
    await auth.logout();
    expect(await auth.getCurrentUser()).toBeNull();
  });

  it("clears a session whose user no longer exists", async () => {
    await signup();
    // Simulate the account being deleted in another tab.
    local.setItem(USERS_KEY, "[]");
    expect(await auth.getCurrentUser()).toBeNull();
    expect(local.getItem(SESSION_KEY)).toBeNull();
  });

  it("clears an expired session", async () => {
    await signup();
    local.setItem(
      SESSION_KEY,
      JSON.stringify({ userId: "someone", expiresAt: Date.now() - 1000 }),
    );
    expect(await auth.getCurrentUser()).toBeNull();
  });
});

describe("LocalAuthService.updateProfile / changePassword", () => {
  it("updates the profile fields of the current user", async () => {
    await signup();
    const updated = await auth.updateProfile({ fullName: "Alexandra Morgan", headline: "Designer" });
    expect(updated.fullName).toBe("Alexandra Morgan");
    expect(updated.headline).toBe("Designer");

    const reloaded = await new LocalAuthService().getCurrentUser();
    expect(reloaded?.fullName).toBe("Alexandra Morgan");
  });

  it("changes the password only when the current one matches", async () => {
    await signup();
    await expect(auth.changePassword("wrong", "newpass1")).rejects.toMatchObject({
      code: "INVALID_CREDENTIALS",
    });

    await auth.changePassword("secret123", "newpass1");
    await auth.logout();

    await expect(
      auth.login({ email: "alex@example.com", password: "secret123" }),
    ).rejects.toBeInstanceOf(AuthError);
    const { user } = await auth.login({ email: "alex@example.com", password: "newpass1" });
    expect(user.email).toBe("alex@example.com");
  });
});

describe("LocalAuthService password reset", () => {
  it("reports an unknown email instead of pretending to send mail", async () => {
    await expect(auth.requestReset("nobody@example.com")).rejects.toMatchObject({
      code: "USER_NOT_FOUND",
    });
  });

  it("resets the password for a known account", async () => {
    await signup();
    const { email } = await auth.requestReset("alex@example.com");
    expect(email).toBe("alex@example.com");

    await auth.resetPassword("alex@example.com", "brandnew1");
    await auth.logout();
    const { user } = await auth.login({ email: "alex@example.com", password: "brandnew1" });
    expect(user.email).toBe("alex@example.com");
  });
});

describe("LocalAuthService.deleteAccount", () => {
  it("requires the correct password", async () => {
    await signup();
    await expect(auth.deleteAccount("nope")).rejects.toMatchObject({
      code: "INVALID_CREDENTIALS",
    });
    expect(await auth.getCurrentUser()).not.toBeNull();
  });

  it("removes the account and the session", async () => {
    await signup();
    await auth.deleteAccount("secret123");

    expect(await auth.getCurrentUser()).toBeNull();
    // The email can be reused after deletion.
    const { user } = await signup();
    expect(user.email).toBe("alex@example.com");
  });
});
