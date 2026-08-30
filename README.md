# How's Pot Doing

Static Astro site that tracks cannabis legality by US state using official
government sources. Location pages are generated from JSON content files and
include a calculated legality score and shareable social cards.

Contributor guide: [AGENTS.md](AGENTS.md).

## Where the data comes from

```
hpd-research  ──sync PR──▶  howspotdoing  ──Astro build──▶  howspotdoing.com
(data owner)                (this repo)
```

The location JSON in `src/content/locations/` is **generated and owned by
[scottnath/hpd-research](https://github.com/scottnath/hpd-research)**, which
researches each answer, cites an official government page, and audits every quote.
When its `main` branch changes location data, a sync PR opens here.

Do not hand-edit files in `src/content/locations/` — the next sync overwrites them.
Fix the data in `hpd-research` instead. The research process, question definitions,
and quote rules are documented there:

- [Question definitions and scoring](https://github.com/scottnath/hpd-research/blob/main/docs/questions.md)
- [Research and audit process](https://github.com/scottnath/hpd-research/blob/main/docs/research-process.md)

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
- `lastResearch` / `lastUpdate` (ISO timestamps)
- `primaryGovUrl` (optional official state cannabis site)
- `answers` (question key → `YES` / `NO` / future date, used to score legality)
- `results` (one report per question: `answer`, `gov_quote`, `gov_section`, `url`,
  `question`, `validation`, `validation_notes`)

Every state answers the same eight questions:

| Key                   | Question                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `RECREATIONAL`        | Is it legal for adults to possess cannabis?                                                                         |
| `RECREATIONAL_STORE`  | Is it legal for adults to buy cannabis in a store?                                                                  |
| `RECREATIONAL_GROW`   | Is it legal for adults to grow cannabis?                                                                            |
| `RECREATIONAL_PUBLIC` | Is it legal to consume cannabis in parks, on sidewalks, or similar outdoor public spaces?                           |
| `RECREATIONAL_ONSITE` | Is it legal for public businesses such as cafes, bars, or conference centers to allow on-site cannabis consumption? |
| `MEDICAL`             | Is it legal for medical marijuana patients to possess cannabis?                                                     |
| `MEDICAL_STORE`       | Is it legal for medical marijuana patients to buy cannabis in a store?                                              |
| `MEDICAL_GROW`        | Is it legal for medical marijuana patients to grow cannabis?                                                        |

Location pages render all eight. The comparison table on `/locations` shows the six
that affect the score.

Legality scoring:

- 80 points for recreational legal
- 30 points for medical-only legal
- +10 points if store purchases are allowed
- +10 points if home grow is allowed

The two public-consumption questions (`RECREATIONAL_PUBLIC`,
`RECREATIONAL_ONSITE`) are informational and score zero — they describe where you
may consume, not how legal the state is.

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
