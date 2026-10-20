"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Download,
  FileText,
  HardDrive,
  LayoutTemplate,
  Sparkles,
  TrendingUp,
  Upload,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { StatCard } from "@/components/marketing/primitives";
import { useToast } from "@/components/providers/toast-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { AuthSkeleton } from "@/components/auth/auth-skeleton";
import { listUserCVs, type CVSummary } from "@/lib/cv/queries";
import { cvRepository, CvError, type CVBackup } from "@/services";
import { parseBackup } from "@/services/local/cv-repository";
import { estimateUsage, formatBytes } from "@/services/local/storage";
import { templateCount } from "@/templates/registry";
import { CVGrid } from "./cv-grid";
import { StorageNotice } from "./storage-notice";

export function DashboardScreen() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { user, isLoading } = useAuth();
  const { success, error: toastError, warning } = useToast();
  const searchParams = useSearchParams();
  const archived = searchParams.get("archived") === "1";
  const error = searchParams.get("error");

  const [cvs, setCvs] = useState<CVSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reload = useCallback(async () => {
    if (!user) return;
    const all = await listUserCVs(user.id);
    setCvs(all);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void (async () => {
      const all = await listUserCVs(user.id);
      if (!cancelled) {
        setCvs(all);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  /* Warn once when the browser store is getting full. */
  useEffect(() => {
    if (!user || loading) return;
    const usage = estimateUsage();
    if (usage.nearFull) {
      warning(
        "Browser storage almost full",
        `${usage.percent}% used (${formatBytes(usage.bytes)}). Export a backup and remove old CVs or photos.`,
      );
    }
  }, [user, loading, warning]);

  async function handleExport() {
    if (!user) return;
    try {
      const backup = await cvRepository.exportAll(user.id);
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `cvforge-backup-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      success("Backup exported", `${backup.cvs.length} CV${backup.cvs.length === 1 ? "" : "s"} saved to your downloads.`);
    } catch (err) {
      toastError("Could not export", err instanceof CvError ? err.message : "Please try again.");
    }
  }

  async function handleImportFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !user) return;

    try {
      const text = await file.text();
      const backup: CVBackup = parseBackup(JSON.parse(text) as unknown);
      const result = await cvRepository.importAll(user.id, backup);
      await reload();
      if (result.imported > 0) {
        success(
          "Backup imported",
          `${result.imported} CV${result.imported === 1 ? "" : "s"} added${result.skipped ? `, ${result.skipped} skipped` : ""}.`,
        );
      } else {
        warning("Nothing imported", "Every CV in that file already exists here.");
      }
    } catch (err) {
      toastError(
        "Could not import that file",
        err instanceof CvError ? err.message : "Make sure it is a CVForge backup JSON file.",
      );
    }
  }

  if (isLoading || !user) return <AuthSkeleton />;

  const firstName = user.fullName.split(" ")[0] || user.email.split("@")[0] || "there";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-cyan-300">Welcome back, {firstName}</p>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight sm:text-4xl">My CVs</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-400">
            Everything you create is saved in this browser and editable forever. Duplicate a CV to
            tailor it for a specific role without losing your master copy.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/templates/select">
            <Sparkles className="size-4" aria-hidden />
            New CV from template
          </ButtonLink>
        </div>
      </header>

      {error ? (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200"
        >
          {error === "create"
            ? "We could not create that CV. Please try again."
            : error === "duplicate"
              ? "We could not duplicate that CV. Please try again."
              : "Something went wrong. Please try again."}
        </div>
      ) : null}

      {/* Data lives only in this browser — say so, and make backup easy. */}
      <StorageNotice className="mt-6" />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard value={String(cvs.length)} label="CVs in this browser" hint="Editable forever" />
        <StatCard value={`${templateCount()}`} label="Templates available" hint="7 categories" />
        <StatCard value="A4" label="PDF export size" hint="ATS-friendly" />
        <StatCard value="1s" label="Auto-save debounce" hint="Plus storage-full warnings" />
      </section>

      {/* Backup / restore */}
      <section className="glass mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-violet-500/20 text-cyan-300">
            <HardDrive className="size-4.5" aria-hidden />
          </span>
          <div>
            <h2 className="text-sm font-semibold">Backup &amp; restore</h2>
            <p className="mt-0.5 text-xs text-ink-400">
              Export every CV to a JSON file, or bring one back on another device.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-soft)] bg-white/5 px-3.5 py-2 text-sm font-medium transition hover:bg-white/10"
          >
            <Download className="size-4" aria-hidden />
            Export backup
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-soft)] bg-white/5 px-3.5 py-2 text-sm font-medium transition hover:bg-white/10"
          >
            <Upload className="size-4" aria-hidden />
            Import backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={handleImportFile}
            aria-label="Import a CVForge backup file"
          />
        </div>
      </section>

      <nav className="mt-10 flex items-center gap-1 border-b border-[var(--border-soft)]">
        <Link
          href="/dashboard"
          aria-current={!archived ? "page" : undefined}
          className={
            !archived
              ? "border-b-2 border-cyan-400 px-3 py-2.5 text-sm font-semibold text-[var(--page-fg)]"
              : "border-b-2 border-transparent px-3 py-2.5 text-sm text-ink-400 transition hover:text-[var(--page-fg)]"
          }
        >
          Active
        </Link>
        <Link
          href="/dashboard?archived=1"
          aria-current={archived ? "page" : undefined}
          className={
            archived
              ? "border-b-2 border-cyan-400 px-3 py-2.5 text-sm font-semibold text-[var(--page-fg)]"
              : "border-b-2 border-transparent px-3 py-2.5 text-sm text-ink-400 transition hover:text-[var(--page-fg)]"
          }
        >
          Archived
        </Link>
      </nav>

      {loading ? (
        <AuthSkeleton className="px-0" />
      ) : (
        <div className="mt-6">
          <CVGrid
            cvs={cvs.filter((cv) => cv.isArchived === archived)}
            userId={user.id}
            archived={archived}
            onChanged={reload}
          />
          {!archived && cvs.length > 0 ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <TipCard
                icon={<LayoutTemplate className="size-5" aria-hidden />}
                title="Tailor for each role"
                body="Duplicate a CV, then reorder bullets and sections to match the job advert."
                href="/blog/tailoring-your-cv-to-a-job"
                linkLabel="Read the guide"
              />
              <TipCard
                icon={<FileText className="size-5" aria-hidden />}
                title="Keep bullets outcome-led"
                body="Numbers and results get read; duty lists get skimmed past."
                href="/blog/writing-cv-bullets-that-get-read"
                linkLabel="Read the guide"
              />
              <TipCard
                icon={<TrendingUp className="size-5" aria-hidden />}
                title="Mind the length"
                body="One page early career, two pages mid-level. Cut from the weakest bullet."
                href="/blog/one-page-or-two"
                linkLabel="Read the guide"
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function TipCard({
  icon,
  title,
  body,
  href,
  linkLabel,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-fuchsia-500/20 text-cyan-300">
        {icon}
      </span>
      <h2 className="mt-3.5 text-sm font-semibold">{title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{body}</p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 transition hover:gap-2"
      >
        {linkLabel}
        <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </div>
  );
}
