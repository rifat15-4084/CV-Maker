import type { Metadata } from "next";
import { TemplateSelectScreen } from "./template-select-screen";

export const metadata: Metadata = {
  title: "Choose a template",
  description: "Pick a template for your new CV. You can switch templates later at any time.",
  robots: { index: false, follow: false },
};

/**
 * Template selection. All of the work happens client-side (creating a CV writes
 * to localStorage), and the screen provides its own Suspense boundary for the
 * `useSearchParams` read.
 */
export default function TemplateSelectPage() {
  return <TemplateSelectScreen />;
}
