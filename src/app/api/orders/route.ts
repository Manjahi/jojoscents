import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { orderId, items, customer, delivery, total } = await req.json();

  const apiKey = process.env.BREVO_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL ?? "hello@jojoscents.com";

  if (!apiKey) {
    return NextResponse.json({ ok: true }); // silent — email not configured
  }

  const itemLines = items
    .map((i: { name: string; quantity: number; priceAmount: number }) =>
      `<li>${i.name} × ${i.quantity} — KSh ${(i.priceAmount * i.quantity).toLocaleString()}</li>`
    )
    .join("");

  const ownerEmail = fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: { name: "JojoScents Orders", email: contactEmail },
      to: [{ email: contactEmail }],
      subject: `New order ${orderId} — KSh ${Number(total).toLocaleString()}`,
      htmlContent: `
        <h2>New Order: ${orderId}</h2>
        <p><strong>Customer:</strong> ${customer.name}<br>
        <strong>Phone:</strong> ${customer.phone}<br>
        <strong>Email:</strong> ${customer.email}</p>
        <p><strong>Delivery:</strong> ${delivery.label}<br>
        <strong>Address:</strong> ${customer.address || "Pickup"}</p>
        <ul>${itemLines}</ul>
        <p><strong>Total:</strong> KSh ${Number(total).toLocaleString()}</p>
        <p><em>M-Pesa payment prompt sent. Awaiting PIN confirmation.</em></p>
      `,
    }),
  });

  const customerEmail = customer.email
    ? fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: { name: "JojoScents", email: contactEmail },
          to: [{ email: customer.email, name: customer.name }],
          subject: `Your JojoScents order ${orderId}`,
          htmlContent: `
            <p>Hi ${customer.name},</p>
            <p>Thank you for your order! Here's a summary:</p>
            <ul>${itemLines}</ul>
            <p><strong>Delivery:</strong> ${delivery.label}</p>
            <p><strong>Total:</strong> KSh ${Number(total).toLocaleString()}</p>
            <p>Please complete payment via the M-Pesa prompt on your phone.<br>
            Your order reference is <strong>${orderId}</strong>.</p>
            <p>Questions? WhatsApp us at +${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254700000000"}.</p>
          `,
        }),
      })
    : Promise.resolve();

  await Promise.all([ownerEmail, customerEmail]).catch(console.error);

  return NextResponse.json({ ok: true });
}
