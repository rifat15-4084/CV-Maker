"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, KeyRound, LogOut, Save, Trash2, Upload, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/providers/toast-provider";
import { authErrorMessage, useAuth } from "@/components/providers/auth-provider";
import { authService, cvRepository, photoStore, type User } from "@/services";
import { formatBytes } from "@/services/local/storage";
import { useStorageUsage } from "@/lib/storage/use-storage-usage";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const AVATAR_KEY = "avatar";

/** Downscales + re-encodes an image to a JPEG data URL, keeping localStorage small. */
async function shrinkImage(file: File, maxSize = 256): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not process that image.");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();
  return canvas.toDataURL("image/jpeg", 0.85);
}

export function SettingsForm() {
  const { user } = useAuth();
  if (!user) return null;
  // Remount per user so the panel's initial state is always this user's.
  return <SettingsPanel key={user.id} user={user} />;
}

function SettingsPanel({ user }: { user: User }) {
  const toast = useToast();
  const router = useRouter();
  const { updateProfile, changePassword, deleteAccount } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user.fullName ?? "");
  const [headline, setHeadline] = useState(user.headline ?? "");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Storage usage is untracked external state; the shared hook caches the
  // snapshot so its reference stays stable (a new object each call would loop).
  const usage = useStorageUsage();

  /* Load the avatar (IndexedDB) after mount. */
  useEffect(() => {
    let cancelled = false;
    void photoStore.get(user.id, AVATAR_KEY).then((stored) => {
      if (!cancelled) setAvatar(stored);
    });
    return () => {
      cancelled = true;
    };
  }, [user.id]);

  const currentUser = user;
  const email = currentUser.email;

  async function onPickAvatar(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Unsupported file", "Please choose an image file (PNG or JPEG).");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("File too large", "Avatars must be 2 MB or smaller.");
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await shrinkImage(file);
      // The avatar is small, so it lives in IndexedDB with the other binaries.
      await photoStore.put(currentUser.id, AVATAR_KEY, dataUrl);
      await updateProfile({ avatarUrl: dataUrl });
      setAvatar(dataUrl);
      toast.success("Avatar updated");
    } catch (error) {
      toast.error("Could not save avatar", authErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  async function onSaveProfile() {
    setSavingProfile(true);
    try {
      await updateProfile({ fullName, headline });
      toast.success("Saved", "Your profile has been updated.");
    } catch (error) {
      toast.error("Could not save", authErrorMessage(error));
    } finally {
      setSavingProfile(false);
    }
  }

  async function onChangePassword() {
    if (nextPassword.length < 6) {
      toast.error("Password too short", "Use at least 6 characters.");
      return;
    }
    if (nextPassword !== confirmPassword) {
      toast.error("Passwords do not match", "Please retype your new password.");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(currentPassword, nextPassword);
      toast.success("Password changed", "Use your new password next time you log in.");
      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Could not change password", authErrorMessage(error));
    } finally {
      setSavingPassword(false);
    }
  }

  async function onExportEverything() {
    try {
      const backup = await cvRepository.exportAll(currentUser.id);
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `cvforge-backup-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success("Backup exported", `${backup.cvs.length} CV(s) saved to your downloads.`);
    } catch (error) {
      toast.error("Could not export", authErrorMessage(error));
    }
  }

  function onSignOutEverywhere() {
    // There is only ever one session in this browser, so this clears it and
    // sends the user back to the login screen.
    void authService.logout().then(() => router.push("/login"));
  }

  async function onDeleteAccount() {
    setDeleting(true);
    try {
      // Remove the CVs and binaries owned by this account before the account row.
      await cvRepository.removeAll(currentUser.id);
      await photoStore.removeAll(currentUser.id);
      await deleteAccount(deletePassword);
      toast.success("Account deleted", "Your account and all CVs have been removed.");
      router.push("/");
    } catch (error) {
      toast.error("Could not delete account", authErrorMessage(error));
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="glass rounded-3xl p-6">
        <h2 className="text-base font-semibold text-[var(--page-fg)]">Profile</h2>
        <p className="mt-1 text-sm text-ink-400">
          This is how your account appears across CVForge. It is never shown on your CVs.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-white/5">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="Your avatar" className="size-full object-cover" />
            ) : (
              <UserRound className="size-8 text-ink-500" aria-hidden />
            )}
          </div>
          <div className="space-y-1.5">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void onPickAvatar(file);
                event.target.value = "";
              }}
            />
            <Button
              variant="outline"
              size="sm"
              loading={uploading}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="size-4" aria-hidden />
              Upload avatar
            </Button>
            <p className="text-xs text-ink-500">PNG, JPEG or WebP · up to 2 MB</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Full name" htmlFor="settings-name">
            <Input
              id="settings-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Alex Morgan"
              autoComplete="name"
            />
          </Field>
          <Field
            label="Headline"
            htmlFor="settings-headline"
            hint="A short line about what you do."
          >
            <Input
              id="settings-headline"
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              placeholder="Senior Product Designer"
            />
          </Field>
          <Field
            label="Email"
            htmlFor="settings-email"
            hint="Your email is your login and cannot be changed."
          >
            <Input id="settings-email" value={email} readOnly disabled />
          </Field>
        </div>

        <div className="mt-5 flex justify-end">
          <Button onClick={onSaveProfile} loading={savingProfile}>
            <Save className="size-4" aria-hidden />
            Save profile
          </Button>
        </div>
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="text-base font-semibold text-[var(--page-fg)]">Password</h2>
        <p className="mt-1 text-sm text-ink-400">
          Change the password used to log in to this account.
        </p>

        <div className="mt-5 space-y-4">
          <Field label="Current password" htmlFor="settings-current-password">
            <Input
              id="settings-current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Your current password"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="New password" htmlFor="settings-new-password">
              <Input
                id="settings-new-password"
                type="password"
                autoComplete="new-password"
                value={nextPassword}
                onChange={(event) => setNextPassword(event.target.value)}
                placeholder="At least 6 characters"
              />
            </Field>
            <Field label="Confirm new password" htmlFor="settings-confirm-password">
              <Input
                id="settings-confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat new password"
              />
            </Field>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button onClick={onChangePassword} loading={savingPassword}>
            <KeyRound className="size-4" aria-hidden />
            Change password
          </Button>
        </div>
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="text-base font-semibold text-[var(--page-fg)]">Your data</h2>
        <p className="mt-1 text-sm text-ink-400">
          Everything is stored in this browser. Export a backup to move it to another device.
        </p>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-500">Browser storage used</span>
            <span className={usage.nearFull ? "font-semibold text-amber-300" : "text-ink-400"}>
              {usage.percent}% · {formatBytes(usage.bytes)}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden>
            <div
              className={
                usage.nearFull
                  ? "h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-400"
                  : "h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
              }
              style={{ width: `${usage.percent}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="outline" onClick={onExportEverything}>
            <Download className="size-4" aria-hidden />
            Export backup
          </Button>
          <Button variant="outline" onClick={onSignOutEverywhere}>
            <LogOut className="size-4" aria-hidden />
            Sign out
          </Button>
        </div>
      </section>

      <section className="rounded-3xl border border-rose-500/30 bg-rose-500/[0.06] p-6">
        <h2 className="text-base font-semibold text-rose-200">Delete account</h2>
        <p className="mt-1 text-sm text-rose-200/80">
          This permanently deletes your account and every CV you have created. This cannot be undone.
        </p>
        <div className="mt-5">
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="size-4" aria-hidden />
            Delete my account
          </Button>
        </div>
      </section>

      <Modal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeletePassword("");
        }}
        title="Delete your account?"
        description="All CVs, photos and profile data will be permanently removed from this browser. This cannot be undone."
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setDeleteOpen(false);
                setDeletePassword("");
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={onDeleteAccount}
              loading={deleting}
              disabled={deletePassword.length === 0}
            >
              Permanently delete
            </Button>
          </>
        }
      >
        <Field
          label="Enter your password to confirm"
          htmlFor="delete-confirm"
          hint="This proves it is really you."
        >
          <Input
            id="delete-confirm"
            type="password"
            value={deletePassword}
            onChange={(event) => setDeletePassword(event.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
          />
        </Field>
      </Modal>
    </div>
  );
}
