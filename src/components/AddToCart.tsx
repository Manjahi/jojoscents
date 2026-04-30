"use client";

import { useState } from "react";
import { useCart, parsePrice } from "@/store/cart";

type Props = {
  id: string;
  name: string;
  priceAmount: number;
  priceDisplay: string;
  image: string;
  slug: string;
};

export default function AddToCart({ id, name, priceAmount, priceDisplay, image, slug }: Props) {
  const addItem = useCart((s) => s.addItem);
  const items = useCart((s) => s.items);
  const [added, setAdded] = useState(false);

  const inCart = items.some((i) => i.id === id);
  const amount = priceAmount || parsePrice(priceDisplay);

  function handle() {
    addItem({ id, name, priceAmount: amount, priceDisplay, image, slug });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handle}
      className="cursor-pointer rounded-xl2 border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-5 py-3 text-sm hover:border-[rgb(var(--fg)/0.3)] transition-colors"
    >
      {added ? "Added ✓" : inCart ? "Add another" : "Add to cart"}
    </button>
  );
}
