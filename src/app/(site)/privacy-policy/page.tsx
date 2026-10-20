import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/marketing/legal-document";
import { AuroraBackdrop } from "@/components/marketing/primitives";
import {
  LEGAL_LAST_UPDATED,
  LEGAL_LAST_UPDATED_LABEL,
  PRIVACY_SECTIONS,
} from "@/lib/content/legal";
import { SUPPORT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What CV Maker collects, why, where it is stored, how long it is kept, and the rights you have over your CV data and uploaded photos.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: `Privacy policy | ${SITE_NAME}`,
    description:
      "What CV Maker collects, why, where it is stored and the rights you have over your data.",
    url: "/privacy-policy",
  },
  other: { "article:modified_time": LEGAL_LAST_UPDATED },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="relative overflow-hidden">
      <AuroraBackdrop className="h-[380px]" />
      <LegalDocument
        eyebrow="Legal"
        title="Privacy policy"
        updatedLabel={LEGAL_LAST_UPDATED_LABEL}
        intro="CV Maker stores personal career information, so privacy is not an afterthought. This page explains exactly what we collect, why we need it, and how to remove it."
        sections={PRIVACY_SECTIONS}
        footer={
          <div>
            <h2 className="text-lg font-semibold">Contact us about privacy</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              For any question or request relating to your personal data, email{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-semibold text-cyan-300 hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>{" "}
              or use the{" "}
              <Link href="/contact" className="text-cyan-300 hover:underline">
                contact form
              </Link>
              . See also our{" "}
              <Link href="/terms-of-service" className="text-cyan-300 hover:underline">
                terms of service
              </Link>
              .
            </p>
          </div>
        }
      />
    </div>
  );
}
