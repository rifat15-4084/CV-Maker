import { describe, expect, it } from "vitest";
import {
  StorageFullError,
  estimateUsage,
  formatBytes,
  readJson,
  removeKey,
  writeJson,
} from "./storage";

/** Minimal in-memory stand-in for the Web Storage API. */
function fakeStorage(limit = Infinity): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => (map.has(key) ? (map.get(key) as string) : null),
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => void map.delete(key),
    setItem: (key: string, value: string) => {
      // Approximate the browser's per-origin budget so quota handling is testable.
      const size = Array.from(map.entries()).reduce((sum, [k, v]) => sum + k.length + v.length, 0);
      if (size + key.length + value.length > limit) {
        const error = new Error("quota") as Error & { code?: number };
        error.name = "QuotaExceededError";
        error.code = 22;
        throw error;
      }
      map.set(key, value);
    },
  } as Storage;
}

describe("readJson", () => {
  it("returns the fallback when the store is null", () => {
    expect(readJson(null, "k", { a: 1 })).toEqual({ a: 1 });
  });

  it("returns the fallback for a missing key", () => {
    expect(readJson(fakeStorage(), "missing", [])).toEqual([]);
  });

  it("parses stored JSON", () => {
    const store = fakeStorage();
    store.setItem("k", JSON.stringify({ a: 1 }));
    expect(readJson(store, "k", null)).toEqual({ a: 1 });
  });

  it("returns the fallback for corrupt JSON instead of throwing", () => {
    const store = fakeStorage();
    store.setItem("k", "{not json");
    expect(readJson(store, "k", "fallback")).toBe("fallback");
  });
});

describe("writeJson", () => {
  it("round-trips a value", () => {
    const store = fakeStorage();
    writeJson(store, "k", { a: 1 });
    expect(store.getItem("k")).toBe('{"a":1}');
  });

  it("throws StorageFullError when the quota is exceeded", () => {
    const store = fakeStorage(10);
    expect(() => writeJson(store, "big", "x".repeat(100))).toThrow(StorageFullError);
  });

  it("throws StorageFullError when storage is unavailable", () => {
    expect(() => writeJson(null, "k", 1)).toThrow(StorageFullError);
  });
});

describe("removeKey", () => {
  it("removes a key and tolerates a null store", () => {
    const store = fakeStorage();
    writeJson(store, "k", 1);
    removeKey(store, "k");
    expect(store.getItem("k")).toBeNull();
    expect(() => removeKey(null, "k")).not.toThrow();
  });
});

describe("estimateUsage", () => {
  it("reports zero when storage is unavailable (SSR)", () => {
    expect(estimateUsage()).toEqual({ bytes: 0, percent: 0, nearFull: false });
  });
});

describe("formatBytes", () => {
  it("scales the unit to the magnitude", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2.0 KB");
    expect(formatBytes(3 * 1024 * 1024)).toBe("3.00 MB");
  });
});
