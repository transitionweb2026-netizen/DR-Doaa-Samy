import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { staggerContainer, cardReveal } from "@/components/motion/variants";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { treatmentCategories } from "@/data/services/categories";
import { cn } from "@/lib/utils/cn";

// A gentle editorial stagger at desktop widths — alternating cards sit a
// little higher or lower, rather than a flat, mechanical row.
const OFFSET = ["lg:translate-y-3", "lg:-translate-y-2", "lg:translate-y-4", "lg:-translate-y-2", "lg:translate-y-2"];

export function CategorySelectorSection() {
  return (
    <section aria-labelledby="concerns-heading" className="relative py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Start Here"
          heading={<span id="concerns-heading">What Do You Need to Treat?</span>}
          description="Choose the area closest to your concern — it jumps straight to the relevant treatments below."
          align="center"
          className="mx-auto"
        />

        {/* Horizontal scroll-snap on mobile (deliberately not a tall stack
            of 5 large cards); a gently staggered row from `lg`. */}
        <RevealStagger
          variants={staggerContainer}
          className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5"
        >
          {treatmentCategories.map((category, index) => (
            <RevealItem
              key={category.id}
              variants={cardReveal}
              className={cn("w-[72vw] shrink-0 snap-start sm:w-auto sm:shrink", OFFSET[index % OFFSET.length])}
            >
              <CategoryCard category={category} index={index} />
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </section>
  );
}
