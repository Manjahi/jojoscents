import Reveal from "@/components/Reveal";
import ContactSection from "@/components/ContactSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — JojoScents",
  description: "A Nairobi fragrance house. Crafted quietly, worn loudly.",
};

const pillars = [
  {
    label: "Philosophy",
    body: "Mood before notes. We describe how a scent makes you feel before we name its ingredients. Fragrance is emotion first.",
  },
  {
    label: "Craft",
    body: "Every formula is tested across skin types, seasons, and Nairobi's climate before it joins our collection.",
  },
  {
    label: "Community",
    body: "Built on referrals and trust. Our clients are our best storytellers—and their recommendations our finest marketing.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-12 md:pt-16 max-w-3xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Our Story</p>
          <h1 className="mt-4 text-3xl md:text-5xl leading-[1.05]">
            Scent as a second skin.
          </h1>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 text-muted leading-relaxed">
            JojoScents was born in Nairobi from a simple conviction: fragrance should feel
            personal, not performative. We curate and blend scents that move with you—quietly,
            confidently, and without apology.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-5 text-muted leading-relaxed">
            Every scent we carry is selected for its character, not its label. We work with master
            perfumers to bring you formulas that last, layer beautifully, and evolve on your skin
            throughout the day.
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-5 text-muted leading-relaxed">
            We started small—a handful of bottles, a WhatsApp group, and a promise to never
            recommend something we wouldn&apos;t wear ourselves. That principle hasn&apos;t
            changed.
          </p>
        </Reveal>
      </section>

      <section className="mt-16 md:mt-24 grid md:grid-cols-3 gap-6">
        {pillars.map(({ label, body }, i) => (
          <Reveal key={label} delay={i * 0.06}>
            <div className="rounded-xl2 border border-border bg-card p-6 md:p-8 h-full">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
              <p className="mt-4 text-sm text-muted leading-relaxed">{body}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <Reveal delay={0.1}>
        <ContactSection />
      </Reveal>
    </>
  );
}
