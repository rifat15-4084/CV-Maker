import { SiteShell } from "@/components/layout/site-shell";
import { ProtectedRoute } from "@/components/auth/protected-route";

/**
 * Authenticated pages that keep the public navbar — which shows the signed-in
 * account menu.
 *
 * Protection is client-side (`ProtectedRoute`) because the session lives in
 * localStorage, which the server never sees. Unauthenticated visitors are sent
 * to `/login?next=<path>` and returned here after signing in.
 */
export default function ChromeLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell>
      <ProtectedRoute>{children}</ProtectedRoute>
    </SiteShell>
  );
}
