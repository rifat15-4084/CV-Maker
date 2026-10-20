/**
 * Password hashing for the local auth service.
 *
 * This is NOT a substitute for a real backend: hashing in the browser protects
 * against casual inspection of localStorage (`cvforge_users`), not against an
 * attacker who already controls the machine. A server-side `AuthService` would
 * replace this file with real credential storage.
 *
 * Uses PBKDF2-SHA-256 with a per-user random salt and a high iteration count,
 * which is the strongest primitive available from the Web Crypto API.
 */

const PBKDF2_ITERATIONS = 210_000;
const KEY_LENGTH_BITS = 256;
const SALT_BYTES = 16;

/** Cryptographically random hex string, used as the per-user salt. */
export function createSalt(): string {
  const bytes = new Uint8Array(SALT_BYTES);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
}

export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array {
  const clean = hex.length % 2 === 0 ? hex : `0${hex}`;
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

async function derive(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: fromHex(salt) as unknown as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    KEY_LENGTH_BITS,
  );

  return toHex(new Uint8Array(bits));
}

/** Hashes a password with the given salt. Returns a hex digest. */
export async function hashPassword(password: string, salt: string): Promise<string> {
  return derive(password, salt);
}

/** Creates a fresh salt and hash pair for a new password. */
export async function createCredential(
  password: string,
): Promise<{ salt: string; passwordHash: string }> {
  const salt = createSalt();
  const passwordHash = await hashPassword(password, salt);
  return { salt, passwordHash };
}

/**
 * Constant-time-ish comparison. Both inputs are fixed-length hex digests, so a
 * simple length check followed by an XOR accumulate avoids early-exit leaks.
 */
export function verifyPassword(
  candidateHash: string,
  storedHash: string,
): boolean {
  if (candidateHash.length !== storedHash.length) return false;
  let diff = 0;
  for (let i = 0; i < candidateHash.length; i += 1) {
    diff |= candidateHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return diff === 0;
}
