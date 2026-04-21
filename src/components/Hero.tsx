import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section className="pt-14 md:pt-20">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-end">
        <div>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">
              Fragrance House
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-5 text-4xl md:text-6xl leading-[1.02]">
              Scent as identity—worn, not sprayed.
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 text-base md:text-lg text-muted max-w-xl">
              Minimal compositions. Maximum presence. A quiet luxury ritual designed
              for skin, memory, and mood.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.18}>
          <div className="rounded-xl2 border border-border bg-card p-6 md:p-8">
            <p className="text-sm text-muted uppercase tracking-[0.18em]">
              Notes
            </p>
            <p className="mt-3 text-lg">
              Editorial storytelling now—commerce later, when the brand is ready.
            </p>
            <p className="mt-4 text-sm text-muted">
              The site stays frontend-only. WordPress powers content.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
