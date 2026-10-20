"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound, MailQuestion, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useToast } from "@/components/providers/toast-provider";
import { authErrorMessage } from "@/components/providers/auth-provider";
import { authService } from "@/services";
import { emailField, passwordField, confirmPasswordError, fieldErrors } from "@/lib/auth-validation";
import { AuthAlert } from "../auth-form";

type Step = "request" | "reset" | "done";

/**
 * Local password reset.
 *
 * With no backend there is no way to email a link, so the flow is honest about
 * it: confirm the account exists in THIS browser, then let the user set a new
 * password immediately.
 */
export function ForgotPasswordForm() {
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parsed = emailField.safeParse(formData.get("email"));

    if (!parsed.success) {
      setErrors({ email: "Enter a valid email address." });
      setMessage("Please check the highlighted field.");
      return;
    }

    setErrors({});
    setMessage(null);
    setPending(true);

    try {
      const result = await authService.requestReset(parsed.data);
      setEmail(result.email);
      setStep("reset");
    } catch (error) {
      const text = authErrorMessage(error);
      setMessage(text);
      setErrors({ email: text });
      toastError("Could not find that account", text);
    } finally {
      setPending(false);
    }
  }

  async function onReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parsed = passwordField.safeParse(formData.get("password"));

    const nextErrors: Record<string, string> = parsed.success ? {} : fieldErrors(parsed.error);
    const mismatch = confirmPasswordError(formData.get("password"), formData.get("confirmPassword"));
    if (mismatch) Object.assign(nextErrors, mismatch);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setMessage("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    setMessage(null);
    setPending(true);

    try {
      await authService.resetPassword(email, parsed.success ? parsed.data : "");
      success("Password updated", "You can use your new password to log in now.");
      setStep("done");
      // Give the confirmation a beat to read, then send them to log in.
      setTimeout(() => router.replace("/login"), 900);
    } catch (error) {
      const text = authErrorMessage(error);
      setMessage(text);
      toastError("Could not update your password", text);
    } finally {
      setPending(false);
    }
  }

  /* ------------------------------- step 1 ------------------------------- */
  if (step === "request") {
    return (
      <form onSubmit={onRequest} className="space-y-4" noValidate>
        {message ? <AuthAlert>{message}</AuthAlert> : null}

        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-200">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            There is no email service, so no reset link is sent. If the account exists in this
            browser, you will set a new password on the next screen.
          </span>
        </div>

        <Field label="Email address" htmlFor="forgot-email" error={errors.email} required>
          <Input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="alex@example.com"
            invalid={Boolean(errors.email)}
            required
          />
        </Field>

        <Button type="submit" size="lg" fullWidth loading={pending}>
          {!pending ? <MailQuestion className="size-4" aria-hidden /> : null}
          {pending ? "Checking…" : "Continue"}
        </Button>
      </form>
    );
  }

  /* ------------------------------- step 2 ------------------------------- */
  if (step === "reset") {
    return (
      <form onSubmit={onReset} className="space-y-4" noValidate>
        {message ? <AuthAlert>{message}</AuthAlert> : null}

        <p className="text-sm text-ink-400">
          Setting a new password for{" "}
          <span className="font-medium text-[var(--page-fg)]">{email}</span>.
        </p>

        <Field label="New password" htmlFor="forgot-password" error={errors.password} required>
          <Input
            id="forgot-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            invalid={Boolean(errors.password)}
            required
          />
        </Field>

        <Field
          label="Confirm new password"
          htmlFor="forgot-confirm"
          error={errors.confirmPassword}
          required
        >
          <Input
            id="forgot-confirm"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your new password"
            invalid={Boolean(errors.confirmPassword)}
            required
          />
        </Field>

        <Button type="submit" size="lg" fullWidth loading={pending}>
          {!pending ? <KeyRound className="size-4" aria-hidden /> : null}
          {pending ? "Updating…" : "Set new password"}
        </Button>

        <button
          type="button"
          onClick={() => {
            setStep("request");
            setMessage(null);
            setErrors({});
          }}
          className="w-full text-center text-xs text-ink-500 hover:text-cyan-300"
        >
          Use a different email
        </button>
      </form>
    );
  }

  /* ------------------------------- step 3 ------------------------------- */
  return (
    <div className="text-center" role="status">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
        <CheckCircle2 className="size-7" aria-hidden />
      </span>
      <h2 className="mt-5 text-lg font-semibold">Password updated</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-400">
        Taking you to the login screen…
      </p>
      <div className="mt-6">
        <Link href="/login" className="text-sm font-semibold text-cyan-300 hover:underline">
          Go to log in
        </Link>
      </div>
    </div>
  );
}
