"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CartIcon from "@/components/CartIcon";

const nav = [
  { href: "/scents", label: "Scents" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/inquire", label: "Inquire" },
];

function NavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "relative text-sm transition-colors",
        active ? "text-fg" : "text-muted",
        "hover:text-[rgb(var(--accent))]",
      ].join(" ")}
    >
      {label}
      <span
        className={[
          "absolute left-0 -bottom-1 h-px w-full transition-opacity",
          active ? "opacity-100 bg-fg/60" : "opacity-0 bg-fg/40",
        ].join(" ")}
      />
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
        <Link href="/" className="tracking-[0.18em] text-xs uppercase text-fg">
          JojoScents
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.map((i) => (
            <NavLink key={i.href} href={i.href} label={i.label} />
          ))}
          <CartIcon />
        </nav>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-4">
          <CartIcon />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl2 border border-border bg-card px-3 py-2 text-xs uppercase tracking-[0.18em] text-fg hover:border-fg/30 transition-colors"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-t border-border bg-bg/90 backdrop-blur">
          <div className="mx-auto max-w-6xl px-5 py-4 flex flex-col gap-4">
            {nav.map((i) => (
              <NavLink
                key={i.href}
                href={i.href}
                label={i.label}
                onClick={() => setOpen(false)}
              />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
