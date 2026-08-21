"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { urlFor } from "@/lib/sanity/image";
import type { HeroSlide } from "@/lib/sanity/queries";

const LOCAL_FALLBACKS = [
  "/images/hero/hero-1.webp",
  "/images/hero/hero-2.jpg",
  "/images/hero/hero-3.webp",
  "/images/hero/hero-4.jpg",
  "/images/hero/hero-5.webp",
  "/images/hero/hero-6.webp",
  "/images/hero/hero-7.jpg",
];

type ResolvedSlide = { src: string; alt: string };

export default function HeroImageCarousel({ slides }: { slides: HeroSlide[] }) {
  const reduce = useReducedMotion();

  const resolved: ResolvedSlide[] = useMemo(
    () =>
      slides.map((s, idx) => ({
        src: s.image
          ? urlFor(s.image as Parameters<typeof urlFor>[0], 1600)
          : LOCAL_FALLBACKS[idx % LOCAL_FALLBACKS.length],
        alt: s.alt,
      })),
    [slides]
  );

  const [index, setIndex] = useState(0);

  // Autoplay (pause-friendly for reduced motion)
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % resolved.length), 6500);
    return () => clearInterval(id);
  }, [resolved.length, reduce]);

  const slide = resolved[index];

  return (
    // FULL-BLEED + Beysix-like framing
    <section className="w-screen border-y border-border/60">
      <div className="relative overflow-hidden">
        {/* Image layer */}
        <div className="relative h-105 sm:h-115 md:h-140 lg:h-155">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.01 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.01 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Overlay gradient for luxury readability (stronger, Beysix vibe) */}
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />

          {/* Text overlay (better mobile placement) */}
          <div className="absolute inset-0 flex items-end md:items-center">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-10 pb-7 sm:pb-10 md:pb-0">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.22em] text-white/75">
                  Fragrance House
                </p>

                <h1 className="mt-4 text-[2.2rem] sm:text-4xl md:text-6xl leading-[1.02] text-white">
                  Scent as identity—worn, not sprayed.
                </h1>

                <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-white/80 max-w-xl">
                  A calm ritual of skin, memory, and mood. Minimal
                  compositions—maximum presence.
                </p>

                <div className="mt-6 sm:mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/scents"
                    className="w-full sm:w-auto rounded-xl2 border border-white/25 bg-white/10 px-5 py-3 text-sm text-white hover:bg-white/15 transition-colors"
                  >
                    Discover scents
                  </Link>
                  <Link
                    href="/journal"
                    className="w-full sm:w-auto rounded-xl2 border border-white/25 bg-transparent px-5 py-3 text-sm text-white/90 hover:text-white transition-colors"
                  >
                    Fragrance tips
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Dots (bottom-right, Beysix-like) */}
          <div className="absolute bottom-5 right-6 md:right-10 flex gap-2">
            {resolved.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-10 bg-white"
                    : "w-4 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          {/* Edge arrows (far left/right, Beysix-like) */}
          <button
            type="button"
            aria-label="Previous"
            onClick={() => setIndex((i) => (i - 1 + resolved.length) % resolved.length)}
            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 hover:bg-black/45 backdrop-blur border border-white/10 text-white transition-colors"
          >
            ‹
          </button>

          <button
            type="button"
            aria-label="Next"
            onClick={() => setIndex((i) => (i + 1) % resolved.length)}
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 hover:bg-black/45 backdrop-blur border border-white/10 text-white transition-colors"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
