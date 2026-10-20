/**
 * The single place where concrete service implementations are chosen.
 *
 * ── Swapping in a backend later ────────────────────────────────────────────
 * 1. Write `src/services/supabase/auth-service.ts` implementing `AuthService`.
 * 2. Write `src/services/supabase/cv-repository.ts` implementing `CvRepository`.
 * 3. Replace the two exports below with the new classes.
 *
 * No UI component imports a concrete implementation, so nothing else changes.
 */

import type { AuthService, CvRepository, PhotoStore } from "./types";
import { LocalAuthService } from "./local/auth-service";
import { LocalCvRepository } from "./local/cv-repository";
import { IndexedDbPhotoStore } from "./local/photo-store";

/** Active auth implementation. */
export const authService: AuthService = new LocalAuthService();

/** Active CV storage implementation. */
export const cvRepository: CvRepository = new LocalCvRepository();

/** Active photo (binary) storage implementation. */
export const photoStore: PhotoStore = new IndexedDbPhotoStore();

export * from "./types";
