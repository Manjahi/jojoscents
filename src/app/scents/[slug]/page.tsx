import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { getProductBySlug } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import type { SanityProduct } from "@/lib/sanity/types";

export const revalidate = 1800;

function heroImage(p: SanityProduct): string {
  if (p._mockImageUrl) return p._mockImageUrl;
  if (p.mainImage) return urlFor(p.mainImage as Parameters<typeof urlFor>[0], 1200);
  return "/images/products/placeholder.webp";
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254700000000";

export default async function ScentDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  const waText = `Hi JojoScents, I'm interested in ${product.name}.`;
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

  return (
    <article className="pt-12 md:pt-16">
      <Reveal>
        <Link
          href="/scents"
          className="text-xs uppercase tracking-[0.18em] text-muted hover:text-[rgb(var(--accent))] transition-colors"
        >
          ← All Scents
        </Link>
      </Reveal>

      <div className="mt-8 grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        {/* Image */}
        <Reveal delay={0.04}>
          <div className="relative aspect-square rounded-xl2 overflow-hidden border border-border">
            <Image
              src={heroImage(product)}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </Reveal>

        {/* Details */}
        <div>
          <Reveal delay={0.06}>
            {/* Category badges */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.audience && (
                <span className="text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-full border border-border text-muted">
                  {product.audience}
                </span>
              )}
              {product.family && (
                <span className="text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-full border border-border text-muted">
                  {product.family}
                </span>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="text-3xl md:text-4xl">{product.name}</h1>
          </Reveal>

          {product.price && (
            <Reveal delay={0.1}>
              <p className="mt-2 text-muted">{product.price}</p>
            </Reveal>
          )}

          {product.shortDescription && (
            <Reveal delay={0.12}>
              <p className="mt-5 text-muted leading-relaxed">{product.shortDescription}</p>
            </Reveal>
          )}

          {/* Notes */}
          {product.notes && product.notes.length > 0 && (
            <Reveal delay={0.14}>
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.22em] text-muted mb-3">Notes</p>
                <div className="flex flex-wrap gap-2">
                  {product.notes.map((note) => (
                    <span
                      key={note}
                      className="text-sm px-3 py-1.5 rounded-xl2 border border-border bg-card text-muted"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* Mood */}
          {product.mood && product.mood.length > 0 && (
            <Reveal delay={0.16}>
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.22em] text-muted mb-3">Mood</p>
                <p className="text-sm text-muted">{product.mood.join(" · ")}</p>
              </div>
            </Reveal>
          )}

          {/* CTA */}
          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={waUrl}
                target="_blank"
                className="rounded-xl2 border border-border bg-card px-5 py-3 text-sm hover:border-fg/30 transition-colors"
              >
                Get this scent via WhatsApp →
              </Link>
              <Link
                href="/inquire"
                className="rounded-xl2 border border-border bg-transparent px-5 py-3 text-sm text-muted hover:border-fg/30 transition-colors"
              >
                Inquire
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}
