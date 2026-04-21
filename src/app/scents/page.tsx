import Link from "next/link";
import Reveal from "@/components/Reveal";
import MotionGroup from "@/components/MotionGroup";
import { getList } from "@/lib/wp";
import { sanitizeHtml } from "@/lib/sanitize";

export default async function ScentsPage() {
  const scents = await getList("scents");

  return (
    <section className="pt-12 md:pt-16">
      <Reveal>
        <h1 className="text-3xl md:text-5xl">Scents</h1>
      </Reveal>

      <p className="mt-4 text-muted max-w-2xl">
        Mood-first descriptions. Notes come second.
      </p>

      <MotionGroup>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {scents.map((s) => (
            <Reveal key={s.id}>
              <Link
                href={`/scents/${s.slug}`}
                className="block rounded-xl2 border border-border bg-card p-6 hover:border-fg/30 transition-colors"
              >
                <h3
                  className="text-lg"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(s.title.rendered) }}
                />
                <div
                  className="mt-3 text-sm text-muted line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(s.excerpt?.rendered ?? "") }}
                />
                <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted">
                  View details
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </MotionGroup>
    </section>
  );
}
