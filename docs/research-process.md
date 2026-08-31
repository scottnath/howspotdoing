# Cannabis legality research process

This site renders data it does not own. The source of truth for how the data is
researched, quoted, and re-checked lives in the
[`hpd-research`](https://github.com/scottnath/hpd-research) repo:

- `AGENTS.md` — data rules and repo guide
- `docs/questions.md` — the eight questions, their scope, YES criteria, and how they
  feed the legality score
- `docs/research-process.md` — full lifecycle and the ordered audit passes
- `docs/youdotcom-agents.md` — how the You.com research/editor agents are configured
- `src/data/legality/types.ts` — data shape
- `src/data/legality/agents/quote-audit.md` — exact-match audit and correction passes

## Scope of an audit

Every state answers all eight questions, so a full exact-match audit is 400 rows
(8 × 50). `gov-quote-exists.json` in this directory is the latest snapshot, with one
`{state, type, exists}` entry per row:

- `yes` — the stored `gov_quote` appears verbatim on the cited `url`
- `no` — the page loaded (or 404'd) and the quote is not on it
- `none` — no `url` is stored, which is expected for `NO` rows derived from a `NO`
  parent question

Re-run the audit after any quote repair and commit a fresh snapshot here.

## Site-side data notes

Location files are `src/content/locations/hpd-<state>.json`. They do not include
`summary`. Each result may include `gov_section` (the contiguous page excerpt
containing the quote, stored for future audits and not rendered). Each location may
include `primaryGovUrl`, the official state cannabis homepage, rendered above the
questions.
