// Type imports
import type { ManifestOptions } from "vite-plugin-pwa"

/**
 * Defines the default SEO configuration for the website.
 */
export const seoConfig = {
	baseURL: "https://howspotdoing.com", // Change this to your production URL.
	description:
		"How's Pot Doing? Check your location to see whether cannbis is legal where you are!", // Change this to be your website's description.
	type: "website",
	image: {
		url: "/hows-pot-doing.png", // Change this to your website's thumbnail.
		alt: "How's Pot Doing logo", // Change this to your website's thumbnail description.
		width: 500,
		height: 500
	},
	siteName: "How's Pot Doing?", // Change this to your website's name,
	twitter: {
		card: "Twitter is a hellhole.",
	}
}

/**
 * Defines the configuration for PWA webmanifest.
 */
export const manifest: Partial<ManifestOptions> = {
	name: "How's Pot Doing?", // Change this to your website's name.
	short_name: "How's Pot Doing?", // Change this to your website's short name.
	description: "How's Pot Doing? Check your location to see whether cannbis is legal where you are!",
	theme_color: "#30E130", // Change this to your primary color.
	background_color: "#ffffff", // Change this to your background color.
	display: "minimal-ui",
	icons: [
		{
			src: "/favicons/favicon-192x192.png",
			sizes: "192x192",
			type: "image/png"
		},
		{
			src: "/favicons/favicon-512x512.png",
			sizes: "512x512",
			type: "image/png"
		},
		{
			src: "/favicons/favicon-512x512.png",
			sizes: "512x512",
			type: "image/png",
			purpose: "any maskable"
		}
	]
}
