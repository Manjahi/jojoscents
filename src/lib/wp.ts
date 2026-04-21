export type WPPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  content?: { rendered: string };
  date: string;
  meta?: Record<string, string>;
  acf?: Record<string, string>;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text: string }>;
  };
};

export async function wpFetch<T>(path: string, revalidateSeconds = 3600): Promise<T> {
  const API = process.env.WP_API_URL;
  if (!API) throw new Error("Missing WP_API_URL in .env.local");
  const res = await fetch(`${API}${path}`, {
    next: { revalidate: revalidateSeconds },
  });
  if (!res.ok) throw new Error(`WP fetch failed: ${res.status} ${path}`);
  return res.json();
}

function isMockMode(): boolean {
  const API = process.env.WP_API_URL;
  return !API || API.includes("your-wordpress-site");
}

export async function getList(type: string, params?: Record<string, string>): Promise<WPPost[]> {
  if (isMockMode()) {
    const { MOCK_SCENTS, MOCK_JOURNAL } = await import("./mock");
    const data = type === "journal" ? MOCK_JOURNAL : MOCK_SCENTS;
    const limit = params?.per_page ? parseInt(params.per_page, 10) : data.length;
    return data.slice(0, limit);
  }
  try {
    const qs = new URLSearchParams({ per_page: "100", _embed: "1", ...params }).toString();
    return await wpFetch<WPPost[]>(`/${type}?${qs}`, 1800);
  } catch {
    return [];
  }
}

export async function getBySlug(type: string, slug: string): Promise<WPPost | null> {
  if (isMockMode()) {
    const { MOCK_SCENTS, MOCK_JOURNAL } = await import("./mock");
    const data = type === "journal" ? MOCK_JOURNAL : MOCK_SCENTS;
    return data.find((p) => p.slug === slug) ?? null;
  }
  try {
    const items = await wpFetch<WPPost[]>(
      `/${type}?slug=${encodeURIComponent(slug)}&_embed`,
      1800
    );
    return items?.[0] ?? null;
  } catch {
    return null;
  }
}

export function getFeaturedImageUrl(post: WPPost): string {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "";
}

export function getFeaturedImageAlt(post: WPPost): string {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ?? "";
}
