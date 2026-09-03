import { ModalShell } from "./ModalShell";
import { MediaFrame } from "@/components/ui/MediaPlaceholder";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { getUiStrings } from "@/lib/i18n/ui";
import type { CaseItem } from "@/lib/types/content";

export function CaseModal({
  item,
  onClose,
  tone = "dark",
}: {
  item: CaseItem | null;
  onClose: () => void;
  /** "blush" renders the light soft-pink glass variant (About page). */
  tone?: "dark" | "blush";
}) {
  const titleId = "case-modal-title";
  const t = getUiStrings(useLocale());

  return (
    <ModalShell isOpen={Boolean(item)} onClose={onClose} titleId={titleId} tone={tone}>
      {item ? (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="mb-2 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                {t.before}
              </p>
              <MediaFrame image={item.before} tone="charcoal" label={t.before} className="aspect-square w-full rounded-2xl" />
            </div>
            <div>
              <p className="mb-2 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                {t.after}
              </p>
              <MediaFrame image={item.after} tone="blush" label={t.after} className="aspect-square w-full rounded-2xl" />
            </div>
          </div>

          <div>
            <h3 id={titleId} className="font-display text-2xl font-medium text-text-primary sm:text-3xl">
              {item.title}
            </h3>
            <p className="mt-3 font-body text-base leading-relaxed text-text-secondary">{item.story}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InfoBlock label={t.concern} value={item.concern} />
            <InfoBlock label={t.treatmentLabel} value={item.treatment} />
            <InfoBlock label={t.result} value={item.result} />
          </div>

          <p className="font-body text-xs leading-relaxed text-text-muted">{t.caseDisclaimer}</p>
        </div>
      ) : null}
    </ModalShell>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-glass-border bg-glass-bg px-4 py-3">
      <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-peach-300">{label}</p>
      <p className="mt-1 font-body text-sm leading-relaxed text-text-secondary">{value}</p>
    </div>
  );
}
