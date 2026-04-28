import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export function urlFor(source: SanityImageSource, width = 800): string {
  if (!projectId || !source) return "";
  return imageUrlBuilder({ projectId, dataset })
    .image(source)
    .width(width)
    .auto("format")
    .url();
}
