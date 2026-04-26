# How's Pot Doing

Static Astro site that tracks cannabis legality by US state using official
government sources. Location pages are generated from JSON content files and
include a calculated legality score and shareable social cards.

## Quick start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Full build including social card generation:

```bash
npm run build:full
```

## Social cards

Social card images are generated via Puppeteer from the `/social-card` page.
Images are written to `public/social-cards`.

```bash
# start a dev server automatically
npm run social-cards -- --with-server

# or run with an already running dev server
npm run dev
npm run social-cards
```

The generator uses port `4399` to avoid collisions with other dev servers.

## Content data

Location data lives in `src/content/locations/hpd-*.json` and is validated via
`src/content.config.ts`. Each file includes:

- `location` (string)
- `lastResearch` (string)
- `lastUpdate` (string)
- `answers` (access signals used to score legality)
- `results` (per-question summaries and citations)

Legality scoring:

- 80 points for recreational legal
- 30 points for medical-only legal
- +10 points if store purchases are allowed
- +10 points if home grow is allowed

## Tests

```bash
npm test
npm run test:coverage
```

## Lint and format

```bash
npm run lint
npm run format
```
