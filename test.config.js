/**
 * Test configuration for Node.js test runner (Node 24+)
 * Run with: node --import tsx test.config.js
 */
import { run } from 'node:test';
import { spec } from 'node:test/reporters';
import { glob } from 'node:fs/promises';
import process from 'node:process';

// Test configuration
const config = {
  // Glob pattern for test files
  pattern: 'src/**/*.test.ts',

  // Timeout per test (ms)
  timeout: 30000,

  // Run tests concurrently
  concurrency: true,

  // Enable coverage (set via --coverage flag)
  coverage: process.argv.includes('--coverage'),

  // Files to exclude from coverage reporting
  coverageExcludeGlobs: ['**/**.test.ts', '**/mocks/**', 'src/cli/index.ts'],
};

async function runTests() {
  // Find all test files using Node 24's native glob
  const testFiles = [];
  for await (const file of glob(config.pattern)) {
    testFiles.push(file);
  }

  if (testFiles.length === 0) {
    console.error('No test files found matching:', config.pattern);
    process.exit(1);
  }

  console.log(`Found ${testFiles.length} test file(s)\n`);

  // Run tests with coverage if requested
  const stream = run({
    files: testFiles,
    timeout: config.timeout,
    concurrency: config.concurrency,
    coverage: config.coverage,
    coverageExcludeGlobs: config.coverageExcludeGlobs,
  });

  // Use spec reporter for readable output
  stream.compose(spec).pipe(process.stdout);

  // Handle completion
  stream.on('test:fail', () => {
    process.exitCode = 1;
  });
}

runTests().catch((err) => {
  console.error('Test runner error:', err);
  process.exit(1);
});
