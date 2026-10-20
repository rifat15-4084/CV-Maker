import type { Metadata } from "next";
import { DashboardScreen } from "./dashboard-screen";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your CVs, drafts and downloads in one place.",
  robots: { index: false, follow: false },
};

/**
 * Dashboard shell. The CVs live in this browser's localStorage, so all of the
 * work happens in a client component, which provides its own Suspense boundary
 * for the `useSearchParams` read.
 */
export default function DashboardPage() {
  return <DashboardScreen />;
}
