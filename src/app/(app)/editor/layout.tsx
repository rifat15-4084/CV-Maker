import { ProtectedRoute } from "@/components/auth/protected-route";

/**
 * The editor runs full-bleed: no marketing navbar or footer, because the editor
 * toolbar owns navigation, saving and the template switcher.
 *
 * Protected client-side, since the session lives in localStorage.
 */
export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--page-bg)]">
      <ProtectedRoute>{children}</ProtectedRoute>
    </div>
  );
}
