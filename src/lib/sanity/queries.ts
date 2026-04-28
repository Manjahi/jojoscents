import { sanityClient, isSanityConfigured } from "./client";
import type { SanityProduct, JournalDoc } from "./types";

export type { SanityProduct, JournalDoc };

const PRODUCT_FIELDS = `
  _id,
  name,
  "slug": slug.current,
  audience,
  family,
  mood,
  price,
  shortDescription,
  notes,
  mainImage,
  featured
`;

export const productsQuery = `*[_type == "product"] | order(_createdAt desc) {${PRODUCT_FIELDS}}`;
export const featuredProductsQuery = `*[_type == "product" && featured == true] | order(_createdAt desc) {${PRODUCT_FIELDS}}`;
export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {${PRODUCT_FIELDS}, gallery}`;

async function fetchSanity<T>(query: string, params: Record<string, string> = {}): Promise<T> {
  return sanityClient!.fetch<T>(query, params, { next: { revalidate: 1800 } });
}

export async function getAllProducts(): Promise<SanityProduct[]> {
  if (!isSanityConfigured()) {
    const { MOCK_PRODUCTS } = await import("../mock");
    return MOCK_PRODUCTS;
  }
  return fetchSanity<SanityProduct[]>(productsQuery);
}

export async function getFeaturedProducts(): Promise<SanityProduct[]> {
  if (!isSanityConfigured()) {
    const { MOCK_PRODUCTS } = await import("../mock");
    return MOCK_PRODUCTS.filter((p) => p.featured);
  }
  return fetchSanity<SanityProduct[]>(featuredProductsQuery);
}

export async function getProductBySlug(slug: string): Promise<SanityProduct | null> {
  if (!isSanityConfigured()) {
    const { MOCK_PRODUCTS } = await import("../mock");
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  return fetchSanity<SanityProduct | null>(productBySlugQuery, { slug });
}

// Journal uses mock data until Sanity journal schema is set up
export async function getAllJournal(): Promise<JournalDoc[]> {
  const { MOCK_JOURNAL } = await import("../mock");
  return MOCK_JOURNAL;
}

export async function getJournalBySlug(slug: string): Promise<JournalDoc | null> {
  const { MOCK_JOURNAL } = await import("../mock");
  return MOCK_JOURNAL.find((p) => p.slug === slug) ?? null;
}
