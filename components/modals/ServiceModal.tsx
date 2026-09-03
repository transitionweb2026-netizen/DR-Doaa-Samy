import { CheckCircle2, Users } from "lucide-react";
import { ModalShell } from "./ModalShell";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import { Button } from "@/components/ui/Button";
import { useLocale, localizedHref } from "@/lib/i18n/LocaleContext";
import { getUiStrings } from "@/lib/i18n/ui";
import type { ServiceItem } from "@/lib/types/content";

export function ServiceModal({
  service,
  onClose,
  tone = "dark",
}: {
  service: ServiceItem | null;
  onClose: () => void;
  /** "blush" renders the light soft-pink glass variant (About page). */
  tone?: "dark" | "blush";
}) {
  const titleId = "service-modal-title";
  const locale = useLocale();
  const t = getUiStrings(locale);

  return (
    <ModalShell isOpen={Boolean(service)} onClose={onClose} titleId={titleId} tone={tone}>
      {service ? (
        <div className="flex flex-col gap-8">
          <MediaFrame
            image={service.image}
            tone="peach"
            label={service.shortLabel}
            className="aspect-[16/9] w-full rounded-[20px]"
          />

          <div>
            <p className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.2em] text-peach-300">
              {t.featuredServiceBadge}
            </p>
            <h3 id={titleId} className="font-display text-2xl font-medium text-text-primary sm:text-3xl">
              {service.name}
            </h3>
            <p className="mt-3 font-body text-base leading-relaxed text-text-secondary">
              {service.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h4 className="mb-3 flex items-center gap-2 font-body text-sm font-semibold text-text-primary">
                <CheckCircle2 size={16} className="text-peach-300" aria-hidden="true" />
                {t.benefits}
              </h4>
              <ul className="flex flex-col gap-2">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="font-body text-sm leading-relaxed text-text-secondary">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 flex items-center gap-2 font-body text-sm font-semibold text-text-primary">
                <Users size={16} className="text-peach-300" aria-hidden="true" />
                {t.suitableFor}
              </h4>
              <ul className="flex flex-col gap-2">
                {service.suitableFor.map((item) => (
                  <li key={item} className="font-body text-sm leading-relaxed text-text-secondary">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="rounded-2xl border border-glass-border bg-glass-bg px-4 py-3 font-body text-sm text-text-muted">
            {service.sessionInfo}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={localizedHref(locale, "/contact")} variant="primary" size="lg" className="sm:flex-1 sm:justify-center">
              {t.bookThisTreatment}
            </Button>
            <Button
              href={localizedHref(locale, "/services")}
              variant="ghost"
              size="lg"
              showIcon={false}
              className="sm:flex-1 sm:justify-center"
            >
              {t.viewFullServiceDetails}
            </Button>
          </div>
        </div>
      ) : null}
    </ModalShell>
  );
}
