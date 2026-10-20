import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { PhotoStore } from "@/services/types";

/**
 * IndexedDB-backed store for large binary payloads (uploaded photos).
 *
 * These deliberately live outside localStorage: a single base64 photo can blow
 * past the ~5 MB localStorage budget on its own, and a quota failure there
 * would take the whole CV list down with it. IndexedDB has far more headroom
 * and fails independently.
 */

const DB_NAME = "cvforge";
const DB_VERSION = 1;
const PHOTOS_STORE = "photos";

interface PhotoRecord {
  /** `${userId}:${key}` — one flat store, scoped by prefix. */
  id: string;
  userId: string;
  key: string;
  dataUrl: string;
  updatedAt: string;
}

interface CVForgeDB extends DBSchema {
  photos: {
    key: string;
    value: PhotoRecord;
    indexes: { byUser: string };
  };
}

let dbPromise: Promise<IDBPDatabase<CVForgeDB>> | null = null;

/** Lazily opens (and caches) the database. SSR-safe: never called on the server. */
function getDb(): Promise<IDBPDatabase<CVForgeDB>> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB is not available in this browser."));
  }
  dbPromise ??= openDB<CVForgeDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(PHOTOS_STORE)) {
        const store = db.createObjectStore(PHOTOS_STORE, { keyPath: "id" });
        store.createIndex("byUser", "userId");
      }
    },
  });
  return dbPromise;
}

const compositeKey = (userId: string, key: string) => `${userId}:${key}`;

export class IndexedDbPhotoStore implements PhotoStore {
  async put(userId: string, key: string, dataUrl: string): Promise<void> {
    const db = await getDb();
    await db.put(PHOTOS_STORE, {
      id: compositeKey(userId, key),
      userId,
      key,
      dataUrl,
      updatedAt: new Date().toISOString(),
    });
  }

  async get(userId: string, key: string): Promise<string | null> {
    try {
      const db = await getDb();
      const record = await db.get(PHOTOS_STORE, compositeKey(userId, key));
      return record?.dataUrl ?? null;
    } catch {
      // A read failure should degrade to "no photo", never break the editor.
      return null;
    }
  }

  async remove(userId: string, key: string): Promise<void> {
    try {
      const db = await getDb();
      await db.delete(PHOTOS_STORE, compositeKey(userId, key));
    } catch {
      /* best effort */
    }
  }

  async removeAll(userId: string): Promise<void> {
    try {
      const db = await getDb();
      const keys = await db.getAllKeysFromIndex(PHOTOS_STORE, "byUser", userId);
      const tx = db.transaction(PHOTOS_STORE, "readwrite");
      await Promise.all([...keys.map((key) => tx.store.delete(key)), tx.done]);
    } catch {
      /* best effort */
    }
  }
}
