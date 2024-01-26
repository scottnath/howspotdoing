declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"locations": {
"united-states/alabama/index.md": {
	id: "united-states/alabama/index.md";
  slug: "united-states/alabama";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/alaska/index.md": {
	id: "united-states/alaska/index.md";
  slug: "united-states/alaska";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/arizona/index.md": {
	id: "united-states/arizona/index.md";
  slug: "united-states/arizona";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/arkansas/index.md": {
	id: "united-states/arkansas/index.md";
  slug: "united-states/arkansas";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/california/index.md": {
	id: "united-states/california/index.md";
  slug: "united-states/california";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/colorado/index.md": {
	id: "united-states/colorado/index.md";
  slug: "united-states/colorado";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/connecticut/index.md": {
	id: "united-states/connecticut/index.md";
  slug: "united-states/connecticut";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/delaware/index.md": {
	id: "united-states/delaware/index.md";
  slug: "united-states/delaware";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/florida/index.md": {
	id: "united-states/florida/index.md";
  slug: "united-states/florida";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/georgia/index.md": {
	id: "united-states/georgia/index.md";
  slug: "united-states/georgia";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/hawaii/index.md": {
	id: "united-states/hawaii/index.md";
  slug: "united-states/hawaii";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/idaho/index.md": {
	id: "united-states/idaho/index.md";
  slug: "united-states/idaho";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/illinois/index.md": {
	id: "united-states/illinois/index.md";
  slug: "united-states/illinois";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/index.md": {
	id: "united-states/index.md";
  slug: "united-states";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/indiana/index.md": {
	id: "united-states/indiana/index.md";
  slug: "united-states/indiana";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/iowa/index.md": {
	id: "united-states/iowa/index.md";
  slug: "united-states/iowa";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/kansas/index.md": {
	id: "united-states/kansas/index.md";
  slug: "united-states/kansas";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/kentucky/index.md": {
	id: "united-states/kentucky/index.md";
  slug: "united-states/kentucky";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/louisiana/index.md": {
	id: "united-states/louisiana/index.md";
  slug: "united-states/louisiana";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/maine/index.md": {
	id: "united-states/maine/index.md";
  slug: "united-states/maine";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/maryland/index.md": {
	id: "united-states/maryland/index.md";
  slug: "united-states/maryland";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/massachusetts/index.md": {
	id: "united-states/massachusetts/index.md";
  slug: "united-states/massachusetts";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/michigan/index.md": {
	id: "united-states/michigan/index.md";
  slug: "united-states/michigan";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/minnesota/index.md": {
	id: "united-states/minnesota/index.md";
  slug: "united-states/minnesota";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/mississippi/index.md": {
	id: "united-states/mississippi/index.md";
  slug: "united-states/mississippi";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/missouri/index.md": {
	id: "united-states/missouri/index.md";
  slug: "united-states/missouri";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/montana/index.md": {
	id: "united-states/montana/index.md";
  slug: "united-states/montana";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/nebraska/index.md": {
	id: "united-states/nebraska/index.md";
  slug: "united-states/nebraska";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/nevada/index.md": {
	id: "united-states/nevada/index.md";
  slug: "united-states/nevada";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/new-hampshire/index.md": {
	id: "united-states/new-hampshire/index.md";
  slug: "united-states/new-hampshire";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/new-jersey/index.md": {
	id: "united-states/new-jersey/index.md";
  slug: "united-states/new-jersey";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/new-mexico/index.md": {
	id: "united-states/new-mexico/index.md";
  slug: "united-states/new-mexico";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/new-york/index.md": {
	id: "united-states/new-york/index.md";
  slug: "united-states/new-york";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/north-carolina/index.md": {
	id: "united-states/north-carolina/index.md";
  slug: "united-states/north-carolina";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/north-dakota/index.md": {
	id: "united-states/north-dakota/index.md";
  slug: "united-states/north-dakota";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/ohio/index.md": {
	id: "united-states/ohio/index.md";
  slug: "united-states/ohio";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/oklahoma/index.md": {
	id: "united-states/oklahoma/index.md";
  slug: "united-states/oklahoma";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/oregon/index.md": {
	id: "united-states/oregon/index.md";
  slug: "united-states/oregon";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/pennsylvania/index.md": {
	id: "united-states/pennsylvania/index.md";
  slug: "united-states/pennsylvania";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/rhode-island/index.md": {
	id: "united-states/rhode-island/index.md";
  slug: "united-states/rhode-island";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/south-carolina/index.md": {
	id: "united-states/south-carolina/index.md";
  slug: "united-states/south-carolina";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/south-dakota/index.md": {
	id: "united-states/south-dakota/index.md";
  slug: "united-states/south-dakota";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/tennessee/index.md": {
	id: "united-states/tennessee/index.md";
  slug: "united-states/tennessee";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/texas/index.md": {
	id: "united-states/texas/index.md";
  slug: "united-states/texas";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/utah/index.md": {
	id: "united-states/utah/index.md";
  slug: "united-states/utah";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/vermont/index.md": {
	id: "united-states/vermont/index.md";
  slug: "united-states/vermont";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/virginia/index.md": {
	id: "united-states/virginia/index.md";
  slug: "united-states/virginia";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/washington/index.md": {
	id: "united-states/washington/index.md";
  slug: "united-states/washington";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/west-virginia/index.md": {
	id: "united-states/west-virginia/index.md";
  slug: "united-states/west-virginia";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/wisconsin/index.md": {
	id: "united-states/wisconsin/index.md";
  slug: "united-states/wisconsin";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
"united-states/wyoming/index.md": {
	id: "united-states/wyoming/index.md";
  slug: "united-states/wyoming";
  body: string;
  collection: "locations";
  data: InferEntrySchema<"locations">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
