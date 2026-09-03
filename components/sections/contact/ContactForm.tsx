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
import { treatmentCategoriesAr } from "@/data/ar/services/categories";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { getUiStrings } from "@/lib/i18n/ui";

type FormState = "idle" | "submitting" | "success" | "error";

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
  const locale = useLocale();
  const t = getUiStrings(locale);
  const categories = locale === "ar" ? treatmentCategoriesAr : treatmentCategories;
  const serviceOptions = [
    { value: "", label: t.generalInquiry },
    ...categories.map((category) => ({ value: category.title, label: category.title })),
  ];

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
    if (!payload.name) errors.name = t.nameRequired;
    if (!payload.phone) errors.phone = t.phoneRequired;
    if (!payload.email) errors.email = t.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) errors.email = t.emailInvalid;
    if (!payload.message) errors.message = t.messageRequired;

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
      setErrorMessage(result.error ?? t.genericError);
    }
  }

  if (state === "success") {
    return (
      <div className="glass-surface flex flex-col items-center gap-3 rounded-[28px] px-6 py-14 text-center sm:p-8">
        <span className="glass-surface inline-flex h-14 w-14 items-center justify-center rounded-full text-peach-300 shadow-glow-peach">
          <Send size={22} aria-hidden="true" />
        </span>
        <h3 className="font-display text-xl font-medium text-text-primary">{t.thankYou}</h3>
        <p className="max-w-sm font-body text-sm leading-relaxed text-text-secondary">{t.thankYouBody}</p>
        <Button type="button" variant="ghost" size="md" showIcon={false} onClick={() => setState("idle")}>
          {t.sendAnotherMessage}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="glass-surface flex flex-col gap-5 rounded-[28px] p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input id="contact-name" name="name" label={t.name} placeholder={t.namePlaceholder} autoComplete="name" error={fieldErrors.name} />
        <Input
          id="contact-phone"
          name="phone"
          label={t.phone}
          type="tel"
          placeholder={CONTACT.phoneDisplay}
          autoComplete="tel"
          error={fieldErrors.phone}
        />
      </div>

      <Input
        id="contact-email"
        name="email"
        label={t.email}
        type="email"
        placeholder={t.emailPlaceholder}
        autoComplete="email"
        error={fieldErrors.email}
      />

      <Select id="contact-service" name="service" label={t.treatmentOfInterest} options={serviceOptions} />

      <Textarea
        id="contact-message"
        name="message"
        label={t.message}
        placeholder={t.messagePlaceholder}
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
            {t.sending}
          </span>
        ) : (
          t.sendMessage
        )}
      </Button>
    </form>
  );
}
