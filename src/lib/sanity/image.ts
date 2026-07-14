import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const builder = projectId
  ? createImageUrlBuilder({
      projectId,
      dataset,
    })
  : null;

export function urlFor(
  source: SanityImageSource,
  width = 800,
): string {
  if (!builder || !source) return "";

  return builder
    .image(source)
    .width(width)
    .auto("format")
    .url();
}