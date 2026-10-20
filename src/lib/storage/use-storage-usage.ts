"use client";

import { useSyncExternalStore } from "react";
import { estimateUsage, type StorageUsage } from "@/services/local/storage";

/**
 * Live browser-storage usage, read as untracked external state.
 *
 * `useSyncExternalStore` requires `getSnapshot` to return a *referentially
 * stable* value — returning a fresh object on every call makes React re-render
 * forever. The snapshot is therefore cached and only rebuilt when the measured
 * byte count actually changes. A module-level cache is safe here because every
 * consumer of this hook wants the same origin-wide number.
 */

const EMPTY: StorageUsage = { bytes: 0, percent: 0, nearFull: false };

let cached: StorageUsage = EMPTY;

function getSnapshot(): StorageUsage {
  const next = estimateUsage();
  // Reuse the previous object unless the underlying data really moved. This is
  // what keeps React from looping: identical bytes → identical reference.
  if (next.bytes === cached.bytes && next.percent === cached.percent) return cached;
  cached = next;
  return cached;
}

function getServerSnapshot(): StorageUsage {
  return EMPTY;
}

function subscribe(onChange: () => void) {
  window.addEventListener("focus", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("focus", onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useStorageUsage(): StorageUsage {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
