import { defineField, defineType } from "sanity";

const STATUS_EMOJI: Record<string, string> = {
  pending: "⏳",
  confirmed: "✅",
  shipped: "📦",
  delivered: "🎉",
  cancelled: "❌",
};

export const order = defineType({
  name: "order",
  title: "Orders",
  type: "document",
  // Orders are created by the API — hide the "Create" button in Studio
  __experimental_actions: ["update", "publish", "delete"],
  fields: [
    defineField({
      name: "reference",
      title: "Order Reference",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "⏳ Pending payment", value: "pending" },
          { title: "✅ Confirmed (paid)", value: "confirmed" },
          { title: "📦 Shipped", value: "shipped" },
          { title: "🎉 Delivered", value: "delivered" },
          { title: "❌ Cancelled", value: "cancelled" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
    }),
    defineField({
      name: "createdAt",
      title: "Order Date",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "customer",
      title: "Customer",
      type: "object",
      fields: [
        defineField({ name: "name",    title: "Name",             type: "string" }),
        defineField({ name: "phone",   title: "Phone",            type: "string" }),
        defineField({ name: "email",   title: "Email",            type: "string" }),
        defineField({ name: "address", title: "Delivery Address", type: "text",   rows: 2 }),
      ],
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name",        title: "Product",       type: "string" }),
            defineField({ name: "slug",        title: "Slug",          type: "string" }),
            defineField({ name: "quantity",    title: "Qty",           type: "number" }),
            defineField({ name: "priceAmount", title: "Unit Price (KSh)", type: "number" }),
          ],
          preview: {
            select: { title: "name", qty: "quantity", price: "priceAmount" },
            prepare({ title, qty, price }) {
              return { title, subtitle: `× ${qty}  —  KSh ${(qty * price).toLocaleString()}` };
            },
          },
        },
      ],
    }),
    defineField({
      name: "delivery",
      title: "Delivery",
      type: "object",
      fields: [
        defineField({ name: "id",    title: "Option",        type: "string" }),
        defineField({ name: "label", title: "Label",         type: "string" }),
        defineField({ name: "price", title: "Fee (KSh)",     type: "number" }),
      ],
    }),
    defineField({ name: "total",            title: "Total (KSh)",                type: "number", readOnly: true }),
    defineField({ name: "mpesaReceipt",     title: "M-Pesa Receipt",             type: "string", readOnly: true }),
    defineField({ name: "checkoutRequestId",title: "M-Pesa Checkout Request ID", type: "string", readOnly: true }),
    defineField({ name: "adminNotes",       title: "Admin Notes",                type: "text",   rows: 3 }),
  ],
  preview: {
    select: {
      ref: "reference",
      status: "status",
      name: "customer.name",
      total: "total",
    },
    prepare({ ref, status, name, total }) {
      const emoji = STATUS_EMOJI[status] ?? "•";
      return {
        title: `${ref ?? "—"}  ${name ? `(${name})` : ""}`,
        subtitle: `${emoji} ${status ?? ""}  •  KSh ${Number(total ?? 0).toLocaleString()}`,
      };
    },
  },
  orderings: [
    {
      title: "Newest first",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
});
