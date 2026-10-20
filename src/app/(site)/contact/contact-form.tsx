"use client";

import { useState } from "react";
import { CheckCircle2, Mail, Send, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { useAuth } from "@/components/providers/auth-provider";
import { CONTACT_SUBJECTS, contactSchema, type ContactInput } from "@/lib/contact/schema";
import { SUPPORT_EMAIL } from "@/lib/site";
import { localStore, readJson, writeJson } from "@/services/local/storage";

export const CONTACT_MESSAGES_KEY = "cvforge_contact_messages";

interface StoredMessage extends ContactInput {
  id: string;
  createdAt: string;
}

/**
 * The contact form with no backend.
 *
 * With no server to receive a message, the form does the two useful things it
 * still can: it validates the input, saves a copy locally so nothing is lost,
 * and hands the user a pre-filled `mailto:` link so the message actually
 * reaches a human. This is deliberately honest with the visitor about that.
 */
export function ContactForm() {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});
  const [mailto, setMailto] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      company: formData.get("company") ?? "",
    };

    const parsed = contactSchema.safeParse(values);

    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof ContactInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactInput | undefined;
        if (key && !nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      setMessage("Please fix the highlighted fields and try again.");
      return;
    }

    // Honeypot tripped — pretend success so the bot does not retry.
    if (parsed.data.company) {
      setSent(true);
      return;
    }

    setErrors({});
    setMessage(null);
    setPending(true);

    // Keep a local copy so the visitor's words are never lost.
    try {
      const stored = readJson<StoredMessage[]>(localStore(), CONTACT_MESSAGES_KEY, []);
      const entry: StoredMessage = {
        ...parsed.data,
        id: `msg_${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
      };
      writeJson(localStore(), CONTACT_MESSAGES_KEY, [entry, ...stored].slice(0, 50));
    } catch {
      // A full or unavailable store must not block the mailto fallback.
    }

    const subject = encodeURIComponent(`[CVForge] ${parsed.data.subject}`);
    const body = encodeURIComponent(
      `${parsed.data.message}\n\n—\n${parsed.data.name}\n${parsed.data.email}`,
    );
    const href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

    setMailto(href);
    setPending(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="glass rounded-3xl p-8 text-center" role="status">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <h2 className="mt-5 text-xl font-semibold">Thanks — your message is ready</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-400">
          CVForge runs entirely in your browser, so there is no server to receive this form. A copy
          has been saved on this device — send it on with one click below and it will reach us by
          email.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {mailto ? (
            <a
              href={mailto}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
            >
              <Mail className="size-4" aria-hidden />
              Open in your email app
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setMailto(null);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-soft)] bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
          >
            Send another message
          </button>
        </div>
        <p className="mt-4 text-xs text-ink-500">
          Prefer to write directly?{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-cyan-300 hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass space-y-5 rounded-3xl p-6 sm:p-8" noValidate>
      {message ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3.5 text-sm text-rose-200"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {message}
        </div>
      ) : null}

      <div className="flex items-start gap-2.5 rounded-2xl border border-cyan-400/30 bg-cyan-500/[0.07] p-3.5 text-xs leading-relaxed text-cyan-100">
        <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>
          There is no message server in this build. Your message is saved on this device and then
          opened in your email app so it reaches us directly.
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="contact-name" error={errors.name} required>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            placeholder="Alex Morgan"
            invalid={Boolean(errors.name)}
            required
          />
        </Field>

        <Field label="Email address" htmlFor="contact-email" error={errors.email} required>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="alex@example.com"
            defaultValue={user?.email ?? undefined}
            invalid={Boolean(errors.email)}
            required
          />
        </Field>
      </div>

      <Field label="What is this about?" htmlFor="contact-subject" error={errors.subject} required>
        <Select
          id="contact-subject"
          name="subject"
          defaultValue="General question"
          invalid={Boolean(errors.subject)}
        >
          {CONTACT_SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Message"
        htmlFor="contact-message"
        error={errors.message}
        hint="The more detail you give, the faster we can help."
        required
      >
        <Textarea
          id="contact-message"
          name="message"
          rows={7}
          placeholder="Tell us what you need help with…"
          invalid={Boolean(errors.message)}
          required
        />
      </Field>

      {/* Honeypot — hidden from humans, tempting to bots. */}
      <div className="hidden" aria-hidden>
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-soft)] pt-5">
        <p className="max-w-xs text-xs leading-relaxed text-ink-500">
          By sending a message you agree to our privacy policy. We only use your email to reply.
        </p>
        <Button type="submit" size="lg" loading={pending}>
          {pending ? "Preparing…" : "Send message"}
          {!pending ? <Send className="size-4" aria-hidden /> : null}
        </Button>
      </div>
    </form>
  );
}
