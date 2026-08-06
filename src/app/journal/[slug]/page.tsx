import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Reveal from "@/components/Reveal";
import { getJournalBySlug } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

export const revalidate = 300;

export default async function JournalArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getJournalBySlug(slug);
  if (!post) return notFound();

  const coverUrl = post.mainImage
    ? urlFor(post.mainImage as Parameters<typeof urlFor>[0], 1200)
    : null;

  return (
    <article className="pt-12 md:pt-16 max-w-3xl">
      <Reveal>
        <Link
          href="/journal"
          className="text-xs uppercase tracking-[0.18em] text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))] transition-colors"
        >
          ← Journal
        </Link>
      </Reveal>

      {post.category && (
        <Reveal delay={0.02}>
          <p className="mt-6 text-xs uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
            {post.category}
          </p>
        </Reveal>
      )}

      <Reveal delay={0.04}>
        <h1 className="mt-3 text-3xl md:text-5xl leading-[1.05]">{post.title}</h1>
      </Reveal>

      <Reveal delay={0.08}>
        <p className="mt-4 text-sm text-[rgb(var(--muted))]">
          {new Date(post.publishedAt).toLocaleDateString("en-KE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </Reveal>

      {coverUrl && (
        <Reveal delay={0.1}>
          <div className="mt-8 relative aspect-[16/7] rounded-xl2 overflow-hidden border border-[rgb(var(--border))]">
            <Image
              src={coverUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        </Reveal>
      )}

      {post.excerpt && (
        <Reveal delay={0.12}>
          <p className="mt-8 text-[rgb(var(--muted))] leading-relaxed text-lg border-l-2 border-[rgb(var(--border))] pl-5">
            {post.excerpt}
          </p>
        </Reveal>
      )}

      {post.content && post.content.length > 0 && (
        <Reveal delay={0.14}>
          <div className="mt-10 prose-journal">
            <PortableText
              value={post.content as Parameters<typeof PortableText>[0]["value"]}
              components={{
                block: {
                  normal: ({ children }) => (
                    <p className="text-[rgb(var(--muted))] leading-relaxed mb-5">{children}</p>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl mt-10 mb-4">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl mt-8 mb-3">{children}</h3>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-[rgb(var(--border))] pl-5 my-6 text-[rgb(var(--muted))] italic">
                      {children}
                    </blockquote>
                  ),
                },
                marks: {
                  strong: ({ children }) => <strong className="text-[rgb(var(--fg))]">{children}</strong>,
                  em: ({ children }) => <em>{children}</em>,
                  link: ({ value, children }) => (
                    <a
                      href={value?.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[rgb(var(--accent))] transition-colors"
                    >
                      {children}
                    </a>
                  ),
                },
                types: {
                  image: ({ value }) => {
                    const src = value ? urlFor(value, 900) : null;
                    if (!src) return null;
                    return (
                      <figure className="my-8">
                        <div className="relative aspect-[16/9] rounded-xl2 overflow-hidden border border-[rgb(var(--border))]">
                          <Image
                            src={src}
                            alt={value?.caption ?? ""}
                            fill
                            sizes="(max-width: 768px) 100vw, 768px"
                            className="object-cover"
                          />
                        </div>
                        {value?.caption && (
                          <figcaption className="mt-2 text-xs text-center text-[rgb(var(--muted))]">
                            {value.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  },
                },
              }}
            />
          </div>
        </Reveal>
      )}
    </article>
  );
}
