"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, formatKsh } from "@/store/cart";

const DELIVERY_OPTIONS = [
  { id: "pickup",    label: "Pickup — Nairobi CBD",          price: 0,   eta: "Same day, by appointment" },
  { id: "cbd",       label: "Delivery — Nairobi CBD",        price: 150, eta: "1–4 hours" },
  { id: "suburbs",   label: "Delivery — Nairobi suburbs",    price: 300, eta: "Same or next day" },
  { id: "upcountry", label: "Delivery — Outside Nairobi",   price: 500, eta: "2–3 business days (courier)" },
] as const;

type Step = "delivery" | "payment" | "pending";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, subtotal, clearCart } = useCart();

  const [orderId] = useState(() => `JJS-${Date.now()}`);
  const [step, setStep] = useState<Step>("delivery");
  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: "", delivery: "cbd",
  });
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [checkoutId, setCheckoutId] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0 && step === "delivery") {
      router.replace("/cart");
    }
  }, [mounted, items, step, router]);

  if (!mounted) return <div className="pt-12 md:pt-16 min-h-[60vh]" />;

  const delivery = DELIVERY_OPTIONS.find((o) => o.id === form.delivery)!;
  const sub = subtotal();
  const total = sub + delivery.price;

  function setField(key: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  function submitDelivery(e: React.FormEvent) {
    e.preventDefault();
    setMpesaPhone(form.phone);
    setStep("payment");
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPaying(true);

    // Normalise phone to 254XXXXXXXXX
    const phone = mpesaPhone.replace(/^0/, "254").replace(/[^0-9]/g, "");

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          amount: total,
          orderId,
          items,
          customer: form,
          delivery: { ...delivery, total },
        }),
      });

      const data = await res.json();

      if (!res.ok || data.errorCode) {
        setError(data.errorMessage ?? "Payment request failed. Please try again.");
        setPaying(false);
        return;
      }

      setCheckoutId(data.CheckoutRequestID ?? "");

      // Notify store owner
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          items,
          customer: form,
          delivery,
          total,
          checkoutRequestId: data.CheckoutRequestID,
        }),
      }).catch(() => {}); // non-blocking

      clearCart();
      router.push(`/checkout/confirmation?order=${orderId}&total=${total}`);
    } catch {
      setError("Network error. Please try again.");
      setPaying(false);
    }
  }

  const inputClass =
    "w-full rounded-xl2 border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-[rgb(var(--fg)/0.4)] transition-colors";

  return (
    <section className="pt-12 md:pt-16">
      <Link href="/cart" className="text-xs uppercase tracking-[0.18em] text-muted hover:text-[rgb(var(--accent))] transition-colors">
        ← Cart
      </Link>

      <h1 className="mt-4 text-2xl md:text-3xl">Checkout</h1>

      <div className="mt-8 grid md:grid-cols-[1fr_320px] gap-10 items-start">
        {/* Left: form */}
        <div>
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {(["delivery", "payment"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border text-[10px] flex items-center justify-center transition-colors ${step === s || (s === "delivery" && step === "payment") ? "border-fg bg-fg text-bg" : "border-border text-muted"}`}>
                  {i + 1}
                </div>
                <span className={`text-xs uppercase tracking-[0.18em] ${step === s ? "text-fg" : "text-muted"}`}>
                  {s === "delivery" ? "Delivery" : "Payment"}
                </span>
                {i < 1 && <span className="text-muted">—</span>}
              </div>
            ))}
          </div>

          {/* Step 1: Delivery */}
          {step === "delivery" && (
            <form onSubmit={submitDelivery} className="space-y-4">
              <input type="text" required placeholder="Full name" value={form.name} onChange={setField("name")} className={inputClass} />
              <input type="tel" required placeholder="Phone (e.g. 0712 345 678)" value={form.phone} onChange={setField("phone")} className={inputClass} />
              <input type="email" required placeholder="Email address" value={form.email} onChange={setField("email")} className={inputClass} />

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted mb-3">Delivery option</p>
                <div className="space-y-2">
                  {DELIVERY_OPTIONS.map((opt) => (
                    <label key={opt.id} className={`flex items-start gap-3 rounded-xl2 border p-4 cursor-pointer transition-colors ${form.delivery === opt.id ? "border-[rgb(var(--fg)/0.5)]" : "border-border hover:border-[rgb(var(--fg)/0.2)]"}`}>
                      <input
                        type="radio"
                        name="delivery"
                        value={opt.id}
                        checked={form.delivery === opt.id}
                        onChange={setField("delivery")}
                        className="mt-0.5 accent-[rgb(var(--accent))]"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>{opt.label}</span>
                          <span className="text-muted">{opt.price === 0 ? "Free" : formatKsh(opt.price)}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted">{opt.eta}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {form.delivery !== "pickup" && (
                <textarea
                  required
                  rows={3}
                  placeholder="Delivery address (estate, road, building, landmark)"
                  value={form.address}
                  onChange={setField("address")}
                  className={inputClass + " resize-none"}
                />
              )}

              <button type="submit" className="rounded-xl2 border border-border bg-transparent px-6 py-3 text-sm hover:border-[rgb(var(--fg)/0.3)] transition-colors">
                Continue to payment →
              </button>
            </form>
          )}

          {/* Step 2: M-Pesa Payment */}
          {step === "payment" && (
            <form onSubmit={pay} className="space-y-5">
              <div className="rounded-xl2 border border-border bg-card p-5 text-sm space-y-1">
                <p className="text-xs uppercase tracking-[0.22em] text-muted mb-3">Pay via M-Pesa</p>
                <p className="text-muted">Enter the M-Pesa number to send the payment prompt to.</p>
              </div>

              <input
                type="tel"
                required
                placeholder="M-Pesa number (e.g. 0712 345 678)"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                className={inputClass}
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("delivery")}
                  className="rounded-xl2 border border-border bg-transparent px-5 py-3 text-sm text-muted hover:border-[rgb(var(--fg)/0.3)] transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={paying}
                  className="rounded-xl2 border border-border bg-card px-6 py-3 text-sm hover:border-[rgb(var(--fg)/0.3)] transition-colors disabled:opacity-50"
                >
                  {paying ? "Sending prompt…" : `Pay ${formatKsh(total)} via M-Pesa`}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right: order summary */}
        <div className="rounded-xl2 border border-border bg-card p-6 sticky top-24">
          <p className="text-xs uppercase tracking-[0.22em] text-muted mb-4">Summary</p>
          <div className="space-y-3 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-3">
                <span className="text-muted truncate">{item.name} × {item.quantity}</span>
                <span className="shrink-0">{item.priceAmount > 0 ? formatKsh(item.priceAmount * item.quantity) : "—"}</span>
              </div>
            ))}
            <div className="pt-3 border-t border-border flex justify-between">
              <span className="text-muted">Delivery</span>
              <span>{delivery.price === 0 ? "Free" : formatKsh(delivery.price)}</span>
            </div>
            <div className="pt-3 border-t border-border flex justify-between font-medium">
              <span>Total</span>
              <span>{total > 0 ? formatKsh(total) : "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
