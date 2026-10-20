"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService, AuthError, type User } from "@/services";

/* ==========================================================================
   Auth context.

   Hydration safety: the initial render NEVER touches localStorage. The session
   is resolved inside an effect, and `isLoading` stays true until then so the UI
   can show a skeleton instead of flashing a signed-out state.
   ========================================================================== */

export interface AuthContextValue {
  user: User | null;
  /** True until the stored session has been resolved on the client. */
  isLoading: boolean;
  signup: (input: { fullName: string; email: string; password: string }) => Promise<User>;
  login: (input: { email: string; password: string; remember?: boolean }) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<User, "fullName" | "avatarUrl" | "headline">>) => Promise<User>;
  changePassword: (currentPassword: string, nextPassword: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  /** Re-reads the session from storage (used after an external change). */
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Turns any thrown value into a message safe to show a user. */
export function authErrorMessage(error: unknown): string {
  if (error instanceof AuthError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* Resolve the session once, on mount, on the client only. */
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const current = await authService.getCurrentUser();
        if (!cancelled) setUser(current);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* Keep tabs in sync: signing out in one tab signs out the others. */
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key && !event.key.startsWith("cvforge_")) return;
      void authService.getCurrentUser().then(setUser);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const signup = useCallback<AuthContextValue["signup"]>(async (input) => {
    const { user: created } = await authService.signup(input);
    setUser(created);
    return created;
  }, []);

  const login = useCallback<AuthContextValue["login"]>(async (input) => {
    const { user: signedIn } = await authService.login(input);
    setUser(signedIn);
    return signedIn;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback<AuthContextValue["updateProfile"]>(async (patch) => {
    const updated = await authService.updateProfile(patch);
    setUser(updated);
    return updated;
  }, []);

  const changePassword = useCallback<AuthContextValue["changePassword"]>(
    async (currentPassword, nextPassword) => {
      await authService.changePassword(currentPassword, nextPassword);
    },
    [],
  );

  const deleteAccount = useCallback<AuthContextValue["deleteAccount"]>(async (password) => {
    await authService.deleteAccount(password);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const current = await authService.getCurrentUser();
    setUser(current);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      signup,
      login,
      logout,
      updateProfile,
      changePassword,
      deleteAccount,
      refresh,
    }),
    [user, isLoading, signup, login, logout, updateProfile, changePassword, deleteAccount, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
