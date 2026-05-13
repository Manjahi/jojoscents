import { NextResponse } from "next/server";
import { getSanityWriteClient } from "@/lib/sanity/write-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const callback = body?.Body?.stkCallback;

    if (!callback) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const { ResultCode, CallbackMetadata } = callback;
    const paid = ResultCode === 0;

    // Extract M-Pesa metadata
    const meta: Record<string, string | number> = {};
    CallbackMetadata?.Item?.forEach((item: { Name: string; Value?: string | number }) => {
      if (item.Value !== undefined) meta[item.Name] = item.Value;
    });

    const orderId   = String(meta.AccountReference ?? "");
    const mpesaRef  = String(meta.MpesaReceiptNumber ?? "");
    const amount    = Number(meta.Amount ?? 0);
    const phone     = String(meta.PhoneNumber ?? "");

    console.log(`[mpesa/callback] Order: ${orderId} | Paid: ${paid} | Ref: ${mpesaRef} | Amount: ${amount}`);

    if (paid) {
      // ── 1. Update Sanity order: confirmed + receipt ─────────────────────────
      const sanity = getSanityWriteClient();
      if (sanity && orderId) {
        const doc = await sanity
          .fetch<{ _id: string } | null>(
            `*[_type == "order" && reference == $ref][0]{_id}`,
            { ref: orderId }
          )
          .catch(() => null);

        if (doc?._id) {
          await sanity
            .patch(doc._id)
            .set({ status: "confirmed", mpesaReceipt: mpesaRef })
            .commit()
            .catch((err) => console.error("[mpesa/callback] Sanity patch failed:", err));
        }
      }

      // ── 2. Payment confirmation email to store owner ─────────────────────────
      const apiKey = process.env.BREVO_API_KEY;
      const contactEmail = process.env.CONTACT_EMAIL ?? "hello@jojoscents.com";

      if (apiKey) {
        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: { "api-key": apiKey, "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: { name: "JojoScents Payments", email: contactEmail },
            to: [{ email: contactEmail }],
            subject: `✓ Payment confirmed — ${orderId}`,
            htmlContent: `
              <p><strong>Order:</strong> ${orderId}</p>
              <p><strong>M-Pesa Ref:</strong> ${mpesaRef}</p>
              <p><strong>Amount:</strong> KSh ${amount.toLocaleString()}</p>
              <p><strong>Phone:</strong> ${phone}</p>
            `,
          }),
        }).catch(console.error);
      }
    }

    // Safaricom requires ResultCode 0 even for failed payments — just acknowledge
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    console.error("[mpesa/callback]", err);
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
