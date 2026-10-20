"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Move, Trash2, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/providers/toast-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { photoStore } from "@/services";
import { useEditorStore } from "@/lib/editor/editor-store";
import { cn } from "@/lib/utils";

const MAX_BYTES = 2 * 1024 * 1024;
const OUTPUT_SIZE = 640;

type Shape = "circle" | "square";

/**
 * Photo upload with a simple pan/zoom cropper.
 *
 * The crop is rendered to a square canvas at 640px and stored as a compressed
 * data URL inside the CV document, so the CV stays self-contained and every
 * export path (editor preview, print route, PDF) has the image available with no
 * extra lookup. A copy of the full-size original is also kept in IndexedDB,
 * because base64 photos are exactly the payload localStorage cannot hold.
 */
export function PhotoUploader({ hasPhoto }: { hasPhoto: boolean }) {
  const toast = useToast();
  const { user } = useAuth();
  const cvId = useEditorStore((state) => state.cvId);
  const photo = useEditorStore((state) => state.data.personal.photo);
  const update = useEditorStore((state) => state.update);
  const inputRef = useRef<HTMLInputElement>(null);

  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [shape, setShape] = useState<Shape>("circle");
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef<{ x: number; y: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const closeCropper = useCallback(() => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    setSourceUrl(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    if (inputRef.current) inputRef.current.value = "";
  }, [sourceUrl]);

  useEffect(() => () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  }, [sourceUrl]);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Unsupported file", "Please choose a PNG, JPEG or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image too large", "Photos must be under 2 MB.");
      return;
    }
    setSourceUrl(URL.createObjectURL(file));
    void keepOriginal(file);
  }

  async function keepOriginal(file: File) {
    // Best-effort durable copy of the full-size image in IndexedDB.
    if (!user) return;
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      await photoStore.put(user.id, `cv-photo:${cvId || "draft"}:${Date.now()}`, dataUrl);
    } catch {
      // Non-fatal: the cropped data URL is what the CV actually renders.
    }
  }

  async function applyCrop() {
    const image = imageRef.current;
    const frame = frameRef.current;
    if (!image || !frame) return;

    setUploading(true);
    try {
      const frameSize = frame.clientWidth;
      const naturalWidth = image.naturalWidth;
      const naturalHeight = image.naturalHeight;
      const baseScale = Math.max(frameSize / naturalWidth, frameSize / naturalHeight);
      const scale = baseScale * zoom;

      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");

      const ratio = OUTPUT_SIZE / frameSize;
      const drawWidth = naturalWidth * scale * ratio;
      const drawHeight = naturalHeight * scale * ratio;
      const drawX = (frameSize / 2 - offset.x) * ratio - drawWidth / 2;
      const drawY = (frameSize / 2 - offset.y) * ratio - drawHeight / 2;

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
      context.drawImage(image, drawX, drawY, drawWidth, drawHeight);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
      update((draft) => {
        draft.personal.photo = dataUrl;
      });
      toast.success("Photo updated", "It is saved with your CV.");
      closeCropper();
    } catch {
      toast.error("Could not process that image", "Please try a different photo.");
    } finally {
      setUploading(false);
    }
  }

  function removePhoto() {
    update((draft) => {
      draft.personal.photo = "";
    });
    toast.info("Photo removed");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex size-20 shrink-0 items-center justify-center overflow-hidden border border-[var(--border-soft)] bg-white/5",
            shape === "circle" ? "rounded-full" : "rounded-2xl",
          )}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="Your CV photo" className="size-full object-cover" />
          ) : (
            <ImagePlus className="size-6 text-ink-500" aria-hidden />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus className="size-4" aria-hidden />
              {hasPhoto || photo ? "Replace photo" : "Upload photo"}
            </Button>
            {photo ? (
              <Button type="button" variant="ghost" size="sm" onClick={removePhoto}>
                <Trash2 className="size-4" aria-hidden />
                Remove
              </Button>
            ) : null}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-ink-500">
            PNG, JPEG or WebP up to 2 MB. Saved with your CV in this browser.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-white/[0.02] p-3">
        <span className="text-xs font-medium text-ink-300">Framing</span>
        <div className="flex gap-1">
          {(["circle", "square"] as Shape[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setShape(option)}
              aria-pressed={shape === option}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-xs capitalize transition",
                shape === option
                  ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-200"
                  : "border-[var(--border-soft)] text-ink-400 hover:text-[var(--page-fg)]",
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <span className="ml-auto text-[11px] text-ink-500">
          Applied when you drop a new photo in
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <Modal
        open={Boolean(sourceUrl)}
        onClose={closeCropper}
        title="Crop your photo"
        description="Drag to reposition, then zoom until your face fills the frame."
        footer={
          <>
            <Button variant="ghost" onClick={closeCropper} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={applyCrop} loading={uploading}>
              Use this photo
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <div
              ref={frameRef}
              className={cn(
                "relative size-64 overflow-hidden border border-[var(--border-soft)] bg-slate-900",
                shape === "circle" ? "rounded-full" : "rounded-2xl",
              )}
              onPointerDown={(event) => {
                dragging.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
                (event.target as HTMLElement).setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                if (!dragging.current) return;
                setOffset({
                  x: event.clientX - dragging.current.x,
                  y: event.clientY - dragging.current.y,
                });
              }}
              onPointerUp={() => {
                dragging.current = null;
              }}
            >
              {sourceUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  ref={imageRef}
                  src={sourceUrl}
                  alt=""
                  draggable={false}
                  className="size-full cursor-grab object-cover active:cursor-grabbing"
                  style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
                />
              ) : null}
            </div>
          </div>

          <label className="flex items-center gap-3 text-xs text-ink-300">
            <ZoomIn className="size-4 shrink-0" aria-hidden />
            <span className="sr-only">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-400"
            />
            <span className="w-10 text-right tabular-nums text-ink-500">
              {Math.round(zoom * 100)}%
            </span>
          </label>

          <p className="flex items-center justify-center gap-1.5 text-xs text-ink-500">
            <Move className="size-3.5" aria-hidden />
            Drag inside the frame to reposition
          </p>

          {uploading ? (
            <p className="flex items-center justify-center gap-2 text-xs text-cyan-300">
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              Processing your photo…
            </p>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
