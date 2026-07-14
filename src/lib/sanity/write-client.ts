import "server-only"
import { createClient } from "next-sanity";

let _client: ReturnType<typeof createClient> | null = null;

export function getSanityWriteClient() {
  if (_client) return _client;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_API_TOKEN;
  if (!projectId || !token) return null;
  _client = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-24",
    token,
    useCdn: false,
  });
  return _client;
}
