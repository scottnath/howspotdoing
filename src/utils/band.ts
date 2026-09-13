export type BandKey = '100' | '80' | '50' | '30' | '0';

const LABELS: Record<BandKey, string> = {
  '100': '100%',
  '80': '80–90%',
  '50': '50%',
  '30': '30–40%',
  '0': '0%',
};

const HEX: Record<BandKey, string> = {
  '100': '#007a00',
  '80': '#2fae2f',
  '50': '#e5c400',
  '30': '#fee03c',
  '0': '#d00000',
};

/** Fixed band order, highest first. */
export const BAND_KEYS: BandKey[] = ['100', '80', '50', '30', '0'];

/** Maps a legality score (0–100) to its band. Scoring itself lives in content.config.ts. */
export const band = (score: number) => {
  const key: BandKey =
    score >= 100
      ? '100'
      : score >= 80
        ? '80'
        : score >= 50
          ? '50'
          : score >= 30
            ? '30'
            : '0';
  return {
    key,
    label: LABELS[key],
    color: `var(--band-${key})`,
    hex: HEX[key],
  };
};

/** Text color that passes on that band fill */
export const onBand = (score: number) =>
  score >= 100 || score < 30 ? '#fff' : '#111';
