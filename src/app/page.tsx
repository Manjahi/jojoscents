import FullBleed from "@/components/FullBleed";
import HeroImageCarousel from "@/components/HeroImageCarousel";
import ProductGrid, { Product } from "@/components/ProductGrid";
import NewsletterSection from "@/components/NewsletterSection";
import ContactSection from "@/components/ContactSection";
import Reveal from "@/components/Reveal";
import { getFeaturedProducts, type SanityProduct } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

function toProduct(p: SanityProduct): Product {
  return {
    id: p._id,
    name: p.name,
    price: p.price ?? "",
    details: p.shortDescription ?? "",
    image: p._mockImageUrl ?? (p.mainImage ? urlFor(p.mainImage as Parameters<typeof urlFor>[0]) : "/images/products/placeholder.webp"),
    href: `/scents/${p.slug}`,
  };
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  const forWomen = products.filter((p) => p.audience === "Women").map(toProduct);
  const forMen = products.filter((p) => p.audience === "Men").map(toProduct);
  const unisex = products.filter((p) => p.audience === "Unisex").map(toProduct);

  return (
    <>
      <FullBleed>
        <HeroImageCarousel />
      </FullBleed>

      <section className="mt-16 md:mt-24">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <Reveal>
            <h2 className="text-2xl md:text-3xl">Fragrance speaks louder than words.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-muted leading-relaxed">
              A space for discovering scents through mood, memory, personality, and presence — not just brand names or pretty bottles.
            </p>
          </Reveal>
        </div>
      </section>

      {forWomen.length > 0 && (
        <Reveal delay={0.06}>
          <ProductGrid
            title="Women's Best Sellers"
            subtitle="A curated edit of signature scents."
            products={forWomen}
          />
        </Reveal>
      )}

      {forMen.length > 0 && (
        <Reveal delay={0.08}>
          <ProductGrid
            title="Men's Best Sellers"
            subtitle="Quiet power, refined presence."
            products={forMen}
          />
        </Reveal>
      )}

      {unisex.length > 0 && (
        <Reveal delay={0.1}>
          <ProductGrid
            title="Unisex"
            subtitle="Worn without limits."
            products={unisex}
          />
        </Reveal>
      )}

      <Reveal delay={0.12}>
        <NewsletterSection />
      </Reveal>

      <Reveal delay={0.14}>
        <ContactSection />
      </Reveal>
    </>
  );
}
