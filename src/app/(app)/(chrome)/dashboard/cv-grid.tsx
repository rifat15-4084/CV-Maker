"use client";

import { memo, useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  Archive,
  Copy,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/feedback";
import { useToast } from "@/components/providers/toast-provider";
import { TemplateThumbnail } from "@/components/templates/template-thumbnail";
import { cn } from "@/lib/utils";
import type { CVSummary } from "@/lib/cv/queries";
import { cvRepository, CvError } from "@/services";
import { getTemplateConfigOrFallback } from "@/templates/registry";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function relativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return dateFormatter.format(new Date(iso));
}

type SortKey = "updated" | "created" | "title";

export function CVGrid({
  cvs,
  userId,
  archived = false,
  onChanged,
}: {
  cvs: CVSummary[];
  userId: string;
  archived?: boolean;
  /** Called after a mutation so the parent can re-read from the repository. */
  onChanged: () => void;
}) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("updated");
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<CVSummary | null>(null);
  const [deleting, setDeleting] = useState<CVSummary | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const result = cvs.filter((cv) => {
      if (!needle) return true;
      return (
        cv.title.toLowerCase().includes(needle) ||
        cv.fullName.toLowerCase().includes(needle) ||
        cv.templateName.toLowerCase().includes(needle)
      );
    });
    return [...result].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "created") return b.createdAt.localeCompare(a.createdAt);
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [cvs, query, sort]);

  function handleRename() {
    if (!renaming) return;
    const title = renameValue.trim();
    if (!title) return;
    startTransition(async () => {
      try {
        await cvRepository.update(userId, renaming.id, { title });
        toast.success("CV renamed", title);
        setRenaming(null);
        onChanged();
      } catch (error) {
        toast.error(
          "Could not rename",
          error instanceof CvError ? error.message : "Please try again.",
        );
      }
    });
  }

  function handleDelete() {
    if (!deleting) return;
    const target = deleting;
    startTransition(async () => {
      try {
        await cvRepository.remove(userId, target.id);
        toast.success("CV deleted", target.title);
        setDeleting(null);
        onChanged();
      } catch (error) {
        toast.error(
          "Could not delete",
          error instanceof CvError ? error.message : "Please try again.",
        );
      }
    });
  }

  const handleArchive = useCallback(
    (cv: CVSummary) => {
      setMenuFor(null);
      startTransition(async () => {
        try {
          await cvRepository.update(userId, cv.id, { isArchived: !archived });
          toast.success(archived ? "CV restored" : "CV archived");
          onChanged();
        } catch (error) {
          toast.error(
            "Could not update",
            error instanceof CvError ? error.message : "Please try again.",
          );
        }
      });
    },
    [archived, onChanged, toast, userId],
  );

  const handleDuplicate = useCallback(
    (cv: CVSummary) => {
      setMenuFor(null);
      startTransition(async () => {
        try {
          const copy = await cvRepository.duplicate(userId, cv.id);
          toast.success("CV duplicated", copy.title);
          onChanged();
        } catch (error) {
          toast.error(
            "Could not duplicate",
            error instanceof CvError ? error.message : "Please try again.",
          );
        }
      });
    },
    [onChanged, toast, userId],
  );

  /**
   * Stable handlers for the memoized cards.
   *
   * `CVCard` renders a live template preview, so an unstable callback identity
   * would invalidate `React.memo` on every keystroke in the search box and
   * re-render (and re-mount) every preview.
   */
  const toggleMenu = useCallback((id: string) => {
    setMenuFor((current) => (current === id ? null : id));
  }, []);

  const requestRename = useCallback((cv: CVSummary) => {
    setRenaming(cv);
    setRenameValue(cv.title);
    setMenuFor(null);
  }, []);

  const requestDelete = useCallback((cv: CVSummary) => {
    setDeleting(cv);
    setMenuFor(null);
  }, []);

  if (cvs.length === 0) {
    return (
      <EmptyState
        icon={<Pencil className="size-7" aria-hidden />}
        title={archived ? "Nothing archived" : "No CVs yet"}
        description={
          archived
            ? "CVs you archive will appear here, out of the way but never lost."
            : "Create your first CV from a template — or start with sample data to see how it looks filled in."
        }
        action={
          archived ? (
            <ButtonLink href="/dashboard" variant="secondary">
              Back to my CVs
            </ButtonLink>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink href="/templates/select">Choose a template</ButtonLink>
            </div>
          )
        }
      />
    );
  }

  return (
    <div>
      <div className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-500"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your CVs…"
            aria-label="Search your CVs"
            className="pl-9"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-lg p-1 text-ink-500 transition hover:bg-white/10 hover:text-[var(--page-fg)]"
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>
        <label className="sr-only" htmlFor="cv-sort">
          Sort CVs
        </label>
        <Select
          id="cv-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as SortKey)}
          className="sm:w-52"
        >
          <option value="updated">Sort: Last edited</option>
          <option value="created">Sort: Newest first</option>
          <option value="title">Sort: Name (A–Z)</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={<Search className="size-7" aria-hidden />}
          title="No CVs match that search"
          description="Try a different name, or clear the search to see everything."
          action={
            <Button variant="secondary" onClick={() => setQuery("")}>
              Clear search
            </Button>
          }
        />
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cv) => (
            <CVCard
              key={cv.id}
              cv={cv}
              archived={archived}
              menuOpen={menuFor === cv.id}
              onToggleMenu={toggleMenu}
              onRename={requestRename}
              onDuplicate={handleDuplicate}
              onArchive={handleArchive}
              onDelete={requestDelete}
            />
          ))}
        </ul>
      )}

      {/* Rename modal */}
      <Modal
        open={Boolean(renaming)}
        onClose={() => setRenaming(null)}
        title="Rename CV"
        description="Give this CV a name you will recognise in your dashboard."
        footer={
          <>
            <Button variant="ghost" onClick={() => setRenaming(null)}>
              Cancel
            </Button>
            <Button onClick={handleRename} loading={pending} disabled={!renameValue.trim()}>
              Save name
            </Button>
          </>
        }
      >
        <label htmlFor="rename-input" className="text-xs font-medium text-ink-300">
          CV name
        </label>
        <Input
          id="rename-input"
          className="mt-1.5"
          value={renameValue}
          onChange={(event) => setRenameValue(event.target.value)}
          maxLength={120}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === "Enter") handleRename();
          }}
        />
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete this CV?"
        description={`“${deleting?.title ?? ""}” will be permanently removed, including its content and photo. This cannot be undone.`}
        confirmLabel="Delete forever"
        destructive
        loading={pending}
      />
    </div>
  );
}

/**
 * One row of the dashboard grid.
 *
 * Memoized deliberately: the card embeds a live render of the template, and the
 * dashboard re-renders on every search keystroke. Without `React.memo` plus
 * stable handler identities, each keystroke would re-render — and remount — all
 * the previews in the list.
 */
const CVCard = memo(function CVCard({
  cv,
  archived,
  menuOpen,
  onToggleMenu,
  onRename,
  onDuplicate,
  onArchive,
  onDelete,
}: {
  cv: CVSummary;
  archived: boolean;
  menuOpen: boolean;
  onToggleMenu: (id: string) => void;
  onRename: (cv: CVSummary) => void;
  onDuplicate: (cv: CVSummary) => void;
  onArchive: (cv: CVSummary) => void;
  onDelete: (cv: CVSummary) => void;
}) {
  return (
    <li className="glass group relative flex flex-col overflow-hidden rounded-3xl">
      <Link
        href={`/editor/${cv.id}`}
        className="block aspect-[210/230] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800"
        aria-label={`Edit ${cv.title}`}
        prefetch={false}
      >
        <CVThumbnail cv={cv} />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{cv.title}</h3>
            <p className="mt-0.5 truncate text-xs text-ink-500">
              {cv.fullName || "No name yet"}
              {cv.jobTitle ? ` · ${cv.jobTitle}` : ""}
            </p>
          </div>
          <div className="relative shrink-0">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Actions for ${cv.title}`}
              aria-expanded={menuOpen}
              onClick={() => onToggleMenu(cv.id)}
            >
              <MoreHorizontal className="size-4" aria-hidden />
            </Button>
            {menuOpen ? (
              <>
                <div
                  className="fixed inset-0 z-30"
                  aria-hidden
                  onClick={() => onToggleMenu(cv.id)}
                />
                <div
                  role="menu"
                  className="glass-strong absolute right-0 z-40 mt-1 w-48 overflow-hidden rounded-2xl p-1.5 shadow-[var(--shadow-card)]"
                >
                  <MenuItem
                    icon={<Pencil className="size-4" />}
                    onClick={() => onRename(cv)}
                  >
                    Rename
                  </MenuItem>
                  <MenuItem
                    icon={<Copy className="size-4" />}
                    onClick={() => onDuplicate(cv)}
                  >
                    Duplicate
                  </MenuItem>
                  <MenuItem
                    icon={<Archive className="size-4" />}
                    onClick={() => onArchive(cv)}
                  >
                    {archived ? "Restore" : "Archive"}
                  </MenuItem>
                  <MenuItem
                    icon={<Trash2 className="size-4" />}
                    danger
                    onClick={() => onDelete(cv)}
                  >
                    Delete
                  </MenuItem>
                </div>
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--border-soft)] pt-3">
          <span className="text-xs text-ink-500">Edited {relativeTime(cv.updatedAt)}</span>
          <span className="rounded-full border border-[var(--border-soft)] bg-white/5 px-2 py-0.5 text-[11px] text-ink-400">
            {cv.templateName}
          </span>
        </div>

        <div className="mt-3 flex gap-2">
          <ButtonLink href={`/editor/${cv.id}`} size="sm" className="flex-1">
            Edit
          </ButtonLink>
          <ButtonLink
            href={`/print/${cv.id}`}
            variant="secondary"
            size="sm"
            target="_blank"
            className="flex-1"
          >
            PDF
          </ButtonLink>
        </div>
      </div>
    </li>
  );
});

/**
 * Live preview of a user's own CV in the dashboard grid.
 *
 * The dashboard used to draw a hardcoded skeleton here, which meant every CV
 * looked identical regardless of the template it actually used. Rendering the
 * real template component with the real data is the only way the card can be
 * trusted as a preview of what will print.
 */
function CVThumbnail({ cv }: { cv: CVSummary }) {
  const template = getTemplateConfigOrFallback(cv.templateId);
  return (
    <TemplateThumbnail
      template={template}
      data={cv.data}
      className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800"
    />
  );
}

function MenuItem({
  icon,
  children,
  onClick,
  danger,
  type = "button",
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  type?: "button" | "submit";
}) {
  const isDanger = danger;
  return (
    <button
      type={type}
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition",
        isDanger
          ? "text-rose-300 hover:bg-rose-500/10"
          : "text-ink-300 hover:bg-white/5 hover:text-[var(--page-fg)]",
      )}
    >
      {icon}
      {children}
    </button>
  );
}
