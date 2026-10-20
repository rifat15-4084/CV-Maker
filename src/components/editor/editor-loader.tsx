"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { AuthSkeleton } from "@/components/auth/auth-skeleton";
import { ButtonLink } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { useEditorStore } from "@/lib/editor/editor-store";
import { cvRepository } from "@/services";
import { getTemplateConfigOrFallback } from "@/templates/registry";
import { EditorClient } from "./editor-client";

/**
 * Loads one CV from the local repository and seeds the editor store.
 *
 * This replaces the previous server component: with the data in localStorage,
 * the document can only be read after hydration, so a skeleton is shown until
 * the store has been seeded. `initialize` is idempotent for a given id, so a
 * re-render or Fast Refresh never clobbers unsaved edits.
 */
export function EditorLoader({ cvId }: { cvId: string }) {
  const { user, isLoading } = useAuth();
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    void (async () => {
      const record = await cvRepository.get(user.id, cvId);
      if (cancelled) return;

      if (!record) {
        setState("missing");
        return;
      }

      const store = useEditorStore.getState();
      if (store.cvId !== record.id) {
        store.initialize({
          cvId: record.id,
          templateId: getTemplateConfigOrFallback(record.templateId).id,
          title: record.title,
          data: record.data,
        });
      }
      setState("ready");
    })();

    return () => {
      cancelled = true;
    };
  }, [user, cvId]);

  if (isLoading || state === "loading") return <AuthSkeleton />;

  if (state === "missing" || !user) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-white/5 text-ink-400">
          <FileQuestion className="size-7" aria-hidden />
        </span>
        <h1 className="mt-5 text-xl font-semibold">CV not found</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-400">
          This CV is not in this browser. It may have been deleted, or it was created on another
          device — import a backup to bring it back.
        </p>
        <div className="mt-6 flex gap-3">
          <ButtonLink href="/dashboard">Back to my CVs</ButtonLink>
          <Link
            href="/templates/select"
            className="inline-flex items-center rounded-xl border border-[var(--border-soft)] bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
          >
            Start a new CV
          </Link>
        </div>
      </div>
    );
  }

  const templateId = useEditorStore.getState().templateId;
  return <EditorClient initialTemplateId={templateId} userId={user.id} />;
}
