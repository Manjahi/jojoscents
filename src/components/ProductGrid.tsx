import Image from "next/image";
import Link from "next/link";

export type Product = {
  id: string;
  name: string;
  price: string;
  details: string;
  image: string;
  href?: string;
};

export default function ProductGrid({
  title,
  subtitle,
  products,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
}) {
  return (
    <section className="pt-14 md:pt-18">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
        </div>

        <Link
          href="/scents"
          className="text-sm text-muted hover:text-[rgb(var(--accent))] transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={p.href ?? "/scents"}
            className="group rounded-xl2 border border-border bg-card overflow-hidden hover:border-fg/25 transition-colors"
          >
            <div className="relative h-64">
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base">{p.name}</h3>
                <span className="text-sm text-muted">{p.price}</span>
              </div>
              <p className="mt-2 text-sm text-muted leading-relaxed">{p.details}</p>

              <div className="mt-4 text-sm text-muted group-hover:text-[rgb(var(--accent))] transition-colors">
                View details →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
