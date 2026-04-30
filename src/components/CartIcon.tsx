"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";

export default function CartIcon() {
  const [mounted, setMounted] = useState(false);
  const count = useCart((s) => s.count());

  useEffect(() => setMounted(true), []);

  return (
    <Link
      href="/cart"
      className="relative text-sm text-muted hover:text-[rgb(var(--accent))] transition-colors"
    >
      Cart
      {mounted && count > 0 && (
        <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[rgb(var(--accent))] text-[10px] text-white font-medium">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
