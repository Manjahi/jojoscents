"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConfirmationContent() {
  const params = useSearchParams();
  const order = params.get("order") ?? "—";
  const total = params.get("total");

  return (
    <section className="pt-12 md:pt-16 max-w-2xl">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">Order placed</p>
      <h1 className="mt-4 text-3xl md:text-4xl">Check your phone.</h1>

      <div className="mt-8 rounded-xl2 border border-border bg-card p-6 md:p-8 space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Order reference</p>
          <p className="mt-1 text-lg font-mono">{order}</p>
        </div>

        {total && Number(total) > 0 && (
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Amount</p>
            <p className="mt-1">KSh {Number(total).toLocaleString("en-KE")}</p>
          </div>
        )}

        <div className="pt-5 border-t border-border space-y-3">
          <p className="text-sm text-muted leading-relaxed">
            An M-Pesa payment prompt has been sent to your phone. Enter your PIN to complete the payment.
          </p>
          <p className="text-sm text-muted leading-relaxed">
            A confirmation will be sent to your email once payment is received. If you have any questions, reach us on WhatsApp.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/scents"
          className="rounded-xl2 border border-border bg-card px-5 py-3 text-sm hover:border-fg/30 transition-colors"
        >
          Continue shopping
        </Link>
        <Link
          href="/"
          className="rounded-xl2 border border-border bg-transparent px-5 py-3 text-sm text-muted hover:border-fg/30 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="pt-12 md:pt-16" />}>
      <ConfirmationContent />
    </Suspense>
  );
}
