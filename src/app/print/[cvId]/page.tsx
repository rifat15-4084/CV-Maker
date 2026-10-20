import type { Metadata } from "next";
import { PrintRoute } from "./print-route";

export const metadata: Metadata = {
  title: "Print CV",
  robots: { index: false, follow: false },
};

/**
 * Clean, chrome-free print view. The CV lives in the browser, so the document
 * is loaded by a client component and the print dialog is opened once the
 * template has painted.
 */
export default function PrintPage() {
  return <PrintRoute />;
}
