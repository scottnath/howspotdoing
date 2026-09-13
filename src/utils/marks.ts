/** Answer value → mark kind. YES is a check, a YYYY-MM-DD date is a "legal from" mark, anything else a cross. */
export type MarkKind = 'yes' | 'no' | 'date';

export const isDate = (v: unknown): v is string =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v);

export const markKind = (v: unknown): MarkKind =>
  v === 'YES' ? 'yes' : isDate(v) ? 'date' : 'no';

/** "MMM D, YYYY" — used by the map pop-up and location meta. */
export const shortDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
};

/** "July 1, 2027" — used in mark labels. */
export const longDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

/** Text for aria-labels: "YES", "NO", or "legal from July 1, 2027". */
export const markText = (v: unknown): string =>
  v === 'YES' ? 'YES' : isDate(v) ? `legal from ${longDate(v)}` : 'NO';
