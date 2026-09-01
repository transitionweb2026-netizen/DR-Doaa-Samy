import type { ReactNode } from "react";
import { CircleAlert, Compass, Info, ListChecks, Route, type LucideIcon } from "lucide-react";
import { ModalShell } from "./ModalShell";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import { Button } from "@/components/ui/Button";
import type { Treatment } from "@/lib/types/content";

/**
 * The Services page's detailed treatment modal — the fuller, authoritative
 * counterpart to Home's lighter ServiceModal teaser. Always rendered in the
 * light blush glass tone.
 */
export function TreatmentModal({ treatment, onClose }: { treatment: Treatment | null; onClose: () => void }) {
  const titleId = "treatment-modal-title";

  return (
    <ModalShell isOpen={Boolean(treatment)} onClose={onClose} titleId={titleId} tone="blush">
      {treatment ? (
        <div className="flex flex-col gap-8">
          <MediaFrame
            image={treatment.image}
            tone="rose"
            label={treatment.name}
            className="aspect-[16/9] w-full rounded-[20px]"
          />

          <div>
            <p className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.2em] text-peach-300">
              Treatment
            </p>
            <h3 id={titleId} className="font-display text-2xl font-medium text-text-primary sm:text-3xl">
              {treatment.name}
            </h3>
          </div>

          <ModalSection icon={Info} title="What Is It?">
            <p className="font-body text-sm leading-relaxed text-text-secondary">{treatment.whatIsIt}</p>
          </ModalSection>

          <ModalSection icon={CircleAlert} title="Common Concerns">
            <ul className="flex flex-col gap-1.5">
              {treatment.commonConcerns.map((concern) => (
                <li key={concern} className="font-body text-sm leading-relaxed text-text-secondary">
                  {concern}
                </li>
              ))}
            </ul>
          </ModalSection>

          <ModalSection icon={Compass} title="How It's Approached">
            <p className="font-body text-sm leading-relaxed text-text-secondary">{treatment.approach}</p>
          </ModalSection>

          <ModalSection icon={ListChecks} title="Treatment Options">
            <ul className="flex flex-col gap-1.5">
              {treatment.treatmentOptions.map((option) => (
                <li key={option} className="font-body text-sm leading-relaxed text-text-secondary">
                  {option}
                </li>
              ))}
            </ul>
          </ModalSection>

          <ModalSection icon={Route} title="Expected Journey">
            <p className="font-body text-sm leading-relaxed text-text-secondary">{treatment.journey}</p>
          </ModalSection>

          <p className="rounded-2xl border border-glass-border bg-glass-bg px-4 py-3 font-body text-sm leading-relaxed text-text-muted">
            {treatment.notes}
          </p>

          <Button href="/contact" variant="primary" size="lg" className="justify-center">
            {treatment.bookingLabel}
          </Button>
        </div>
      ) : null}
    </ModalShell>
  );
}

function ModalSection({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-3 flex items-center gap-2 font-body text-sm font-semibold text-text-primary">
        <Icon size={16} className="text-peach-300" aria-hidden="true" />
        {title}
      </h4>
      {children}
    </div>
  );
}
