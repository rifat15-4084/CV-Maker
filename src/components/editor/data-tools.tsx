"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileUp, RotateCcw, Sparkles, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/field";
import { useToast } from "@/components/providers/toast-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { useEditorStore } from "@/lib/editor/editor-store";
import { createSampleCVData } from "@/lib/cv/sample-data";
import { normalizeCVData } from "@/lib/cv/defaults";
import { cvRepository, CvError } from "@/services";

/**
 * Document-level actions that do not belong to a single section: fill with
 * sample data, wipe back to empty, round-trip the JSON, and delete the CV.
 */
export function DataTools() {
  const toast = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const cvId = useEditorStore((state) => state.cvId);
  const title = useEditorStore((state) => state.title);
  const data = useEditorStore((state) => state.data);
  const loadSample = useEditorStore((state) => state.loadSample);
  const resetToEmpty = useEditorStore((state) => state.resetToEmpty);
  const replaceData = useEditorStore((state) => state.replaceData);

  const fileRef = useRef<HTMLInputElement>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  const [sampleOpen, setSampleOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function exportJson() {
    const payload = JSON.stringify({ title, data }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${(title || "cv").replace(/[^\w\-]+/g, "_")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Exported", "Your CV JSON has been downloaded.");
  }

  function readFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      applyImport(text);
    };
    reader.onerror = () => setImportError("Could not read that file.");
    reader.readAsText(file);
  }

  function applyImport(raw: string) {
    try {
      const parsed = JSON.parse(raw) as { data?: unknown } & Record<string, unknown>;
      const candidate = parsed && typeof parsed === "object" && "data" in parsed ? parsed.data : parsed;
      const next = normalizeCVData(candidate);
      const hasAnything =
        next.personal.firstName ||
        next.personal.lastName ||
        next.experience.length > 0 ||
        next.summary;
      if (!hasAnything) {
        setImportError("That file does not look like a CV Maker export.");
        return;
      }
      replaceData(next);
      setImportOpen(false);
      setImportText("");
      setImportError(null);
      toast.success("Imported", "Review the content, then save your CV.");
    } catch {
      setImportError("That file is not valid JSON.");
    }
  }

  async function handleDelete() {
    if (!user || !cvId) {
      toast.error("Could not delete", "This CV is not loaded.");
      return;
    }
    setDeleting(true);
    try {
      await cvRepository.remove(user.id, cvId);
      toast.success("Deleted", "The CV has been removed.");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        "Could not delete",
        error instanceof CvError ? error.message : "Please try again.",
      );
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" onClick={() => setSampleOpen(true)}>
          <Sparkles className="size-4" aria-hidden />
          Sample data
        </Button>
        <Button variant="outline" size="sm" onClick={() => setResetOpen(true)}>
          <RotateCcw className="size-4" aria-hidden />
          Reset
        </Button>
        <Button variant="outline" size="sm" onClick={exportJson}>
          <Download className="size-4" aria-hidden />
          Export JSON
        </Button>
        <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
          <Upload className="size-4" aria-hidden />
          Import JSON
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        fullWidth
        className="text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 className="size-4" aria-hidden />
        Delete this CV
      </Button>

      <ConfirmDialog
        open={sampleOpen}
        onClose={() => setSampleOpen(false)}
        onConfirm={() => {
          loadSample(createSampleCVData());
          setSampleOpen(false);
          toast.info("Sample applied", "Undo is available if you want your content back.");
        }}
        title="Fill with sample data?"
        description="This replaces what is currently in the editor with a realistic example CV. You can undo it."
        confirmLabel="Fill with sample"
      />

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => {
          resetToEmpty();
          setResetOpen(false);
          toast.info("Cleared", "All sections were emptied. Undo is available.");
        }}
        title="Clear everything?"
        description="All sections will be emptied. Your accent, font and section settings are kept. You can undo this."
        confirmLabel="Clear all content"
        destructive
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this CV?"
        description="This permanently removes the CV and cannot be undone."
        confirmLabel="Delete CV"
        destructive
      />

      <Modal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        title="Import a CV"
        description="Paste or upload a CV Maker JSON export."
        footer={
          <>
            <Button variant="ghost" onClick={() => setImportOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <FileUp className="size-4" aria-hidden />
              Choose file
            </Button>
            <Button onClick={() => applyImport(importText)} disabled={!importText.trim()}>
              Import
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) readFile(file);
              event.target.value = "";
            }}
          />
          <Textarea
            rows={10}
            value={importText}
            onChange={(event) => {
              setImportText(event.target.value);
              setImportError(null);
            }}
            placeholder='{"title":"My CV","data":{ … }}'
            aria-label="CV JSON"
            className="font-mono text-xs"
          />
          {importError ? (
            <p className="text-xs font-medium text-rose-400" role="alert">
              {importError}
            </p>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
