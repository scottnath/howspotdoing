# Cannabis legality research process

The source of truth for how this data is researched, quoted, and re-checked lives in the `hpd-research` repo:

- `docs/research-process.md` — full lifecycle
- `src/data/legality/types.ts` — data shape
- `src/data/legality/agents/quote-audit.md` — exact-match audit and correction passes

`docs/gov-quote-exists.json` is the first-pass exact-match audit (`yes` | `no` | `none`) run against the quotes before this schema change. Re-run that audit after quote repairs and persist a new snapshot here.

Site location files are `src/content/locations/hpd-[state].json`. They no longer include `summary`. Each result may include `gov_section` (the surrounding page excerpt). Each location may include `primaryGovUrl` (the official state cannabis homepage).
