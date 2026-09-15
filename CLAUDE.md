# Paste into the repo's CLAUDE.md

## 2026 redesign

The site is being rebuilt to the specs in `handoff/` (start with `handoff/README.md`). While that work is in progress:

- Follow the specs literally; they list keep/replace/delete per component and per page. Ask before deviating.
- Styling: design tokens live in `src/styles/global.css` as CSS custom properties (`--fg`, `--bg`, `--band-100` …). Components use scoped `<style>` and reference tokens; never hard-code a hex that has a token.
- Dark mode is `prefers-color-scheme: dark` only. Every visual change must be checked in both schemes. Band colors do not change with the scheme.
- Type: `Figtree` for everything except the site title, which is `Scripto` (self-hosted, `public/Scripto-2OR2v.ttf`). Remove TikTok Sans.
- Score bands: 100 → `--band-100`, 80–99 → `--band-80`, 50–79 → `--band-50`, 30–49 → `--band-30`, 0–29 → `--band-0`. One helper (`src/utils/band.ts`) returns the band; nothing else re-implements the thresholds.
- Marks (✓ / ✕ / `'27`) are one component, `Mark.astro`, used by the map pop-up, locations table, and location page.
- Interactive behavior is part of the acceptance criteria: run `handoff/specs/07-acceptance.md` before declaring a page done.
- Do not edit `src/content/locations/*.json`; the research CLI owns them. The collection transform in `src/content.config.ts` may be extended.
- URLs are fixed: `/`, `/about/`, `/locations/`, `/locations/{slug}/` (+ `/locations/united-states/{slug}/` alias), `/social-cards/{slug}.png`.
