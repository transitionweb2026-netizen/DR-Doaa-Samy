"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealStagger, RevealItem } from "@/components/motion/RevealOnScroll";
import { staggerContainer, fadeUp } from "@/components/motion/variants";
import { FAQItem } from "@/components/ui/FAQItem";
import { faqContent } from "@/data/home/faq";
import type { FaqItem } from "@/lib/types/content";

export function FAQSection({
  items = faqContent,
  eyebrow = "Good to Know",
  heading = "Frequently Asked Questions",
  headingId = "faq-heading",
}: {
  items?: FaqItem[];
  eyebrow?: string;
  heading?: string;
  headingId?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section aria-labelledby={headingId} className="relative py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow={eyebrow}
          heading={<span id={headingId}>{heading}</span>}
          align="center"
          className="mx-auto"
        />

        <RevealStagger variants={staggerContainer} className="mt-10 flex flex-col gap-4">
          {items.map((item, index) => (
            <RevealItem key={item.id} variants={fadeUp}>
              <FAQItem
                item={item}
                index={index}
                isOpen={openId === item.id}
                onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
              />
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </section>
  );
}
