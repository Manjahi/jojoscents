export type SanityProduct = {
  _id: string;
  name: string;
  slug: string;
  audience?: "Women" | "Men" | "Unisex";
  family?: string;
  mood?: string[];
  season?: string[];
  price?: string;
  priceAmount?: number;
  shortDescription?: string;
  notes?: string[];
  mainImage?: unknown;
  gallery?: unknown[];
  featured?: boolean;
  _mockImageUrl?: string;
};

export type JournalDoc = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string[];
  publishedAt: string;
};
