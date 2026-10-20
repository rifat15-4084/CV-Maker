"use client";

import { create } from "zustand";

/* ==========================================================================
   Template selection store.

   Hovering or selecting a template card used to re-render the entire gallery
   grid, because the selection lived in the grid's own `useState` and every card
   was re-created inside `filtered.map`.

   Selection now lives here. Cards subscribe to *only their own* id via
   `useTemplateSelected(id)`, so a hover changes one card's subscriber set and
   nothing else re-renders. The grid itself never subscribes at all.
   ========================================================================== */

export interface TemplateSelectionState {
  hoveredId: string | null;
  selectedId: string | null;
  setHovered: (id: string | null) => void;
  setSelected: (id: string | null) => void;
}

export const useTemplateSelection = create<TemplateSelectionState>((set) => ({
  hoveredId: null,
  selectedId: null,
  setHovered: (id) => set((state) => (state.hoveredId === id ? state : { hoveredId: id })),
  setSelected: (id) => set((state) => (state.selectedId === id ? state : { selectedId: id })),
}));

/** True when this card is the selected one. Subscribes to a primitive only. */
export function useIsTemplateSelected(id: string): boolean {
  return useTemplateSelection((state) => state.selectedId === id);
}

/** Stable action handles — do not subscribe to state, so they never re-render. */
export const templateSelectionActions = {
  setHovered: (id: string | null) => useTemplateSelection.getState().setHovered(id),
  setSelected: (id: string | null) => useTemplateSelection.getState().setSelected(id),
};
