import { SiteShell } from "@/components/layout/site-shell";

/** Public marketing + legal routes share the standard navbar/footer chrome. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
