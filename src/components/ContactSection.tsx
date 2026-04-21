import Link from "next/link";

const WHATSAPP_TEXT = "Hi JojoScents, I'd like a recommendation.";

export default function ContactSection() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254700000000";
  const wa = `https://wa.me/${number}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

  return (
    <section className="pt-14 md:pt-18 pb-8">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div>
          <h2 className="text-2xl md:text-3xl">Contact</h2>
          <p className="mt-3 text-muted leading-relaxed max-w-xl">
            For recommendations, collaborations, or custom scent guidance—reach us through
            WhatsApp or socials.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={wa}
              target="_blank"
              className="rounded-xl2 border border-border bg-card px-4 py-2 text-sm hover:border-fg/30 transition-colors"
            >
              WhatsApp
            </Link>
            <Link
              href="https://instagram.com/"
              target="_blank"
              className="rounded-xl2 border border-border bg-card px-4 py-2 text-sm hover:border-fg/30 transition-colors"
            >
              Instagram
            </Link>
            <Link
              href="https://tiktok.com/"
              target="_blank"
              className="rounded-xl2 border border-border bg-card px-4 py-2 text-sm hover:border-fg/30 transition-colors"
            >
              TikTok
            </Link>
            <Link
              href="mailto:hello@jojoscents.com"
              className="rounded-xl2 border border-border bg-card px-4 py-2 text-sm hover:border-fg/30 transition-colors"
            >
              Email
            </Link>
          </div>
        </div>

        <div className="rounded-xl2 border border-border bg-card p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Hours</p>
          <p className="mt-3 text-sm text-muted leading-relaxed">Mon–Sat • 9am–6pm (EAT)</p>

          <p className="mt-6 text-xs uppercase tracking-[0.22em] text-muted">Location</p>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            Nairobi, Kenya (Online consultations available)
          </p>
        </div>
      </div>
    </section>
  );
}
