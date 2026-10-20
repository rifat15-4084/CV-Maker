"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { useEditorStore } from "@/lib/editor/editor-store";
import { cvRepository, CvError } from "@/services";

export interface AutoSave {
  /** Persist immediately. Safe to call concurrently — writes are serialised. */
  save: () => void;
  /** True once a write has failed for a storage reason. */
  offline: boolean;
  /** True while a write is in flight. */
  saving: boolean;
}

/**
 * Serialised auto-save for the editor.
 *
 * Reads the document straight from the store so the function identity is stable
 * and effects can depend on it without re-arming timers. Concurrent calls queue:
 * at most one write is ever in flight, and a call that arrives mid-write causes
 * a single follow-up write with the newest state.
 *
 * Writes go to the local `CvRepository`, so the only realistic failure is a full
 * browser store — which is surfaced with the repository's own message rather
 * than a generic "offline".
 */
export function useAutoSave(userId: string | null): AutoSave {
  const toast = useToast();
  const [offline, setOffline] = useState(false);
  const [saving, setSaving] = useState(false);

  const savingRef = useRef(false);
  const pendingRef = useRef(false);
  // Keep a stable reference to the latest `save` for the recursive retry.
  const saveRef = useRef<() => void>(() => {});
  const userIdRef = useRef(userId);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  const save = useCallback(() => {
    const run = async () => {
      const state = useEditorStore.getState();
      const uid = userIdRef.current;
      if (!state.cvId || !uid) return;

      if (savingRef.current) {
        pendingRef.current = true;
        return;
      }

      savingRef.current = true;
      setSaving(true);
      state.setSaveStatus("saving");

      try {
        await cvRepository.update(uid, state.cvId, {
          title: state.title,
          templateId: state.templateId,
          data: state.data,
        });
        state.markSaved(Date.now());
        setOffline(false);
      } catch (error) {
        if (error instanceof CvError && error.code === "NOT_FOUND") {
          // The CV was deleted in another tab — there is nothing to save into.
          toast.error("This CV no longer exists", "It may have been deleted in another tab.");
          state.setSaveStatus("error");
        } else if (error instanceof CvError && error.code === "STORAGE_FULL") {
          // Storage is full: stop retrying automatically and tell the user how
          // to recover, because hammering the quota will never succeed.
          setOffline(true);
          state.setSaveStatus("offline");
          toast.error("Browser storage is full", error.message);
        } else {
          setOffline(true);
          state.setSaveStatus("offline");
        }
      } finally {
        savingRef.current = false;
        setSaving(false);
        if (pendingRef.current) {
          pendingRef.current = false;
          saveRef.current();
        }
      }
    };

    void run();
  }, [toast]);

  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  // Retry once the pressure eases (a tab regains focus, storage freed elsewhere).
  useEffect(() => {
    const retry = () => {
      const { saveStatus } = useEditorStore.getState();
      if (saveStatus === "offline" || saveStatus === "error") {
        setOffline(false);
        save();
      }
    };
    window.addEventListener("online", retry);
    window.addEventListener("focus", retry);
    return () => {
      window.removeEventListener("online", retry);
      window.removeEventListener("focus", retry);
    };
  }, [save]);

  return { save, offline, saving };
}
