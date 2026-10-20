"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { NAV_LINKS } from "@/lib/site";
import { initials } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Wordmark } from "./wordmark";

export interface NavbarUser {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user: authUser, isLoading, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Shape the context user into what the avatar/menu components expect.
  const user: NavbarUser | null = authUser
    ? {
        id: authUser.id,
        email: authUser.email,
        fullName: authUser.fullName,
        avatarUrl: authUser.avatarUrl ?? null,
      }
    : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close any open menus when the route changes. Adjusting state during render
  // is the pattern React recommends over an effect for derived resets.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (mobileOpen) setMobileOpen(false);
    if (menuOpen) setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  async function handleSignOut() {
    setSigningOut(true);
    await logout();
    router.push("/login");
    setSigningOut(false);
  }

  return (
    <header
      className={cn(
        "site-nav sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass-strong border-b border-[var(--border-soft)]" : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Wordmark />

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition",
                  active ? "text-[var(--page-fg)]" : "text-ink-400 hover:text-[var(--page-fg)]",
                )}
              >
                {link.label}
                {active ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                  />
                ) : null}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />

          {isLoading ? (
            /* Neutral placeholder: avoids flashing "Log in" before the local
               session has been read, which is the classic navbar flicker. */
            <span
              className="hidden h-9 w-24 animate-pulse rounded-xl bg-white/5 sm:block"
              aria-hidden
            />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="glass flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2.5 transition hover:border-cyan-400/40"
              >
                <Avatar user={user} className="size-7" />
                <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
                  {user.fullName || user.email || "Account"}
                </span>
                <ChevronDown className="size-3.5 text-ink-400" aria-hidden />
              </button>

              <AnimatePresence>
                {menuOpen ? (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="glass-strong absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl p-1.5 shadow-[var(--shadow-card)]"
                  >
                    <div className="border-b border-[var(--border-soft)] px-3 py-2.5">
                      <p className="truncate text-sm font-semibold">{user.fullName || "Welcome back"}</p>
                      <p className="truncate text-xs text-ink-400">{user.email}</p>
                    </div>
                    <MenuLink href="/dashboard" icon={<LayoutDashboard className="size-4" />}>
                      My CVs
                    </MenuLink>
                    <MenuLink href="/templates/select" icon={<Sparkles className="size-4" />}>
                      New from template
                    </MenuLink>
                    <MenuLink href="/settings" icon={<Settings className="size-4" />}>
                      Settings
                    </MenuLink>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-60"
                    >
                      <LogOut className="size-4" aria-hidden />
                      {signingOut ? "Signing out…" : "Sign out"}
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <ButtonLink href="/login" variant="ghost" size="sm">
                Log in
              </ButtonLink>
              <ButtonLink href="/signup" size="sm">
                Get started free
              </ButtonLink>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="glass-strong overflow-hidden border-t border-[var(--border-soft)] lg:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink-300 transition hover:bg-white/5 hover:text-[var(--page-fg)]"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-3">
                {isLoading ? (
                  <span className="h-11 flex-1 animate-pulse rounded-xl bg-white/5" aria-hidden />
                ) : user ? (
                  <>
                    <ButtonLink href="/dashboard" size="md" className="flex-1">
                      Go to dashboard
                    </ButtonLink>
                  </>
                ) : (
                  <>
                    <ButtonLink href="/login" variant="secondary" size="md" className="flex-1">
                      Log in
                    </ButtonLink>
                    <ButtonLink href="/signup" size="md" className="flex-1">
                      Sign up
                    </ButtonLink>
                  </>
                )}
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function MenuLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-ink-300 transition hover:bg-white/5 hover:text-[var(--page-fg)]"
    >
      {icon}
      {children}
    </Link>
  );
}

export function Avatar({ user, className }: { user: NavbarUser; className?: string }) {
  const label = initials(user.fullName ?? user.email ?? "CV");
  if (user.avatarUrl) {
    return (
      <Image
        src={user.avatarUrl}
        alt=""
        width={64}
        height={64}
        unoptimized
        className={cn("rounded-full object-cover", className)}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 text-[10px] font-bold text-white",
        className,
      )}
    >
      {label}
    </span>
  );
}
