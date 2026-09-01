"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { submitContactRequest } from "@/lib/api/contact";
import { CONTACT } from "@/lib/constants/site";
import { treatmentCategories } from "@/data/services/categories";

type FormState = "idle" | "submitting" | "success" | "error";

const SERVICE_OPTIONS = [
  { value: "", label: "General Inquiry" },
  ...treatmentCategories.map((category) => ({ value: category.title, label: category.title })),
];

/**
 * Idle → submitting → success/error. Validates client-side for immediate
 * feedback, then POSTs to /api/contact (see that route for what "submit"
 * currently does — no email/CRM is wired up yet, so this is honest about
 * "received," not "sent to Dr. Doaa").
 */
export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      service: String(data.get("service") ?? "").trim() || undefined,
      message: String(data.get("message") ?? "").trim(),
    };

    const errors: Record<string, string> = {};
    if (!payload.name) errors.name = "Please enter your name.";
    if (!payload.phone) errors.phone = "Please enter a phone number.";
    if (!payload.email) errors.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) errors.email = "Please enter a valid email address.";
    if (!payload.message) errors.message = "Let us know how we can help.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setState("error");
      setErrorMessage(null);
      return;
    }

    setFieldErrors({});
    setState("submitting");
    setErrorMessage(null);

    const result = await submitContactRequest(payload);
    if (result.ok) {
      setState("success");
      form.reset();
    } else {
      setState("error");
      setErrorMessage(result.error ?? "Something went wrong. Please try again.");
    }
  }

  if (state === "success") {
    return (
      <div className="glass-surface flex flex-col items-center gap-3 rounded-[28px] px-6 py-14 text-center sm:p-8">
        <span className="glass-surface inline-flex h-14 w-14 items-center justify-center rounded-full text-peach-300 shadow-glow-peach">
          <Send size={22} aria-hidden="true" />
        </span>
        <h3 className="font-display text-xl font-medium text-text-primary">Thank you</h3>
        <p className="max-w-sm font-body text-sm leading-relaxed text-text-secondary">
          We&rsquo;ve received your request and will get back to you shortly. For anything urgent, WhatsApp or call
          the clinic directly.
        </p>
        <Button type="button" variant="ghost" size="md" showIcon={false} onClick={() => setState("idle")}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="glass-surface flex flex-col gap-5 rounded-[28px] p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input id="contact-name" name="name" label="Name" placeholder="Your full name" autoComplete="name" error={fieldErrors.name} />
        <Input
          id="contact-phone"
          name="phone"
          label="Phone"
          type="tel"
          placeholder={CONTACT.phoneDisplay}
          autoComplete="tel"
          error={fieldErrors.phone}
        />
      </div>

      <Input
        id="contact-email"
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={fieldErrors.email}
      />

      <Select id="contact-service" name="service" label="Treatment of Interest (Optional)" options={SERVICE_OPTIONS} />

      <Textarea
        id="contact-message"
        name="message"
        label="Message"
        placeholder="Tell us a little about what you'd like to discuss."
        rows={5}
        error={fieldErrors.message}
      />

      {state === "error" && errorMessage ? (
        <p role="alert" className="font-body text-sm text-rose-400">
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        showIcon={false}
        disabled={state === "submitting"}
        className="justify-center"
      >
        {state === "submitting" ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Sending…
          </span>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
