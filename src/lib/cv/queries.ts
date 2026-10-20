"use client";

import type { CVData } from "@/lib/cv/schema";
import { cvRepository, type CVRecord } from "@/services";
import { getTemplateConfigOrFallback } from "@/templates/registry";

/**
 * Thin, UI-facing reads over the active `CvRepository`.
 *
 * Everything here runs in the browser because CV data lives in localStorage.
 * Components should prefer the repository through these helpers rather than
 * reaching for storage directly.
 */

export interface CVSummary {
  id: string;
  title: string;
  templateId: string;
  templateName: string;
  updatedAt: string;
  createdAt: string;
  fullName: string;
  jobTitle: string;
  thumbnail: string | null;
  isArchived: boolean;
  /**
   * The full CV content.
   *
   * The dashboard renders each row through its real template component, so it
   * needs the actual data rather than just a title and a template name.
   */
  data: CVData;
}

function toSummary(record: CVRecord): CVSummary {
  const { firstName, lastName, jobTitle } = record.data.personal;
  return {
    id: record.id,
    title: record.title,
    templateId: record.templateId,
    templateName: getTemplateConfigOrFallback(record.templateId).name,
    updatedAt: record.updatedAt,
    createdAt: record.createdAt,
    fullName: [firstName, lastName].filter(Boolean).join(" ").trim(),
    jobTitle: jobTitle ?? "",
    thumbnail: record.thumbnail ?? null,
    isArchived: record.isArchived,
    data: record.data,
  };
}

/** Every non-archived CV for a user, newest first, shaped for the dashboard. */
export async function listUserCVs(userId: string): Promise<CVSummary[]> {
  const records = await cvRepository.list(userId);
  return records.filter((record) => !record.isArchived).map(toSummary);
}

/** A single CV record, or null. */
export async function getCV(userId: string, id: string): Promise<CVRecord | null> {
  return cvRepository.get(userId, id);
}

/** A single CV shaped for the dashboard grid. */
export async function getCVSummary(userId: string, id: string): Promise<CVSummary | null> {
  const record = await cvRepository.get(userId, id);
  return record ? toSummary(record) : null;
}
