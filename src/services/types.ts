/**
 * Service contracts for CVForge.
 *
 * Every UI component talks to these interfaces and never to a storage API
 * directly. The local (browser-only) implementations live in
 * `src/services/local/`; swapping in Supabase later means writing new classes
 * that satisfy these same shapes and pointing `src/services/index.ts` at them.
 *
 * Nothing in this file may import a browser or server API — it is pure types.
 */

import type { CVData } from "@/lib/cv/schema";

/* ==========================================================================
   Auth
   ========================================================================== */

/** A signed-in user as the UI knows it. Never contains a password hash. */
export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  headline?: string | null;
  createdAt: string;
}

/** Stored credential record. Only implementations of AuthService see this. */
export interface StoredUser extends User {
  passwordHash: string;
  /** Per-user random salt, hex-encoded. */
  salt: string;
}

export interface SignupInput {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
  /** When true the session survives a browser restart. */
  remember?: boolean;
}

export interface SignupResult {
  user: User;
}
export interface LoginResult {
  user: User;
}

/** Thrown for expected, user-facing auth problems. */
export class AuthError extends Error {
  constructor(
    message: string,
    readonly code:
      | "EMAIL_TAKEN"
      | "INVALID_CREDENTIALS"
      | "USER_NOT_FOUND"
      | "WEAK_PASSWORD"
      | "STORAGE_ERROR"
      | "UNKNOWN" = "UNKNOWN",
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export interface AuthService {
  /** Creates an account and starts a session. Rejects duplicate emails. */
  signup(input: SignupInput): Promise<SignupResult>;
  /** Verifies credentials and starts a session. */
  login(input: LoginInput): Promise<LoginResult>;
  /** Clears the session. Never throws. */
  logout(): Promise<void>;
  /** The signed-in user, or null. Resolves from the stored session. */
  getCurrentUser(): Promise<User | null>;
  /** Updates the profile fields of the current user. */
  updateProfile(patch: Partial<Pick<User, "fullName" | "avatarUrl" | "headline">>): Promise<User>;
  /** Changes the current user's password after verifying the old one. */
  changePassword(currentPassword: string, nextPassword: string): Promise<void>;
  /**
   * Local-only password reset, used because there is no email service.
   * `requestReset` confirms the account exists; `resetPassword` sets a new one.
   */
  requestReset(email: string): Promise<{ email: string }>;
  resetPassword(email: string, nextPassword: string): Promise<void>;
  /** Permanently removes the account and everything it owns. */
  deleteAccount(password: string): Promise<void>;
}

/* ==========================================================================
   CV documents
   ========================================================================== */

export interface CVRecord {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  data: CVData;
  settings: Record<string, unknown>;
  /** Small data-URL preview used on the dashboard grid. */
  thumbnail?: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCVInput {
  userId: string;
  title?: string;
  templateId: string;
  data: CVData;
  settings?: Record<string, unknown>;
}

export interface UpdateCVInput {
  title?: string;
  templateId?: string;
  data?: CVData;
  settings?: Record<string, unknown>;
  thumbnail?: string | null;
  isArchived?: boolean;
}

export class CvError extends Error {
  constructor(
    message: string,
    readonly code: "STORAGE_FULL" | "NOT_FOUND" | "UNKNOWN" = "UNKNOWN",
  ) {
    super(message);
    this.name = "CvError";
  }
}

export interface CvRepository {
  /** Every CV belonging to `userId`, newest first. */
  list(userId: string): Promise<CVRecord[]>;
  /** One CV, or null when it does not exist or belongs to someone else. */
  get(userId: string, id: string): Promise<CVRecord | null>;
  /** Creates and persists a new CV. */
  create(input: CreateCVInput): Promise<CVRecord>;
  /** Applies a partial update and bumps `updatedAt`. */
  update(userId: string, id: string, patch: UpdateCVInput): Promise<CVRecord>;
  /** Copies a CV, returning the new record. */
  duplicate(userId: string, id: string): Promise<CVRecord>;
  /** Removes one CV. */
  remove(userId: string, id: string): Promise<void>;
  /** Removes every CV owned by a user (used when deleting an account). */
  removeAll(userId: string): Promise<void>;
  /** Serialises every CV as a JSON backup payload. */
  exportAll(userId: string): Promise<CVBackup>;
  /** Restores CVs from a backup, skipping ids that already exist. */
  importAll(userId: string, backup: CVBackup): Promise<{ imported: number; skipped: number }>;
}

export interface CVBackup {
  version: 1;
  exportedAt: string;
  cvs: CVRecord[];
}

/* ==========================================================================
   Photos (large binaries live in IndexedDB, not localStorage)
   ========================================================================== */

export interface PhotoStore {
  put(userId: string, key: string, dataUrl: string): Promise<void>;
  get(userId: string, key: string): Promise<string | null>;
  remove(userId: string, key: string): Promise<void>;
  removeAll(userId: string): Promise<void>;
}
