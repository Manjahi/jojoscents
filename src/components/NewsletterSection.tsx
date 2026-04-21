"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("sent");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="pt-14 md:pt-18">
      <div className="rounded-xl2 border border-border bg-card p-6 md:p-10">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Newsletter</p>
          <h2 className="mt-4 text-2xl md:text-3xl">Receive fragrance advice & new drops.</h2>
          <p className="mt-3 text-muted leading-relaxed">
            Layering tips, signature routines, and curated recommendations—sent quietly.
          </p>

          {status === "sent" ? (
            <p className="mt-6 text-sm text-muted">Subscribed. Welcome.</p>
          ) : (
            <form onSubmit={submit} className="mt-6 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 rounded-xl2 border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-fg/40 transition-colors"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-xl2 border border-border bg-transparent px-5 py-3 text-sm hover:border-fg/30 transition-colors disabled:opacity-50"
              >
                {status === "sending" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm text-muted">Something went wrong. Please try again.</p>
          )}
        </div>
      </div>
    </section>
  );
}
