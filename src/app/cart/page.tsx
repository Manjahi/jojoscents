"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, formatKsh } from "@/store/cart";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="pt-12 md:pt-16 min-h-[60vh]" />;

  if (items.length === 0) {
    return (
      <section className="pt-12 md:pt-16 min-h-[60vh] flex flex-col items-start">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Cart</p>
        <h1 className="mt-4 text-3xl md:text-4xl">Your cart is empty.</h1>
        <p className="mt-4 text-muted">Browse the collection and find your signature scent.</p>
        <Link
          href="/scents"
          className="mt-8 rounded-xl2 border border-border bg-card px-5 py-3 text-sm hover:border-[rgb(var(--fg)/0.3)] transition-colors"
        >
          Browse scents →
        </Link>
      </section>
    );
  }

  const sub = subtotal();

  return (
    <section className="pt-12 md:pt-16">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">Cart</p>
      <h1 className="mt-4 text-2xl md:text-3xl">
        {items.length} {items.length === 1 ? "item" : "items"}
      </h1>

      <div className="mt-8 grid md:grid-cols-[1fr_340px] gap-10 items-start">
        {/* Items */}
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div key={item.id} className="py-6 flex gap-5 items-start">
              <div className="relative w-20 h-20 shrink-0 rounded-xl2 overflow-hidden border border-border">
                <Image
                  src={item.image || "/images/products/placeholder.webp"}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/scents/${item.slug}`}
                      className="text-base hover:text-[rgb(var(--accent))] transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-muted">{item.priceDisplay}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted hover:text-fg transition-colors text-lg shrink-0"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-xl2 border border-border text-sm hover:border-[rgb(var(--fg)/0.3)] transition-colors"
                  >
                    −
                  </button>
                  <span className="text-sm w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-xl2 border border-border text-sm hover:border-[rgb(var(--fg)/0.3)] transition-colors"
                  >
                    +
                  </button>
                  {item.priceAmount > 0 && (
                    <span className="ml-2 text-sm text-muted">
                      = {formatKsh(item.priceAmount * item.quantity)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-xl2 border border-border bg-card p-6 md:p-8 sticky top-24">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Order summary</p>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{sub > 0 ? formatKsh(sub) : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Delivery</span>
              <span className="text-muted">Calculated at checkout</span>
            </div>
          </div>

          {sub > 0 && (
            <div className="mt-5 pt-5 border-t border-border flex justify-between text-base">
              <span>Subtotal</span>
              <span>{formatKsh(sub)}</span>
            </div>
          )}

          <Link
            href="/checkout"
            className="mt-6 block w-full text-center rounded-xl2 border border-border bg-transparent px-5 py-3 text-sm hover:border-[rgb(var(--fg)/0.3)] transition-colors"
          >
            Proceed to checkout →
          </Link>

          <Link
            href="/scents"
            className="mt-3 block text-center text-xs text-muted hover:text-fg transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
