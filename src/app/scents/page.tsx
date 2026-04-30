import Reveal from "@/components/Reveal";
import ScentsClient from "@/components/ScentsClient";
import { getAllProducts } from "@/lib/sanity/queries";

export const revalidate = 1800;

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
          Mood-first descriptions. Notes come second. Search or filter to find yours.
        </p>
      </Reveal>

      <ScentsClient products={products} />
    </section>
  );
}
