import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { getBySlug } from "@/lib/wp";
import { sanitizeHtml } from "@/lib/sanitize";

export const revalidate = 1800;

export default async function JournalArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBySlug("journal", slug);
  if (!post) return notFound();

  return (
    <article className="pt-12 md:pt-16 max-w-3xl">
      <Reveal>
        <Link
          href="/journal"
          className="text-xs uppercase tracking-[0.18em] text-muted hover:text-[rgb(var(--accent))] transition-colors"
        >
          ← Journal
        </Link>
      </Reveal>

      <Reveal delay={0.04}>
        <h1
          className="mt-6 text-3xl md:text-5xl leading-[1.05]"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.title.rendered) }}
        />
      </Reveal>

      <Reveal delay={0.08}>
        <p className="mt-4 text-sm text-muted">
          {new Date(post.date).toLocaleDateString("en-KE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </Reveal>

      <Reveal delay={0.12}>
        <div
          className="prose prose-neutral dark:prose-invert mt-10 max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content?.rendered ?? "") }}
        />
      </Reveal>
    </article>
  );
}
