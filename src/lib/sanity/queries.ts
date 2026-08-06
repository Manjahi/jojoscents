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
  season,
  price,
  priceAmount,
  shortDescription,
  notes,
  mainImage,
  featured
`;

export const productsQuery = `*[_type == "product"] | order(_createdAt desc) {${PRODUCT_FIELDS}}`;
export const featuredProductsQuery = `*[_type == "product" && featured == true] | order(_createdAt desc) {${PRODUCT_FIELDS}}`;
export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {${PRODUCT_FIELDS}, gallery}`;

const JOURNAL_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  category,
  excerpt,
  mainImage,
  featured
`;

export const journalQuery = `*[_type == "journal"] | order(publishedAt desc) {${JOURNAL_FIELDS}}`;
export const journalBySlugQuery = `*[_type == "journal" && slug.current == $slug][0] {${JOURNAL_FIELDS}, content}`;

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

export async function getAllJournal(): Promise<JournalDoc[]> {
  if (!isSanityConfigured()) {
    const { MOCK_JOURNAL } = await import("../mock");
    return MOCK_JOURNAL;
  }
  return fetchSanity<JournalDoc[]>(journalQuery);
}

export async function getJournalBySlug(slug: string): Promise<JournalDoc | null> {
  if (!isSanityConfigured()) {
    const { MOCK_JOURNAL } = await import("../mock");
    return MOCK_JOURNAL.find((p) => p.slug === slug) ?? null;
  }
  return fetchSanity<JournalDoc | null>(journalBySlugQuery, { slug });
}
