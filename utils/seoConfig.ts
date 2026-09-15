/**
 * Defines the default SEO configuration for the website.
 */
export const seoConfig = {
  baseURL: 'https://howspotdoing.com', // Change this to your production URL.
  description:
    "Official sources, clear score: How's Pot Doing rates cannabis legality by state (0-100) using .gov websites about recreation and medical cannabis access.", // Change this to be your website's description.
  type: 'website',
  image: {
    url: '/social-cards/site.png',
    alt: "Is pot legal where you are? — How's Pot Doing",
    width: 1200,
    height: 630,
  },
  siteName: "How's Pot Doing?",
  siteNickname: "How's Pot Doing.com",
  twitter: {
    card: 'summary_large_image' as const,
  },
};
