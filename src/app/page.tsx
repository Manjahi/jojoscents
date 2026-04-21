import FullBleed from "@/components/FullBleed";
import HeroImageCarousel from "@/components/HeroImageCarousel";
import ProductGrid, { Product } from "@/components/ProductGrid";
import NewsletterSection from "@/components/NewsletterSection";
import ContactSection from "@/components/ContactSection";
import Reveal from "@/components/Reveal";
import { getList, getFeaturedImageUrl, type WPPost } from "@/lib/wp";
import { stripHtml } from "@/lib/sanitize";

function wpToProduct(post: WPPost): Product {
  return {
    id: String(post.id),
    name: stripHtml(post.title.rendered),
    price: post.acf?.price ?? post.meta?.price ?? "",
    details: stripHtml(post.excerpt?.rendered ?? ""),
    image: getFeaturedImageUrl(post) || "/images/products/placeholder.webp",
    href: `/scents/${post.slug}`,
  };
}

export default async function HomePage() {
  const womensCatId = process.env.WP_WOMENS_CAT_ID;
  const mensCatId = process.env.WP_MENS_CAT_ID;

  let forWomen: Product[] = [];
  let forMen: Product[] = [];
  let featured: Product[] = [];

  if (womensCatId && mensCatId) {
    const [wRaw, mRaw] = await Promise.all([
      getList("scents", { categories: womensCatId, per_page: "3" }),
      getList("scents", { categories: mensCatId, per_page: "3" }),
    ]);
    forWomen = wRaw.map(wpToProduct);
    forMen = mRaw.map(wpToProduct);
  } else {
    const raw = await getList("scents", { per_page: "6" });
    featured = raw.map(wpToProduct);
  }

  const hasSplit = forWomen.length > 0 || forMen.length > 0;

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
              Built to feel like a luxury magazine: whitespace, restraint, and slow
              motion—optimized for both desktop and mobile from day one.
            </p>
          </Reveal>
        </div>
      </section>

      {hasSplit ? (
        <>
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
        </>
      ) : featured.length > 0 ? (
        <Reveal delay={0.06}>
          <ProductGrid
            title="Featured Scents"
            subtitle="A curated edit of our collection."
            products={featured}
          />
        </Reveal>
      ) : null}

      <Reveal delay={0.1}>
        <NewsletterSection />
      </Reveal>

      <Reveal delay={0.12}>
        <ContactSection />
      </Reveal>
    </>
  );
}
