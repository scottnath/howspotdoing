import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { STATES, slugOf } from './states.ts';

describe('STATES', () => {
  const entries = Object.entries(STATES);
  const abbrs = entries.map(([, s]) => s.abbr);
  const fips = entries.map(([, s]) => s.fips);

  it('lists all 50 states with unique USPS abbrs and FIPS codes', () => {
    assert.equal(entries.length, 50);
    assert.equal(new Set(abbrs).size, 50);
    assert.equal(new Set(fips).size, 50);
  });

  it('uses two-letter abbrs and zero-padded two-digit FIPS', () => {
    for (const [name, { abbr, fips: code }] of entries) {
      assert.match(abbr, /^[A-Z]{2}$/, name);
      assert.match(code, /^\d{2}$/, name);
    }
  });

  it('maps a few known names', () => {
    assert.deepEqual(STATES.Alabama, { abbr: 'AL', fips: '01' });
    assert.deepEqual(STATES['New York'], { abbr: 'NY', fips: '36' });
    assert.deepEqual(STATES.Wyoming, { abbr: 'WY', fips: '56' });
  });
});

describe('slugOf', () => {
  it('strips a leading hpd- prefix', () => {
    assert.equal(slugOf('hpd-new-york'), 'new-york');
  });

  it('leaves a slug that is already prefix-free', () => {
    assert.equal(slugOf('new-york'), 'new-york');
  });
});
