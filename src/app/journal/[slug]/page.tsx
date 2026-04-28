import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { getJournalBySlug } from "@/lib/sanity/queries";

export const revalidate = 1800;

export default async function JournalArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getJournalBySlug(slug);
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
        <h1 className="mt-6 text-3xl md:text-5xl leading-[1.05]">{post.title}</h1>
      </Reveal>

      <Reveal delay={0.08}>
        <p className="mt-4 text-sm text-muted">
          {new Date(post.publishedAt).toLocaleDateString("en-KE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </Reveal>

      {post.excerpt && (
        <Reveal delay={0.1}>
          <p className="mt-6 text-muted leading-relaxed text-lg border-l-2 border-border pl-5">
            {post.excerpt}
          </p>
        </Reveal>
      )}

      {post.content && post.content.length > 0 && (
        <Reveal delay={0.14}>
          <div className="mt-10 space-y-5">
            {post.content.map((para, i) => (
              <p key={i} className="text-muted leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </Reveal>
      )}
    </article>
  );
}
