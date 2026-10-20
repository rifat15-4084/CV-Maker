"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Cloud,
  CloudOff,
  Download,
  Loader2,
  Palette,
  Redo2,
  Save,
  Settings2,
  TriangleAlert,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useEditorStore } from "@/lib/editor/editor-store";
import { cn } from "@/lib/utils";
import type { SaveStatus } from "@/lib/editor/editor-store";
import type { TemplateConfig } from "@/templates/types";

const STATUS_COPY: Record<SaveStatus, { label: string; className: string }> = {
  saved: { label: "All changes saved", className: "text-emerald-300" },
  dirty: { label: "Unsaved changes", className: "text-ink-400" },
  saving: { label: "Saving…", className: "text-cyan-300" },
  error: { label: "Could not save", className: "text-rose-300" },
  offline: { label: "Offline — will retry", className: "text-amber-300" },
};

function SaveIndicator({ status, lastSavedAt }: { status: SaveStatus; lastSavedAt: number | null }) {
  const copy = STATUS_COPY[status];
  const Icon =
    status === "saving"
      ? Loader2
      : status === "saved"
        ? Check
        : status === "offline"
          ? CloudOff
          : status === "error"
            ? TriangleAlert
            : Cloud;

  const title =
    status === "saved" && lastSavedAt
      ? `Last saved ${new Date(lastSavedAt).toLocaleTimeString()}`
      : copy.label;

  return (
    <span
      title={title}
      aria-live="polite"
      className={cn("inline-flex items-center gap-1.5 text-xs font-medium", copy.className)}
    >
      <Icon className={cn("size-3.5", status === "saving" && "animate-spin")} aria-hidden />
      <span className="hidden sm:inline">{copy.label}</span>
    </span>
  );
}

/**
 * Editor toolbar: back-to-dashboard, inline title rename, undo/redo, save
 * status, appearance controls, template switching and the PDF download.
 */
export function EditorTopBar({
  templates,
  currentTemplate,
  onSaveNow,
  onDownload,
  onOpenAppearance,
}: {
  templates: TemplateConfig[];
  currentTemplate: TemplateConfig;
  onSaveNow: () => void;
  onDownload: () => void;
  onOpenAppearance: () => void;
}) {
  const title = useEditorStore((state) => state.title);
  const setTitle = useEditorStore((state) => state.setTitle);
  const saveStatus = useEditorStore((state) => state.saveStatus);
  const lastSavedAt = useEditorStore((state) => state.lastSavedAt);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const canUndo = useEditorStore((state) => state.past.length > 0);
  const canRedo = useEditorStore((state) => state.future.length > 0);
  const setTemplate = useEditorStore((state) => state.setTemplate);

  const [draftTitle, setDraftTitle] = useState(title);
  const [templateOpen, setTemplateOpen] = useState(false);

  // The store's title is the source of truth; `draftTitle` is the in-progress
  // edit. Re-sync when the store changes underneath us (undo/redo, template
  // switch) using the "adjust state during render" pattern React recommends.
  const [syncedTitle, setSyncedTitle] = useState(title);
  if (syncedTitle !== title) {
    setSyncedTitle(title);
    setDraftTitle(title);
  }

  function commitTitle() {
    const next = draftTitle.trim() || "Untitled CV";
    setDraftTitle(next);
    if (next !== title) setTitle(next);
  }

  return (
    <header className="no-print sticky top-0 z-40 border-b border-[var(--border-soft)] bg-[var(--page-bg)]/85 backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 sm:px-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-sm text-ink-300 transition hover:bg-white/5 hover:text-[var(--page-fg)]"
        >
          <ArrowLeft className="size-4" aria-hidden />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        <div className="mx-1 hidden h-6 w-px bg-[var(--border-soft)] sm:block" aria-hidden />

        <Input
          value={draftTitle}
          onChange={(event) => setDraftTitle(event.target.value)}
          onBlur={commitTitle}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
            if (event.key === "Escape") {
              setDraftTitle(title);
              event.currentTarget.blur();
            }
          }}
          aria-label="CV title"
          className="h-9 w-36 border-transparent bg-transparent px-2 font-medium sm:w-56"
        />

        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <SaveIndicator status={saveStatus} lastSavedAt={lastSavedAt} />

          <span className="mx-1 hidden h-6 w-px bg-[var(--border-soft)] sm:block" aria-hidden />

          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!canUndo}
            title="Undo"
            aria-label="Undo"
          >
            <Undo2 className="size-4" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!canRedo}
            title="Redo"
            aria-label="Redo"
          >
            <Redo2 className="size-4" aria-hidden />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSaveNow}
            disabled={saveStatus === "saving"}
            title="Save now (Ctrl/⌘ + S)"
          >
            <Save className="size-4" aria-hidden />
            <span className="hidden md:inline">Save</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenAppearance}
            title="Accent colour and font"
          >
            <Palette className="size-4" aria-hidden />
            <span className="hidden md:inline">Style</span>
          </Button>

          <Button variant="outline" size="sm" onClick={() => setTemplateOpen(true)}>
            <Settings2 className="size-4" aria-hidden />
            <span className="hidden md:inline">Template</span>
          </Button>

          <Button variant="primary" size="sm" onClick={onDownload}>
            <Download className="size-4" aria-hidden />
            <span className="hidden sm:inline">Download PDF</span>
          </Button>
        </div>
      </div>

      <Modal
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        title="Change template"
        description="Your content is kept — only the layout changes. Hidden data stays saved."
        size="lg"
      >
        <div className="space-y-3">
          <Select
            value={currentTemplate.id}
            onChange={(event) => {
              setTemplate(event.target.value);
              setTemplateOpen(false);
            }}
            aria-label="Choose a template"
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} — {template.category}
              </option>
            ))}
          </Select>
          <p className="text-xs leading-relaxed text-ink-500">{currentTemplate.description}</p>
        </div>
      </Modal>
    </header>
  );
}
