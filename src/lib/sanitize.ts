const ALLOWED_TAGS = /^(p|br|strong|em|b|i|ul|ol|li|h1|h2|h3|h4|h5|h6|blockquote|a|span|div|figure|figcaption|img)$/i;
const DANGEROUS_ATTRS = /\bon\w+\s*=|javascript\s*:/gi;

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(DANGEROUS_ATTRS, "data-blocked=");
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}
