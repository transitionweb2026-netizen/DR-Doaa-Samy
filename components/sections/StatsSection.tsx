import { Award, CalendarClock, HeartHandshake, Layers, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Counter } from "@/components/motion/Counter";
import { RevealOnScroll, RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { staggerContainer, cardReveal, slideInLeft } from "@/components/motion/variants";
import { statsContent } from "@/data/home/stats";
import type { StatItem } from "@/lib/types/content";

// Position-based, not id-keyed: CMS-authored rows carry database UUIDs, not
// the local data's semantic ids ("cases", "experience", ...), so icon
// assignment has to survive that swap.
const STAT_ICON_CYCLE: LucideIcon[] = [Award, CalendarClock, HeartHandshake, Layers];

export function StatsSection({ stats = statsContent }: { stats?: StatItem[] }) {
  const heroIndex = stats.findIndex((stat) => stat.emphasis === "hero");
  const hero = heroIndex >= 0 ? stats[heroIndex] : stats[0];
  const rest = stats.filter((_, i) => i !== (heroIndex >= 0 ? heroIndex : 0));

  return (
    <section aria-label="Achievements" className="relative py-16 sm:py-20">
      <Container>
        <GlassCard
          variant="elevated"
          className="flex flex-col overflow-hidden rounded-[32px] lg:flex-row lg:items-stretch"
        >
          {/* Hero figure — visually dominant, asymmetric against the trio */}
          <RevealOnScroll
            variants={slideInLeft}
            className="relative flex flex-1 items-center gap-5 overflow-hidden border-b border-glass-border px-7 py-9 sm:px-10 sm:py-11 lg:border-b-0 lg:border-e lg:py-12"
          >
            <div
              aria-hidden="true"
              className="absolute -start-10 -top-14 h-48 w-48 rounded-full bg-[radial-gradient(circle,var(--color-peach-400),transparent_70%)] opacity-30 blur-2xl"
            />
            <span className="glass-surface relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-peach-300 shadow-glow-peach">
              <Award size={22} aria-hidden="true" />
            </span>
            <div className="relative">
              <p
                className="font-display text-[clamp(2.75rem,5.5vw,4rem)] font-medium leading-none text-text-primary"
                aria-label={`${hero.value.toLocaleString("en-US")}${hero.suffix ?? ""} ${hero.label}`}
              >
                <Counter value={hero.value} suffix={hero.suffix} />
              </p>
              <p className="mt-2 font-body text-sm font-medium uppercase tracking-[0.18em] text-text-muted">
                {hero.label}
              </p>
            </div>
          </RevealOnScroll>

          {/* Supporting trio — smaller scale, quieter treatment, clearly secondary */}
          <RevealStagger
            variants={staggerContainer}
            className="grid grid-cols-3 divide-x divide-glass-border px-2 py-7 sm:px-4 lg:flex-1 lg:py-0"
          >
            {rest.map((stat, index) => (
              <StatItemCell key={stat.id} stat={stat} icon={STAT_ICON_CYCLE[index % STAT_ICON_CYCLE.length]} />
            ))}
          </RevealStagger>
        </GlassCard>
      </Container>
    </section>
  );
}

function StatItemCell({ stat, icon: Icon }: { stat: StatItem; icon?: LucideIcon }) {
  return (
    <RevealItem
      variants={cardReveal}
      className="flex flex-col items-center gap-2 px-2 py-2 text-center lg:justify-center lg:py-8"
    >
      {Icon ? <Icon size={16} className="mb-1 text-peach-300/80" aria-hidden="true" /> : null}
      <p
        className="font-display text-[clamp(1.4rem,2.6vw,2rem)] font-medium leading-none text-text-primary"
        aria-label={`${stat.value.toLocaleString("en-US")}${stat.suffix ?? ""} ${stat.label}`}
      >
        <Counter value={stat.value} suffix={stat.suffix} />
      </p>
      <p className="font-body text-[11px] font-medium uppercase leading-tight tracking-[0.14em] text-text-muted sm:text-xs">
        {stat.label}
      </p>
    </RevealItem>
  );
}
