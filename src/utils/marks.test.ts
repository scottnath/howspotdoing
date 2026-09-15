import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isDate, longDate, markKind, markText, shortDate } from './marks.ts';

describe('isDate', () => {
  it('accepts a YYYY-MM-DD prefix', () => {
    assert.equal(isDate('2027-07-01'), true);
    assert.equal(isDate('2027-07-01T12:00:00Z'), true);
  });

  it('rejects non-dates', () => {
    assert.equal(isDate('YES'), false);
    assert.equal(isDate('NO'), false);
    assert.equal(isDate('07-01-2027'), false);
    assert.equal(isDate(''), false);
    assert.equal(isDate(null), false);
    assert.equal(isDate(2027), false);
  });
});

describe('markKind', () => {
  it('is yes only for YES', () => {
    assert.equal(markKind('YES'), 'yes');
  });

  it('is date for an ISO date string', () => {
    assert.equal(markKind('2027-07-01'), 'date');
  });

  it('is no for everything else', () => {
    assert.equal(markKind('NO'), 'no');
    assert.equal(markKind('yes'), 'no');
    assert.equal(markKind(''), 'no');
    assert.equal(markKind(undefined), 'no');
  });
});

describe('shortDate / longDate', () => {
  it('formats in UTC so the calendar day does not shift', () => {
    assert.equal(shortDate('2027-07-01'), 'Jul 1, 2027');
    assert.equal(longDate('2027-07-01'), 'July 1, 2027');
  });
});

describe('markText', () => {
  it('returns YES, a legal-from phrase, or NO', () => {
    assert.equal(markText('YES'), 'YES');
    assert.equal(markText('2027-07-01'), 'legal from July 1, 2027');
    assert.equal(markText('NO'), 'NO');
    assert.equal(markText(null), 'NO');
  });
});
