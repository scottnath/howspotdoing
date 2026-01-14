import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

describe('CLI', () => {
  const cliPath = resolve(import.meta.dirname, 'index.ts');

  it('should display help when called with --help', () => {
    const result = execSync(`node --import tsx ${cliPath} --help`, {
      encoding: 'utf-8',
    });

    assert.ok(result.includes('hpd-research'));
    assert.ok(result.includes('CLI for running legality research'));
    assert.ok(result.includes('run'));
    assert.ok(result.includes('rerun'));
  });

  it('should display version when called with --version', () => {
    const result = execSync(`node --import tsx ${cliPath} --version`, {
      encoding: 'utf-8',
    });

    assert.ok(result.includes('1.0.0'));
  });

  it('should display run command help', () => {
    const result = execSync(`node --import tsx ${cliPath} run --help`, {
      encoding: 'utf-8',
    });

    assert.ok(result.includes('Run research for locations'));
    assert.ok(result.includes('-l, --locations'));
  });

  it('should display rerun command help', () => {
    const result = execSync(`node --import tsx ${cliPath} rerun --help`, {
      encoding: 'utf-8',
    });

    assert.ok(result.includes('Re-run research for existing locations'));
    assert.ok(result.includes('-l, --locations'));
  });
});
