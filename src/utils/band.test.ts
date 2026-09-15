import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BAND_KEYS, band, onBand } from './band.ts';

describe('BAND_KEYS', () => {
  it('lists bands highest first', () => {
    assert.deepEqual(BAND_KEYS, ['100', '80', '50', '30', '0']);
  });
});

describe('band', () => {
  it('uses the inclusive lower bound of each range', () => {
    assert.equal(band(100).key, '100');
    assert.equal(band(80).key, '80');
    assert.equal(band(50).key, '50');
    assert.equal(band(30).key, '30');
    assert.equal(band(0).key, '0');
  });

  it('keeps scores just below a bound in the lower band', () => {
    assert.equal(band(99).key, '80');
    assert.equal(band(79).key, '50');
    assert.equal(band(49).key, '30');
    assert.equal(band(29).key, '0');
  });

  it('returns the token, label, and hex for that band', () => {
    assert.deepEqual(band(100), {
      key: '100',
      label: '100%',
      color: 'var(--band-100)',
      hex: '#007a00',
    });
    assert.deepEqual(band(85), {
      key: '80',
      label: '80–90%',
      color: 'var(--band-80)',
      hex: '#2fae2f',
    });
    assert.deepEqual(band(50), {
      key: '50',
      label: '50%',
      color: 'var(--band-50)',
      hex: '#e5c400',
    });
    assert.deepEqual(band(40), {
      key: '30',
      label: '30–40%',
      color: 'var(--band-30)',
      hex: '#fee03c',
    });
    assert.deepEqual(band(0), {
      key: '0',
      label: '0%',
      color: 'var(--band-0)',
      hex: '#d00000',
    });
  });
});

describe('onBand', () => {
  it('is white on the dark 100 and 0 fills', () => {
    assert.equal(onBand(100), '#fff');
    assert.equal(onBand(29), '#fff');
    assert.equal(onBand(0), '#fff');
  });

  it('is dark on the yellow and mid-green fills', () => {
    assert.equal(onBand(99), '#111');
    assert.equal(onBand(80), '#111');
    assert.equal(onBand(50), '#111');
    assert.equal(onBand(30), '#111');
  });
});
