"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { SanityProduct } from "@/lib/sanity/types";
import { urlFor } from "@/lib/sanity/image";

const AUDIENCES = ["Women", "Men", "Unisex"] as const;
const FAMILIES = ["Floral","Woody","Fresh","Citrus","Amber","Musk","Vanilla","Oud","Aquatic","Spicy","Powdery","Gourmand","Leather","Green","Fruity"] as const;
const SEASONS = ["Day","Night","Summer","Winter","All Season","Special Occasion","Layering","Gift"] as const;

const AUDIENCE_COLORS: Record<string, string> = {
  Women: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  Men: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Unisex: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
};

function productImage(p: SanityProduct): string {
  if (p._mockImageUrl) return p._mockImageUrl;
  if (p.mainImage) return urlFor(p.mainImage as Parameters<typeof urlFor>[0]);
  return "/images/products/placeholder.webp";
}

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "cursor-pointer shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors",
        active
          ? "border-[rgb(var(--fg)/0.6)] bg-[rgb(var(--fg))] text-[rgb(var(--bg))]"
          : "border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:border-[rgb(var(--fg)/0.3)] hover:text-[rgb(var(--fg))]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.22em] text-[rgb(var(--muted))] mb-2">
      {children}
    </p>
  );
}

export default function ScentsClient({ products }: { products: SanityProduct[] }) {
  const [search, setSearch] = useState("");
  const [audience, setAudience] = useState("");
  const [family, setFamily] = useState("");
  const [season, setSeason] = useState("");
  const [showSeason, setShowSeason] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.shortDescription?.toLowerCase().includes(q)) return false;
      if (audience && p.audience !== audience) return false;
      if (family && p.family !== family) return false;
      if (season && !p.season?.includes(season)) return false;
      return true;
    });
  }, [products, search, audience, family, season]);

  const hasFilters = !!(audience || family || season || search);

  function clearAll() {
    setSearch("");
    setAudience("");
    setFamily("");
    setSeason("");
  }

  return (
    <>
      {/* Search */}
      <div className="mt-8 relative">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search scents…"
          className="w-full rounded-xl2 border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-3 text-sm outline-none focus:border-[rgb(var(--fg)/0.4)] transition-colors pr-10"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] transition-colors text-lg cursor-pointer"
          >
            ×
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mt-6 space-y-5">
        {/* Who */}
        <div>
          <FilterLabel>Who</FilterLabel>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <Pill label="All" active={!audience} onClick={() => setAudience("")} />
            {AUDIENCES.map((a) => (
              <Pill key={a} label={a} active={audience === a} onClick={() => setAudience(audience === a ? "" : a)} />
            ))}
          </div>
        </div>

        {/* Fragrance Family */}
        <div>
          <FilterLabel>Fragrance Family</FilterLabel>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <Pill label="All" active={!family} onClick={() => setFamily("")} />
            {FAMILIES.map((f) => (
              <Pill key={f} label={f} active={family === f} onClick={() => setFamily(family === f ? "" : f)} />
            ))}
          </div>
        </div>

        {/* Season & Use */}
        <div>
          <button
            onClick={() => setShowSeason((v) => !v)}
            className="cursor-pointer flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] transition-colors mb-2"
          >
            <span>Season &amp; Use</span>
            <span className="text-[8px]">{showSeason ? "▲" : "▼"}</span>
          </button>
          {showSeason && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <Pill label="All" active={!season} onClick={() => setSeason("")} />
              {SEASONS.map((s) => (
                <Pill key={s} label={s} active={season === s} onClick={() => setSeason(season === s ? "" : s)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results bar */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs text-[rgb(var(--muted))]">
          {filtered.length} {filtered.length === 1 ? "scent" : "scents"}
          {hasFilters ? " match" : ""}
        </p>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="cursor-pointer text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))] transition-colors"
          >
            Clear filters ×
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-[rgb(var(--muted))]">No scents match your filters.</p>
          <button
            onClick={clearAll}
            className="cursor-pointer mt-3 text-sm text-[rgb(var(--muted))] underline hover:text-[rgb(var(--fg))] transition-colors"
          >
            Clear and show all
          </button>
        </div>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <Link
              key={p._id}
              href={`/scents/${p.slug}`}
              className="group block rounded-xl2 border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden hover:border-[rgb(var(--fg)/0.3)] transition-colors"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={productImage(p)}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 100vw,(max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.audience && (
                    <span className={`text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full ${AUDIENCE_COLORS[p.audience] ?? ""}`}>
                      {p.audience}
                    </span>
                  )}
                  {p.family && (
                    <span className="text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full border border-[rgb(var(--border))] text-[rgb(var(--muted))]">
                      {p.family}
                    </span>
                  )}
                  {p.season?.slice(0, 1).map((s) => (
                    <span key={s} className="text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full border border-[rgb(var(--border))] text-[rgb(var(--muted))]">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base leading-snug">{p.name}</h3>
                  {p.price && <span className="text-sm text-[rgb(var(--muted))] shrink-0">{p.price}</span>}
                </div>
                {p.shortDescription && (
                  <p className="mt-2 text-sm text-[rgb(var(--muted))] leading-relaxed line-clamp-2">{p.shortDescription}</p>
                )}
                {p.mood && p.mood.length > 0 && (
                  <p className="mt-2 text-[11px] text-[rgb(var(--muted))]">{p.mood.slice(0, 3).join(" · ")}</p>
                )}
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[rgb(var(--muted))] group-hover:text-[rgb(var(--accent))] transition-colors">
                  View details →
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
