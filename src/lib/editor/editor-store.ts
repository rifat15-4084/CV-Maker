"use client";

import { create } from "zustand";
import {
  createEmptyCVData,
  isSectionVisible,
  newId,
  normalizeCVData,
  orderedSections,
} from "@/lib/cv/defaults";
import type { CVData, CVSettings, SectionKey } from "@/lib/cv/schema";

/* ==========================================================================
   Editor store
   A tiny undo/redo history around the CV document plus save-status tracking.
   Every mutation goes through `commit`, which pushes the previous document
   onto the undo stack — so no code path can accidentally bypass history.
   ========================================================================== */

export type SaveStatus = "saved" | "dirty" | "saving" | "error" | "offline";

interface EditorState {
  cvId: string;
  templateId: string;
  title: string;
  data: CVData;

  /** Undo/redo stacks of whole-document snapshots. */
  past: CVData[];
  future: CVData[];

  saveStatus: SaveStatus;
  lastSavedAt: number | null;
  /** Bumped by the auto-save effect to schedule a write. */
  changeToken: number;

  initialize: (input: {
    cvId: string;
    templateId: string;
    title: string;
    data: unknown;
  }) => void;

  /** Applies a recipe to a draft copy of the document and commits it. */
  update: (recipe: (draft: CVData) => void, options?: { history?: boolean }) => void;
  replaceData: (next: CVData, options?: { history?: boolean }) => void;

  setTemplate: (templateId: string) => void;
  setTitle: (title: string) => void;
  setAccent: (accent: string) => void;
  setFont: (font: string) => void;
  setSpacing: (spacing: CVSettings["spacing"]) => void;
  setLetterSpacing: (value: CVSettings["letterSpacing"]) => void;

  toggleSection: (key: SectionKey, visible: boolean) => void;
  setSectionOrder: (order: SectionKey[]) => void;

  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  setSaveStatus: (status: SaveStatus) => void;
  markSaved: (at?: number) => void;

  loadSample: (data: CVData) => void;
  resetToEmpty: () => void;
}

/** Deep clone that works for our plain-JSON CV documents. */
function clone(data: CVData): CVData {
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(data);
    } catch {
      /* fall through to JSON */
    }
  }
  return JSON.parse(JSON.stringify(data)) as CVData;
}

const HISTORY_LIMIT = 60;

export const useEditorStore = create<EditorState>((set, get) => ({
  cvId: "",
  templateId: "aurora",
  title: "Untitled CV",
  data: createEmptyCVData(),
  past: [],
  future: [],
  saveStatus: "saved",
  lastSavedAt: null,
  changeToken: 0,

  initialize: ({ cvId, templateId, title, data }) =>
    set({
      cvId,
      templateId,
      title,
      data: normalizeCVData(data),
      past: [],
      future: [],
      saveStatus: "saved",
      lastSavedAt: null,
      changeToken: 0,
    }),

  update: (recipe, options) => {
    const { data, past } = get();
    const draft = clone(data);
    recipe(draft);
    const next = normalizeCVData(draft);
    const useHistory = options?.history !== false;
    set({
      data: next,
      past: useHistory ? [...past, data].slice(-HISTORY_LIMIT) : past,
      future: useHistory ? [] : get().future,
      saveStatus: "dirty",
      changeToken: get().changeToken + 1,
    });
  },

  replaceData: (next, options) => {
    const { data, past } = get();
    const useHistory = options?.history !== false;
    set({
      data: normalizeCVData(next),
      past: useHistory ? [...past, data].slice(-HISTORY_LIMIT) : past,
      future: useHistory ? [] : get().future,
      saveStatus: "dirty",
      changeToken: get().changeToken + 1,
    });
  },

  setTemplate: (templateId) =>
    set({ templateId, saveStatus: "dirty", changeToken: get().changeToken + 1 }),

  setTitle: (title) => set({ title, saveStatus: "dirty", changeToken: get().changeToken + 1 }),

  setAccent: (accent) =>
    get().update((draft) => {
      draft.settings.accent = accent;
    }),

  setFont: (font) =>
    get().update((draft) => {
      draft.settings.font = font;
    }),

  setSpacing: (spacing) =>
    get().update((draft) => {
      draft.settings.spacing = spacing;
    }),

  setLetterSpacing: (value) =>
    get().update((draft) => {
      draft.settings.letterSpacing = value;
    }),

  toggleSection: (key, visible) =>
    get().update((draft) => {
      draft.settings.sectionVisibility = {
        ...draft.settings.sectionVisibility,
        [key]: visible,
      };
    }),

  setSectionOrder: (order) =>
    get().update((draft) => {
      draft.settings.sectionOrder = order;
    }),

  undo: () => {
    const { past, data, future } = get();
    if (!past.length) return;
    const previous = past[past.length - 1];
    set({
      data: previous,
      past: past.slice(0, -1),
      future: [data, ...future].slice(0, HISTORY_LIMIT),
      saveStatus: "dirty",
      changeToken: get().changeToken + 1,
    });
  },

  redo: () => {
    const { future, data, past } = get();
    if (!future.length) return;
    const next = future[0];
    set({
      data: next,
      future: future.slice(1),
      past: [...past, data].slice(-HISTORY_LIMIT),
      saveStatus: "dirty",
      changeToken: get().changeToken + 1,
    });
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  setSaveStatus: (status) => set({ saveStatus: status }),
  markSaved: (at = Date.now()) => set({ saveStatus: "saved", lastSavedAt: at }),

  loadSample: (data) =>
    get().update((draft) => {
      const sample = clone(data);
      Object.assign(draft, sample);
    }),

  resetToEmpty: () =>
    get().update((draft) => {
      const { accent, font, spacing, letterSpacing } = draft.settings;
      const empty = createEmptyCVData({ accent, font, spacing, letterSpacing });
      Object.assign(draft, empty);
    }),
}));

/** Convenience selectors used around the editor UI. */
export function useOrderedSections(): SectionKey[] {
  return useEditorStore((state) => orderedSections(state.data.settings));
}

export function useSectionVisible(key: SectionKey): boolean {
  return useEditorStore((state) => isSectionVisible(state.data.settings, key));
}

export { newId };
