"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FileQuestion } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { cvRepository, type CVRecord } from "@/services";
import { getTemplateConfigOrFallback } from "@/templates/registry";
import { PrintDocument } from "./print-document";

/** Builds a tidy file name: "Amara_Okafor_CV". */
function fileBase(first?: string, last?: string, fallback = "CV") {
  const name = [first, last]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join("_");
  return (name || fallback).replace(/[^\w\-]+/g, "_");
}

/**
 * Loads the CV from the local repository on the client, then renders the
 * print-ready document. Nothing is rendered until the record is known, so the
 * print dialog can never fire against an empty page.
 */
export function PrintRoute() {
  const params = useParams<{ cvId: string }>();
  const cvId = typeof params?.cvId === "string" ? params.cvId : "";
  const { user, isLoading } = useAuth();
  const [record, setRecord] = useState<CVRecord | null>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void cvRepository.get(user.id, cvId).then((found) => {
      if (cancelled) return;
      setRecord(found);
      setResolved(true);
    });
    return () => {
      cancelled = true;
    };
  }, [user, cvId]);

  // "No signed-in user" is derived during render, not set in the effect.
  const done = resolved || (!isLoading && !user);

  if (!done) {
    return (
      <div className="grid min-h-dvh place-items-center p-8 text-sm text-ink-400" role="status">
        Preparing your CV…
      </div>
    );
  }

  if (!record) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-white/5 text-ink-400">
          <FileQuestion className="size-7" aria-hidden />
        </span>
        <h1 className="mt-5 text-xl font-semibold">CV not found</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-400">
          This CV is not stored in this browser. Import a backup on the dashboard to restore it.
        </p>
        <div className="mt-6">
          <ButtonLink href="/dashboard">Back to my CVs</ButtonLink>
        </div>
      </div>
    );
  }

  const template = getTemplateConfigOrFallback(record.templateId);
  const fileName = `${fileBase(record.data.personal.firstName, record.data.personal.lastName)}_CV`;

  return (
    <PrintDocument
      data={record.data}
      templateId={template.id}
      fileName={fileName}
      backHref={`/editor/${record.id}`}
    />
  );
}
