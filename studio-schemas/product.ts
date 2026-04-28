import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Products",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      options: { list: ["Women", "Men", "Unisex"] },
    }),
    defineField({
      name: "family",
      title: "Fragrance Family",
      type: "string",
      options: {
        list: [
          "Floral", "Woody", "Fresh", "Citrus", "Amber",
          "Musk", "Vanilla", "Oud", "Aquatic", "Spicy",
          "Powdery", "Gourmand", "Leather", "Green", "Fruity",
        ],
      },
    }),
    defineField({
      name: "mood",
      title: "Mood / Personality",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          "Soft", "Clean", "Romantic", "Elegant", "Bold",
          "Mysterious", "Warm", "Fresh", "Luxury",
          "Daily Wear", "Evening", "Office", "Date Night", "Signature Scent",
        ],
      },
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      placeholder: "e.g. From KSh 3,500",
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      description: "One or two sentences shown on the listing and detail pages.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "notes",
      title: "Fragrance Notes",
      description: "Individual ingredients e.g. Rose, Oud, Sandalwood",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "mainImage",
      title: "Main Product Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "featured",
      title: "Featured / Best Seller",
      description: "Show on the homepage best sellers grid.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", media: "mainImage", subtitle: "price" },
    prepare({ title, media, subtitle }) {
      return { title, media, subtitle };
    },
  },
});
