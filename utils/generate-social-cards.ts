import { readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawn, type ChildProcess } from 'node:child_process';
import puppeteer from 'puppeteer';

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 628;

const CONTENT_FOLDER = 'src/content/locations';
const OUTPUT_FOLDER = 'public/social-cards';

// Use a unique port to avoid conflicts with existing dev servers
const PORT = 4399;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DELAY = 1000;
const SERVER_READY_TIMEOUT = 30000;

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extracts the location slug from a filename.
 * e.g., "hpd-california.json" -> "california"
 */
function extractSlug(filename: string): string {
  return filename.replace(/^hpd-/, '').replace(/\.json$/, '');
}

/**
 * Waits for the dev server to be ready by polling the URL.
 */
async function waitForServer(url: string, timeout: number): Promise<boolean> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch {
      // Server not ready yet
    }
    await delay(500);
  }
  return false;
}

/**
 * Starts the Astro dev server on the specified port and returns the process.
 */
function startDevServer(): ChildProcess {
  console.log(`Starting dev server on port ${PORT}...`);
  const server = spawn('npx', ['astro', 'dev', '--port', String(PORT)], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
  });

  server.stdout?.on('data', (data) => {
    const output = data.toString();
    if (output.includes('localhost')) {
      console.log('Dev server output:', output.trim());
    }
  });

  server.stderr?.on('data', (data) => {
    console.error('Dev server error:', data.toString());
  });

  return server;
}

/**
 * Generates social card images for all locations.
 * Always regenerates all images.
 */
async function generateSocialCards(): Promise<void> {
  const cwd = process.cwd();
  const contentPath = join(cwd, CONTENT_FOLDER);
  const outputPath = join(cwd, OUTPUT_FOLDER);

  // Ensure output directory exists
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
    console.log(`Created output directory: ${outputPath}`);
  }

  // Get all location files
  const locationFiles = readdirSync(contentPath).filter((file) =>
    file.startsWith('hpd-') && file.endsWith('.json')
  );

  const slugs = locationFiles.map(extractSlug);
  console.log(`Found ${slugs.length} locations to process`);

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let processed = 0;
  let failed = 0;

  for (const slug of slugs) {
    const outputFile = join(outputPath, `${slug}.png`);
    const url = `${BASE_URL}/social-card?location=${slug}`;

    try {
      console.log(`Generating social card for ${slug}...`);
      const page = await browser.newPage();
      await page.setViewport({
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        deviceScaleFactor: 1,
      });

      await page.goto(url, { waitUntil: 'networkidle0' });
      await delay(SCREENSHOT_DELAY);

      await page.screenshot({
        path: outputFile,
        clip: {
          x: 0,
          y: 0,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        },
      });

      console.log(`  ✓ ${slug}.png`);
      processed++;
      await page.close();
    } catch (error) {
      console.error(`  ✗ Failed: ${slug}`, error);
      failed++;
    }
  }

  await browser.close();

  console.log('\n--- Summary ---');
  console.log(`Generated: ${processed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${slugs.length}`);

  if (failed > 0) {
    process.exit(1);
  }
}

/**
 * Main function - starts server, generates cards, stops server.
 */
async function main(): Promise<void> {
  const startWithServer = process.argv.includes('--with-server');

  if (startWithServer) {
    // Start dev server, generate cards, then stop server
    const server = startDevServer();

    try {
      console.log('Waiting for dev server to be ready...');
      const isReady = await waitForServer(BASE_URL, SERVER_READY_TIMEOUT);

      if (!isReady) {
        throw new Error('Dev server failed to start within timeout');
      }

      console.log('Dev server is ready!\n');
      await generateSocialCards();
    } finally {
      console.log('\nStopping dev server...');
      server.kill('SIGTERM');
      // Give it a moment to clean up
      await delay(1000);
    }
  } else {
    // Assume server is already running
    console.log('Checking if dev server is running...');
    const isReady = await waitForServer(BASE_URL, 5000);

    if (!isReady) {
      console.error('Dev server is not running. Either:');
      console.error('  1. Start it with: npm run dev');
      console.error('  2. Or use: npm run social-cards -- --with-server');
      process.exit(1);
    }

    await generateSocialCards();
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
