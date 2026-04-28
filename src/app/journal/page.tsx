import Link from "next/link";
import Reveal from "@/components/Reveal";
import MotionGroup from "@/components/MotionGroup";
import { getAllJournal } from "@/lib/sanity/queries";

export const revalidate = 1800;

export default async function JournalPage() {
  const posts = await getAllJournal();

  return (
    <section className="pt-12 md:pt-16">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Journal</p>
        <h1 className="mt-4 text-3xl md:text-5xl">Stories & Guides</h1>
      </Reveal>

      <Reveal delay={0.06}>
        <p className="mt-4 text-muted max-w-2xl">
          Fragrance stories, layering guides, and seasonal edits—written slowly.
        </p>
      </Reveal>

      {posts.length === 0 ? (
        <Reveal delay={0.1}>
          <p className="mt-16 text-muted text-sm">No articles yet. Check back soon.</p>
        </Reveal>
      ) : (
        <MotionGroup>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Reveal key={post._id}>
                <Link
                  href={`/journal/${post.slug}`}
                  className="group block rounded-xl2 border border-border bg-card p-6 hover:border-fg/30 transition-colors"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">
                    {new Date(post.publishedAt).toLocaleDateString("en-KE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h3 className="mt-3 text-lg leading-snug">{post.title}</h3>
                  {post.excerpt && (
                    <p className="mt-3 text-sm text-muted line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted group-hover:text-[rgb(var(--accent))] transition-colors">
                    Read →
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </MotionGroup>
      )}
    </section>
  );
}
