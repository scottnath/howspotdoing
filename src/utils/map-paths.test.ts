import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { STATES } from './states.ts';
import { MAP_H, MAP_W, statePaths } from './map-paths.ts';

describe('MAP viewBox', () => {
  it('matches the Albers USA frame used by the SVG', () => {
    assert.equal(MAP_W, 975);
    assert.equal(MAP_H, 610);
  });
});

describe('statePaths', () => {
  const paths = statePaths();

  it('returns the same cached map on later calls', () => {
    assert.equal(statePaths(), paths);
  });

  it('has an outline for every state in STATES', () => {
    for (const [name, { fips }] of Object.entries(STATES)) {
      const p = paths.get(fips);
      assert.ok(p, name);
      assert.equal(p.fips, fips);
      assert.match(p.d, /^M/);
      assert.equal(Number.isFinite(p.cx), true);
      assert.equal(Number.isFinite(p.cy), true);
      assert.equal(p.bh > 0, true);
    }
  });

  it('keeps a known state inside the viewBox', () => {
    const ny = paths.get('36');
    assert.ok(ny);
    assert.equal(ny.cx > 0 && ny.cx < MAP_W, true);
    assert.equal(ny.cy > 0 && ny.cy < MAP_H, true);
  });
});
