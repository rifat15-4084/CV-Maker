import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocalCvRepository, cvsKey, parseBackup } from "./cv-repository";
import { createEmptyCVData } from "@/lib/cv/defaults";
import { CvError } from "@/services/types";

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

let storage: Storage;

beforeEach(() => {
  storage = fakeStorage();
  // The storage helpers read `window.localStorage`, so provide a minimal window.
  vi.stubGlobal("window", { localStorage: storage, sessionStorage: fakeStorage() });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const repo = new LocalCvRepository();

function sampleInput(userId: string, title = "My CV") {
  return {
    userId,
    title,
    templateId: "aurora",
    data: createEmptyCVData(),
  };
}

describe("LocalCvRepository", () => {
  it("stores under the per-user key `cvforge_cvs_<userId>`", async () => {
    const record = await repo.create(sampleInput("user-1"));
    expect(record.userId).toBe("user-1");
    expect(storage.getItem(cvsKey("user-1"))).toContain(record.id);
    expect(storage.getItem(cvsKey("user-2"))).toBeNull();
  });

  it("keeps two users' CVs completely separate", async () => {
    const a = await repo.create(sampleInput("user-a", "A CV"));
    await repo.create(sampleInput("user-b", "B CV"));

    const listA = await repo.list("user-a");
    const listB = await repo.list("user-b");

    expect(listA).toHaveLength(1);
    expect(listB).toHaveLength(1);
    expect(listA[0].id).toBe(a.id);
    expect(listA[0].title).toBe("A CV");
    expect(listB[0].title).toBe("B CV");

    // One user cannot read the other's record by id.
    expect(await repo.get("user-a", listB[0].id)).toBeNull();
  });

  it("returns CVs newest-first by updatedAt", async () => {
    const first = await repo.create(sampleInput("user-1", "First"));
    await new Promise((resolve) => setTimeout(resolve, 5));
    const second = await repo.create(sampleInput("user-1", "Second"));

    const list = await repo.list("user-1");
    expect(list.map((cv) => cv.id)).toEqual([second.id, first.id]);
  });

  it("applies a partial update and bumps updatedAt", async () => {
    const record = await repo.create(sampleInput("user-1"));
    const before = record.updatedAt;

    await new Promise((resolve) => setTimeout(resolve, 5));
    const updated = await repo.update("user-1", record.id, { title: "Renamed" });

    expect(updated.title).toBe("Renamed");
    expect(updated.updatedAt >= before).toBe(true);
  });

  it("throws NOT_FOUND when updating a record that is not there", async () => {
    await expect(repo.update("user-1", "nope", { title: "x" })).rejects.toBeInstanceOf(CvError);
  });

  it("duplicates a CV with a new id and a copy suffix", async () => {
    const record = await repo.create(sampleInput("user-1", "Original"));
    const copy = await repo.duplicate("user-1", record.id);

    expect(copy.id).not.toBe(record.id);
    expect(copy.title).toBe("Original (copy)");
    expect(await repo.list("user-1")).toHaveLength(2);
  });

  it("removes a CV", async () => {
    const record = await repo.create(sampleInput("user-1"));
    await repo.remove("user-1", record.id);
    expect(await repo.list("user-1")).toHaveLength(0);
  });

  it("removes every CV for a user without touching another user's", async () => {
    await repo.create(sampleInput("user-a"));
    await repo.create(sampleInput("user-b"));
    await repo.removeAll("user-a");

    expect(await repo.list("user-a")).toHaveLength(0);
    expect(await repo.list("user-b")).toHaveLength(1);
  });

  it("round-trips through export and import, skipping existing ids", async () => {
    await repo.create(sampleInput("user-1", "One"));
    await repo.create(sampleInput("user-1", "Two"));

    const backup = await repo.exportAll("user-1");
    expect(backup.version).toBe(1);
    expect(backup.cvs).toHaveLength(2);

    // Import into a fresh user: both are new.
    const fresh = await repo.importAll("user-2", backup);
    expect(fresh).toEqual({ imported: 2, skipped: 0 });
    expect(await repo.list("user-2")).toHaveLength(2);

    // Import the same backup again: both ids already exist.
    const again = await repo.importAll("user-2", backup);
    expect(again).toEqual({ imported: 0, skipped: 2 });
  });
});

describe("parseBackup", () => {
  it("rejects a non-object", () => {
    expect(() => parseBackup(null)).toThrow(CvError);
    expect(() => parseBackup("nope")).toThrow(CvError);
  });

  it("rejects a payload with no cv array", () => {
    expect(() => parseBackup({ version: 1 })).toThrow(CvError);
  });

  it("accepts a well-formed backup", () => {
    const parsed = parseBackup({ version: 1, exportedAt: "2026-01-01", cvs: [] });
    expect(parsed.cvs).toEqual([]);
  });
});
