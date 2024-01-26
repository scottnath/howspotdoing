// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';

// 2. Define a `type` and `schema` for each collection
const locationsCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    image: z.string().optional(),
		id: z.string().optional(),
		location: z.string(),
		parent: z.string().optional(),
		medical: z.union([z.string(), z.date()]),
		medStore: z.union([z.string(), z.date()]),
		medGrow: z.union([z.string(), z.date()]),
		recreational: z.union([z.string(), z.date()]),
		recStore: z.union([z.string(), z.date()]),
		recGrow: z.union([z.string(), z.date()]),
		pubDate: z.date(),
		researchDate: z.date().optional(),
		legality: z.number().optional(),
  }),
});

// 3. Export a single `collections` object to register your collection(s)
export const collections = {
  'locations': locationsCollection,
};
