import {
  AuthError,
  type AuthService,
  type LoginInput,
  type LoginResult,
  type SignupInput,
  type SignupResult,
  type StoredUser,
  type User,
} from "@/services/types";
import { createCredential, hashPassword, verifyPassword } from "./crypto";
import {
  StorageFullError,
  localStore,
  readJson,
  removeKey,
  sessionStore,
  writeJson,
} from "./storage";

/** localStorage keys. Kept literal so they are easy to inspect and migrate. */
export const USERS_KEY = "cvforge_users";
export const SESSION_KEY = "cvforge_session";

/** How long a "remember me" session lasts. */
const REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000;

interface StoredSession {
  userId: string;
  expiresAt: number;
}

/** Strips the credential fields before handing a user to the UI. */
function toPublicUser(stored: StoredUser): User {
  return {
    id: stored.id,
    fullName: stored.fullName,
    email: stored.email,
    avatarUrl: stored.avatarUrl ?? null,
    headline: stored.headline ?? null,
    createdAt: stored.createdAt,
  };
}

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** A collision-resistant id that works without a backend. */
function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Browser-only auth backed by localStorage.
 *
 * Users live in `cvforge_users`; the active session lives in
 * `cvforge_session` (or sessionStorage when "remember me" is off).
 */
export class LocalAuthService implements AuthService {
  /* ------------------------------------------------------------------ */
  /* Storage helpers                                                     */
  /* ------------------------------------------------------------------ */

  private readUsers(): StoredUser[] {
    return readJson<StoredUser[]>(localStore(), USERS_KEY, []);
  }

  private writeUsers(users: StoredUser[]): void {
    try {
      writeJson(localStore(), USERS_KEY, users);
    } catch (error) {
      if (error instanceof StorageFullError) {
        throw new AuthError(
          "This browser's storage is full, so the account could not be saved. Free some space and try again.",
          "STORAGE_ERROR",
        );
      }
      throw error;
    }
  }

  private findUser(email: string): StoredUser | undefined {
    const target = normaliseEmail(email);
    return this.readUsers().find((user) => normaliseEmail(user.email) === target);
  }

  private findById(id: string): StoredUser | undefined {
    return this.readUsers().find((user) => user.id === id);
  }

  /* ------------------------------------------------------------------ */
  /* Session                                                             */
  /* ------------------------------------------------------------------ */

  private writeSession(userId: string, remember: boolean): void {
    const session: StoredSession = { userId, expiresAt: Date.now() + REMEMBER_TTL_MS };
    const target = remember ? localStore() : sessionStore();
    const other = remember ? sessionStore() : localStore();

    // Only ever one live session, in exactly one storage area.
    removeKey(other, SESSION_KEY);
    try {
      writeJson(target, SESSION_KEY, session);
    } catch {
      // A failed session write must not fail the sign-in — fall back to the
      // other storage area before giving up.
      try {
        writeJson(remember ? sessionStore() : localStore(), SESSION_KEY, session);
      } catch {
        throw new AuthError("Could not start a session in this browser.", "STORAGE_ERROR");
      }
    }
  }

  private readSession(): StoredSession | null {
    const fromLocal = readJson<StoredSession | null>(localStore(), SESSION_KEY, null);
    const fromSession = readJson<StoredSession | null>(sessionStore(), SESSION_KEY, null);
    const session = fromLocal ?? fromSession;
    if (!session || typeof session.userId !== "string") return null;

    if (typeof session.expiresAt === "number" && session.expiresAt < Date.now()) {
      // Expired: clear it so the UI resolves to signed-out rather than looping.
      this.clearSession();
      return null;
    }
    return session;
  }

  private clearSession(): void {
    removeKey(localStore(), SESSION_KEY);
    removeKey(sessionStore(), SESSION_KEY);
  }

  /* ------------------------------------------------------------------ */
  /* AuthService                                                         */
  /* ------------------------------------------------------------------ */

  async signup({ fullName, email, password }: SignupInput): Promise<SignupResult> {
    const cleanEmail = normaliseEmail(email);
    const cleanName = fullName.trim();

    if (this.findUser(cleanEmail)) {
      throw new AuthError("An account with that email already exists. Try logging in instead.", "EMAIL_TAKEN");
    }

    const { salt, passwordHash } = await createCredential(password);
    const stored: StoredUser = {
      id: createId(),
      fullName: cleanName,
      email: cleanEmail,
      salt,
      passwordHash,
      avatarUrl: null,
      headline: null,
      createdAt: new Date().toISOString(),
    };

    this.writeUsers([...this.readUsers(), stored]);
    // Sign the user straight in — there is no verification step locally.
    this.writeSession(stored.id, true);

    return { user: toPublicUser(stored) };
  }

  async login({ email, password, remember = true }: LoginInput): Promise<LoginResult> {
    const user = this.findUser(email);

    // Same message whether the email is unknown or the password is wrong, so the
    // form never reveals which addresses have accounts.
    if (!user) {
      throw new AuthError("Email or password is incorrect.", "INVALID_CREDENTIALS");
    }

    const candidate = await hashPassword(password, user.salt);
    if (!verifyPassword(candidate, user.passwordHash)) {
      throw new AuthError("Email or password is incorrect.", "INVALID_CREDENTIALS");
    }

    this.writeSession(user.id, remember);
    return { user: toPublicUser(user) };
  }

  async logout(): Promise<void> {
    this.clearSession();
  }

  async getCurrentUser(): Promise<User | null> {
    const session = this.readSession();
    if (!session) return null;

    const user = this.findById(session.userId);
    if (!user) {
      // The account was deleted in another tab — drop the dangling session.
      this.clearSession();
      return null;
    }
    return toPublicUser(user);
  }

  async updateProfile(
    patch: Partial<Pick<User, "fullName" | "avatarUrl" | "headline">>,
  ): Promise<User> {
    const session = this.readSession();
    if (!session) throw new AuthError("You are not signed in.", "USER_NOT_FOUND");

    const users = this.readUsers();
    const index = users.findIndex((user) => user.id === session.userId);
    if (index === -1) throw new AuthError("You are not signed in.", "USER_NOT_FOUND");

    const next: StoredUser = {
      ...users[index],
      ...(patch.fullName !== undefined ? { fullName: patch.fullName.trim() } : {}),
      ...(patch.avatarUrl !== undefined ? { avatarUrl: patch.avatarUrl } : {}),
      ...(patch.headline !== undefined ? { headline: patch.headline } : {}),
    };

    users[index] = next;
    this.writeUsers(users);
    return toPublicUser(next);
  }

  async changePassword(currentPassword: string, nextPassword: string): Promise<void> {
    const session = this.readSession();
    if (!session) throw new AuthError("You are not signed in.", "USER_NOT_FOUND");

    const users = this.readUsers();
    const index = users.findIndex((user) => user.id === session.userId);
    if (index === -1) throw new AuthError("You are not signed in.", "USER_NOT_FOUND");

    const current = users[index];
    const candidate = await hashPassword(currentPassword, current.salt);
    if (!verifyPassword(candidate, current.passwordHash)) {
      throw new AuthError("Your current password is incorrect.", "INVALID_CREDENTIALS");
    }

    const { salt, passwordHash } = await createCredential(nextPassword);
    users[index] = { ...current, salt, passwordHash };
    this.writeUsers(users);
  }

  async requestReset(email: string): Promise<{ email: string }> {
    const user = this.findUser(email);
    if (!user) {
      // Unlike a real backend we cannot hide this: the reset must happen in this
      // browser, so the user needs to be told the account is not here.
      throw new AuthError("No account was found with that email address.", "USER_NOT_FOUND");
    }
    return { email: normaliseEmail(email) };
  }

  async resetPassword(email: string, nextPassword: string): Promise<void> {
    const users = this.readUsers();
    const index = users.findIndex((user) => normaliseEmail(user.email) === normaliseEmail(email));
    if (index === -1) throw new AuthError("No account was found with that email address.", "USER_NOT_FOUND");

    const { salt, passwordHash } = await createCredential(nextPassword);
    users[index] = { ...users[index], salt, passwordHash };
    this.writeUsers(users);
    // Any existing session stays valid; the user is not force-logged-out.
  }

  async deleteAccount(password: string): Promise<void> {
    const session = this.readSession();
    if (!session) throw new AuthError("You are not signed in.", "USER_NOT_FOUND");

    const users = this.readUsers();
    const user = users.find((entry) => entry.id === session.userId);
    if (!user) throw new AuthError("You are not signed in.", "USER_NOT_FOUND");

    const candidate = await hashPassword(password, user.salt);
    if (!verifyPassword(candidate, user.passwordHash)) {
      throw new AuthError("Your password is incorrect.", "INVALID_CREDENTIALS");
    }

    this.writeUsers(users.filter((entry) => entry.id !== session.userId));
    this.clearSession();
  }
}
