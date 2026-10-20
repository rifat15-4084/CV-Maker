import type { Metadata } from "next";
import { EditorRoute } from "./editor-route";

export const metadata: Metadata = {
  title: "Editor",
  description: "Edit your CV with a live A4 preview.",
  robots: { index: false, follow: false },
};

/**
 * The CV id arrives as a route param, but the document itself lives in the
 * browser, so the actual loading happens in a client component.
 */
export default function EditorPage() {
  return <EditorRoute />;
}
