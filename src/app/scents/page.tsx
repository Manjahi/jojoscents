import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import MotionGroup from "@/components/MotionGroup";
import { getAllProducts, type SanityProduct } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

export const revalidate = 1800;

function productImage(p: SanityProduct): string {
  if (p._mockImageUrl) return p._mockImageUrl;
  if (p.mainImage) return urlFor(p.mainImage as Parameters<typeof urlFor>[0]);
  return "/images/products/placeholder.webp";
}

const AUDIENCE_COLORS: Record<string, string> = {
  Women: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  Men: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Unisex: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
};

export default async function ScentsPage() {
  const products = await getAllProducts();

  return (
    <section className="pt-12 md:pt-16">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Collection</p>
        <h1 className="mt-4 text-3xl md:text-5xl">Scents</h1>
      </Reveal>

      <Reveal delay={0.06}>
        <p className="mt-4 text-muted max-w-2xl">
          Mood-first descriptions. Notes come second.
        </p>
      </Reveal>

      <MotionGroup>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Reveal key={p._id}>
              <Link
                href={`/scents/${p.slug}`}
                className="group block rounded-xl2 border border-border bg-card overflow-hidden hover:border-fg/30 transition-colors"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={productImage(p)}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                {/* Info */}
                <div className="p-5">
                  {/* Category badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.audience && (
                      <span className={`text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full ${AUDIENCE_COLORS[p.audience] ?? "bg-muted/20 text-muted"}`}>
                        {p.audience}
                      </span>
                    )}
                    {p.family && (
                      <span className="text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full border border-border text-muted">
                        {p.family}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base leading-snug">{p.name}</h3>
                    {p.price && <span className="text-sm text-muted shrink-0">{p.price}</span>}
                  </div>

                  {p.shortDescription && (
                    <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-2">
                      {p.shortDescription}
                    </p>
                  )}

                  {p.mood && p.mood.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.mood.slice(0, 3).map((m) => (
                        <span key={m} className="text-[10px] text-muted">
                          {m}
                          {p.mood && p.mood.indexOf(m) < Math.min(p.mood.length, 3) - 1 ? " ·" : ""}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted group-hover:text-[rgb(var(--accent))] transition-colors">
                    View details →
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </MotionGroup>
    </section>
  );
}
