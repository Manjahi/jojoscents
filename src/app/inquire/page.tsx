"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import ContactSection from "@/components/ContactSection";

type Status = "idle" | "sending" | "sent" | "error";

export default function InquirePage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl2 border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-fg/40 transition-colors";

  return (
    <>
      <section className="pt-12 md:pt-16 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Get in touch</p>
        <h1 className="mt-4 text-3xl md:text-5xl">Inquire</h1>
        <p className="mt-4 text-muted leading-relaxed">
          For recommendations, collaborations, custom scent guidance, or wholesale
          inquiries—tell us what you need and we&apos;ll respond within one business day.
        </p>

        {status === "sent" ? (
          <div className="mt-10 rounded-xl2 border border-border bg-card p-8">
            <p className="text-sm">Message received. We&apos;ll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 flex flex-col gap-4">
            <input
              type="text"
              required
              placeholder="Your name"
              value={form.name}
              onChange={set("name")}
              className={inputClass}
            />
            <input
              type="email"
              required
              placeholder="Email address"
              value={form.email}
              onChange={set("email")}
              className={inputClass}
            />
            <textarea
              required
              rows={6}
              placeholder="How can we help?"
              value={form.message}
              onChange={set("message")}
              className={inputClass + " resize-none"}
            />

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-xl2 border border-border bg-transparent px-6 py-3 text-sm hover:border-fg/30 transition-colors disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>

              {status === "error" && (
                <p className="text-sm text-muted">Something went wrong. Please try again.</p>
              )}
            </div>
          </form>
        )}
      </section>

      <ContactSection />
    </>
  );
}
