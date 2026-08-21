import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Singleton — editors can edit and publish, but never create a second one or delete
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "heroSlides",
      title: "Hero Carousel Slides",
      description: "Images shown in the homepage hero. Drag to reorder. Recommended: 5–8 images, landscape ratio.",
      type: "array",
      of: [
        {
          type: "object",
          preview: {
            select: { title: "alt", media: "image" },
            prepare({ title, media }) {
              return { title: title || "Untitled slide", media };
            },
          },
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Describes the image for screen readers and SEO.",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).max(12),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
