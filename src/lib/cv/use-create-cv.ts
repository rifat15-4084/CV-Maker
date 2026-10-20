"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/toast-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { createEmptyCVData } from "@/lib/cv/defaults";
import { createSampleCVData } from "@/lib/cv/sample-data";
import { cvRepository, CvError } from "@/services";
import { getTemplateConfigOrFallback } from "@/templates/registry";

/**
 * Creates a new CV in the local repository and opens it in the editor.
 *
 * This is the client-side replacement for the old `createCVAction` server
 * action: the document is written to localStorage, so creation has to happen in
 * the browser, and the user is then routed into the editor.
 */
export function useCreateCV() {
  const router = useRouter();
  const { user } = useAuth();
  const { error: toastError } = useToast();
  const [creating, setCreating] = useState(false);

  const createCv = useCallback(
    async (templateId: string, options: { sample?: boolean; title?: string } = {}) => {
      if (!user) {
        router.push("/login?next=/templates/select");
        return;
      }

      setCreating(true);
      try {
        const config = getTemplateConfigOrFallback(templateId);
        const data = options.sample ? createSampleCVData() : createEmptyCVData();
        // Seed the accent from the template's own default so a new CV looks right
        // immediately, without clobbering any other settings the data carried.
        data.settings = { ...data.settings, accent: config.defaultAccent };

        const record = await cvRepository.create({
          userId: user.id,
          templateId: config.id,
          title: options.title?.trim() || `My ${config.name} CV`,
          data,
          settings: data.settings as Record<string, unknown>,
        });

        router.push(`/editor/${record.id}`);
      } catch (error) {
        toastError(
          "Could not create that CV",
          error instanceof CvError
            ? error.message
            : "Your browser storage may be full. Try removing an old CV or a photo.",
        );
        setCreating(false);
      }
    },
    [router, user, toastError],
  );

  return { createCv, creating };
}
