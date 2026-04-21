import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-10 flex flex-col md:flex-row gap-8 md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-fg">JojoScents</p>
          <p className="mt-2 text-sm text-muted">Crafted quietly. Worn loudly.</p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-muted">
          <Link href="/scents" className="hover:text-[rgb(var(--accent))] transition-colors">
            Scents
          </Link>
          <Link href="/journal" className="hover:text-[rgb(var(--accent))] transition-colors">
            Journal
          </Link>
          <Link href="/about" className="hover:text-[rgb(var(--accent))] transition-colors">
            About
          </Link>
          <Link href="/inquire" className="hover:text-[rgb(var(--accent))] transition-colors">
            Inquire
          </Link>
        </div>

        <p className="text-sm text-muted">© {new Date().getFullYear()} JojoScents</p>
      </div>
    </footer>
  );
}
