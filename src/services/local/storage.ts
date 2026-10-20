/**
 * Safe wrappers around Web Storage.
 *
 * Everything that touches localStorage/sessionStorage goes through here so we
 * can (a) survive private-mode / disabled-storage environments, and (b) turn
 * the browser's opaque `QuotaExceededError` into a typed error the UI can
 * explain to the user.
 */

export class StorageFullError extends Error {
  constructor(message = "This browser's storage is full.") {
    super(message);
    this.name = "StorageFullError";
  }
}

/** True when we are running where Web Storage exists and is writable. */
export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const probe = "__cvforge_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function isQuotaError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return (
    error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    // Safari reports a bare code 22 with no name.
    (error as { code?: number }).code === 22
  );
}

/** Reads and JSON-parses a key, returning `fallback` for missing/corrupt data. */
export function readJson<T>(storage: Storage | null, key: string, fallback: T): T {
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    // Corrupt JSON should not brick the app — treat it as absent.
    return fallback;
  }
}

/**
 * Writes JSON, translating a quota failure into `StorageFullError`.
 * Throws on failure so callers can surface a specific message.
 */
export function writeJson(storage: Storage | null, key: string, value: unknown): void {
  if (!storage) throw new StorageFullError("Storage is not available in this browser.");
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    if (isQuotaError(error)) throw new StorageFullError();
    throw error;
  }
}

export function removeKey(storage: Storage | null, key: string): void {
  try {
    storage?.removeItem(key);
  } catch {
    // Nothing useful to do — a failed remove is not worth breaking a flow over.
  }
}

/** localStorage, or null when unavailable (SSR / private mode). */
export function localStore(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** sessionStorage, or null when unavailable. */
export function sessionStore(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Rough estimate of how full localStorage is, as a percentage of the widely
 * assumed 5 MB budget. Used to warn before writes start failing.
 */
export interface StorageUsage {
  bytes: number;
  percent: number;
  nearFull: boolean;
}

const ASSUMED_LIMIT_BYTES = 5 * 1024 * 1024;
const NEAR_FULL_PERCENT = 80;

export function estimateUsage(): StorageUsage {
  const storage = localStore();
  if (!storage) return { bytes: 0, percent: 0, nearFull: false };

  let bytes = 0;
  try {
    for (let i = 0; i < storage.length; i += 1) {
      const key = storage.key(i);
      if (key === null) continue;
      const value = storage.getItem(key) ?? "";
      // Each character occupies 2 bytes in the UTF-16 strings Web Storage uses.
      bytes += (key.length + value.length) * 2;
    }
  } catch {
    return { bytes: 0, percent: 0, nearFull: false };
  }

  const percent = Math.min(100, Math.round((bytes / ASSUMED_LIMIT_BYTES) * 100));
  return { bytes, percent, nearFull: percent >= NEAR_FULL_PERCENT };
}

/** Human-readable size for the storage meter. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
