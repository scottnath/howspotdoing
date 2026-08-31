# AGENTS.md — howspotdoing

Guide for humans and AI agents working in this repository.

## What this repo is

The public website [howspotdoing.com](https://howspotdoing.com): a static Astro
site that renders cannabis legality data for all 50 US states, with a score per
state and a cited government quote per answer.

This repo **renders** the data. It does not own it.

```
hpd-research (data source of truth)          howspotdoing (this repo)
───────────────────────────────────          ────────────────────────
content/locations/hpd-<state>.json  ──sync──▶ src/content/locations/hpd-<state>.json
                                                        │
                                                        ▼
                                              Astro build → GitHub Pages
```

`src/content/locations/*.json` arrives via an automated sync PR from
[`scottnath/hpd-research`](https://github.com/scottnath/hpd-research) whenever its
`main` branch changes location data.

**Do not hand-edit `src/content/locations/*.json` here.** Change it in
`hpd-research` and let the sync PR carry it over, or the next sync will overwrite
your edit. If a fix must land here first (for example while a research branch is in
review), make the identical change in `hpd-research` in the same effort.

## The data being rendered

Each `src/content/locations/hpd-<state>.json` answers the **same eight questions**,
validated by `src/content.config.ts`:

| Key                   | Question                                            | Rendered where                           |
| --------------------- | --------------------------------------------------- | ---------------------------------------- |
| `RECREATIONAL`        | adult possession                                    | location page + comparison table + score |
| `RECREATIONAL_STORE`  | adult purchase in a store                           | location page + comparison table + score |
| `RECREATIONAL_GROW`   | adult home cultivation                              | location page + comparison table + score |
| `RECREATIONAL_PUBLIC` | consumption in parks/sidewalks/outdoor public space | location page only                       |
| `RECREATIONAL_ONSITE` | on-site consumption at public businesses            | location page only                       |
| `MEDICAL`             | patient possession                                  | location page + comparison table + score |
| `MEDICAL_STORE`       | patient purchase in a store                         | location page + comparison table + score |
| `MEDICAL_GROW`        | patient home cultivation                            | location page + comparison table + score |

Definitions live in `hpd-research/docs/questions.md`. Two of the eight are
intentionally informational: `RECREATIONAL_PUBLIC` and `RECREATIONAL_ONSITE` are
shown on the location page but are excluded from the score and from the comparison
table on `/locations`.

Per-question fields: `answer`, `gov_quote` (rendered as the blockquote),
`gov_section` (stored context, not rendered), `url` (the citation link),
`question` (the rendered heading), `validation`, `validation_notes`. Per-location:
`primaryGovUrl` renders as the "Official cannabis information" link.

There is no `summary` field. Do not add one to the schema.

## Legality score

`calculateLegality()` in `src/content.config.ts`:

```
RECREATIONAL yes          → 80   (+10 store, +10 grow)
else MEDICAL yes          → 30   (+10 store, +10 grow)
```

The transform in the collection schema also derives `title`, `answer`, `legality`,
and formats `lastResearch`/`lastUpdate` for display. Changing the formula changes
every page and every social card, so treat it as a product decision.

## Layout

```
src/content.config.ts        collection schema, answer/validation unions, score
src/content/locations/       synced data (do not hand-edit)
src/pages/index.astro        home
src/pages/locations/         index (comparison table) + [...location] detail route
src/pages/about.astro        about
src/pages/social-card.astro  offscreen page Puppeteer screenshots
src/components/Location.astro  one state: score, official link, all eight questions
src/components/Question.astro  one question: heading, answer, quote, citation
src/components/Locations.astro comparison table of the six scoring answers
src/styles/global.css        global styles
utils/generate-social-cards.ts  Puppeteer social card generator
docs/gov-quote-exists.json   latest exact-match quote audit snapshot
```

Location pages are generated twice per state: `/locations/<slug>` and
`/locations/united-states/<slug>`. Slugs are the filename minus the `hpd-` prefix.

## Commands

```bash
npm install
npm run dev          # dev server
npm run build        # site build
npm run build:full   # social cards + build (what CI deploys)
npm test             # node:test runner; no test files exist yet (src/**/*.test.ts)
npm run lint
npm run format
```

`npm run build` is the real check here: the content collection schema in
`src/content.config.ts` validates all 50 location files at build time, so a bad
synced JSON file fails the build rather than a test.

Deployment: `.github/workflows/astro.yml` runs `build:full` on push to `main` and
publishes `dist/` to the `gh-pages` branch.

## Conventions

- TypeScript and ES modules; `.astro` components with scoped `<style>` blocks.
- Prettier config includes `prettier-plugin-astro`; `*.json` is in `.prettierignore`,
  so synced data keeps the formatting `hpd-research` wrote.
- Structured data matters here: location pages use schema.org `FAQPage`/`Question`
  markup. Keep `itemprop`/`itemtype` attributes intact when editing components.
- A quote is a legal citation. Never edit `gov_quote` text for style, and never
  render a quote without its `url`.

## Related documentation

| File                                    | What it covers                                           |
| --------------------------------------- | -------------------------------------------------------- |
| `README.md`                             | Orientation, build, content overview                     |
| `AGENTS.md`                             | This file                                                |
| `docs/research-process.md`              | Pointer to the research/audit process and audit snapshot |
| `hpd-research/AGENTS.md`                | Data rules, CLI, and research pipeline                   |
| `hpd-research/docs/questions.md`        | The eight questions and scoring                          |
| `hpd-research/docs/research-process.md` | Research and audit lifecycle                             |
