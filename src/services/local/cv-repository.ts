import {
  CvError,
  type CVBackup,
  type CVRecord,
  type CreateCVInput,
  type CvRepository,
  type UpdateCVInput,
} from "@/services/types";
import { normalizeCVData } from "@/lib/cv/defaults";
import type { CVData } from "@/lib/cv/schema";
import { StorageFullError, localStore, readJson, removeKey, writeJson } from "./storage";

/** One localStorage key per user, as specified: `cvforge_cvs_<userId>`. */
export function cvsKey(userId: string): string {
  return `cvforge_cvs_${userId}`;
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `cv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Coerces a stored row into a fully-populated CVRecord. */
function hydrate(row: Partial<CVRecord> & { id: string; userId: string }): CVRecord {
  const data = normalizeCVData(row.data);
  return {
    id: row.id,
    userId: row.userId,
    title: row.title ?? "Untitled CV",
    templateId: row.templateId ?? "aurora",
    data,
    settings: (row.settings as Record<string, unknown>) ?? (data.settings as Record<string, unknown>),
    thumbnail: row.thumbnail ?? null,
    isArchived: row.isArchived ?? false,
    createdAt: row.createdAt ?? new Date().toISOString(),
    updatedAt: row.updatedAt ?? new Date().toISOString(),
  };
}

/**
 * localStorage-backed CV storage, scoped per user.
 *
 * Photos do NOT live here — see `IndexedDbPhotoStore`. CV documents are kept in
 * localStorage because they are small, cheap to read synchronously, and easy
 * for a user to inspect or back up.
 */
export class LocalCvRepository implements CvRepository {
  private readAll(userId: string): CVRecord[] {
    const rows = readJson<CVRecord[]>(localStore(), cvsKey(userId), []);
    if (!Array.isArray(rows)) return [];
    return rows
      .filter((row) => row && typeof row.id === "string")
      .map((row) => hydrate({ ...row, userId }));
  }

  private writeAll(userId: string, records: CVRecord[]): void {
    try {
      writeJson(localStore(), cvsKey(userId), records);
    } catch (error) {
      if (error instanceof StorageFullError) {
        throw new CvError(
          "This browser's storage is full. Delete a CV, remove a large photo, or export a backup and clear space.",
          "STORAGE_FULL",
        );
      }
      throw error;
    }
  }

  async list(userId: string): Promise<CVRecord[]> {
    return this.readAll(userId).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  async get(userId: string, id: string): Promise<CVRecord | null> {
    return this.readAll(userId).find((record) => record.id === id) ?? null;
  }

  async create(input: CreateCVInput): Promise<CVRecord> {
    const now = new Date().toISOString();
    const data = normalizeCVData(input.data);

    const record: CVRecord = {
      id: createId(),
      userId: input.userId,
      title: input.title?.trim() || "Untitled CV",
      templateId: input.templateId,
      data,
      settings: input.settings ?? (data.settings as Record<string, unknown>),
      thumbnail: null,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    };

    this.writeAll(input.userId, [...this.readAll(input.userId), record]);
    return record;
  }

  async update(userId: string, id: string, patch: UpdateCVInput): Promise<CVRecord> {
    const records = this.readAll(userId);
    const index = records.findIndex((record) => record.id === id);
    if (index === -1) throw new CvError("That CV no longer exists.", "NOT_FOUND");

    const current = records[index];
    const data = patch.data ? normalizeCVData(patch.data) : current.data;

    const next: CVRecord = {
      ...current,
      ...(patch.title !== undefined ? { title: patch.title.trim() || "Untitled CV" } : {}),
      ...(patch.templateId !== undefined ? { templateId: patch.templateId } : {}),
      data,
      ...(patch.settings !== undefined
        ? { settings: patch.settings }
        : patch.data
          ? { settings: data.settings as Record<string, unknown> }
          : {}),
      ...(patch.thumbnail !== undefined ? { thumbnail: patch.thumbnail } : {}),
      ...(patch.isArchived !== undefined ? { isArchived: patch.isArchived } : {}),
      updatedAt: new Date().toISOString(),
    };

    records[index] = next;
    this.writeAll(userId, records);
    return next;
  }

  async duplicate(userId: string, id: string): Promise<CVRecord> {
    const source = await this.get(userId, id);
    if (!source) throw new CvError("That CV no longer exists.", "NOT_FOUND");

    const now = new Date().toISOString();
    const copy: CVRecord = {
      ...source,
      id: createId(),
      title: `${source.title} (copy)`,
      createdAt: now,
      updatedAt: now,
    };

    this.writeAll(userId, [...this.readAll(userId), copy]);
    return copy;
  }

  async remove(userId: string, id: string): Promise<void> {
    const records = this.readAll(userId);
    const next = records.filter((record) => record.id !== id);
    if (next.length === records.length) return; // nothing to do
    this.writeAll(userId, next);
  }

  async removeAll(userId: string): Promise<void> {
    removeKey(localStore(), cvsKey(userId));
  }

  async exportAll(userId: string): Promise<CVBackup> {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      cvs: await this.list(userId),
    };
  }

  async importAll(
    userId: string,
    backup: CVBackup,
  ): Promise<{ imported: number; skipped: number }> {
    const incoming = Array.isArray(backup?.cvs) ? backup.cvs : [];
    const existing = this.readAll(userId);
    const existingIds = new Set(existing.map((record) => record.id));

    let imported = 0;
    let skipped = 0;

    for (const row of incoming) {
      if (!row || typeof row !== "object") {
        skipped += 1;
        continue;
      }
      const id = typeof row.id === "string" ? row.id : createId();
      if (existingIds.has(id)) {
        skipped += 1;
        continue;
      }
      existing.push(hydrate({ ...row, id, userId }));
      existingIds.add(id);
      imported += 1;
    }

    if (imported > 0) this.writeAll(userId, existing);
    return { imported, skipped };
  }
}

/**
 * Validates an unknown value as a backup file so a bad import gives a clear
 * error instead of silently corrupting the user's CV list.
 */
export function parseBackup(raw: unknown): CVBackup {
  if (!raw || typeof raw !== "object") {
    throw new CvError("That file is not a CV Maker backup.", "UNKNOWN");
  }
  const candidate = raw as Partial<CVBackup>;
  if (!Array.isArray(candidate.cvs)) {
    throw new CvError("That backup file has no CVs in it.", "UNKNOWN");
  }
  return {
    version: 1,
    exportedAt: candidate.exportedAt ?? new Date().toISOString(),
    cvs: candidate.cvs as CVRecord[],
  };
}

/** Re-exports for callers that only need the data shape. */
export type { CVData };
