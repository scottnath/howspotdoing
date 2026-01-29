import { readdirSync, existsSync, mkdirSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import puppeteer from 'puppeteer';

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 628;

const CONTENT_FOLDER = 'src/content/locations';
const OUTPUT_FOLDER = 'public/social-cards';

const BASE_URL = 'http://localhost:4321';
const TIMEOUT = 3000;

// Set to 0 or undefined to process all locations
const LIMIT = 0;

interface GenerateOptions {
  limit?: number;
  forceRegenerate?: boolean;
}

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
 * Generates social card images for all locations.
 */
async function generateSocialCards(options: GenerateOptions = {}): Promise<void> {
  const { limit = LIMIT, forceRegenerate = false } = options;

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
  const slugsToProcess = limit > 0 ? slugs.slice(0, limit) : slugs;

  console.log(`Found ${slugs.length} locations`);
  if (limit > 0) {
    console.log(`Processing limited to ${limit} locations`);
  }

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let processed = 0;
  let skipped = 0;

  for (const slug of slugsToProcess) {
    const outputFile = join(outputPath, `${slug}.png`);

    // Skip if file exists and not forcing regeneration
    if (existsSync(outputFile) && !forceRegenerate) {
      console.log(`Skipping ${slug} - social card already exists`);
      skipped++;
      continue;
    }

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
      await delay(TIMEOUT);

      await page.screenshot({
        path: outputFile,
        clip: {
          x: 0,
          y: 0,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        },
      });

      console.log(`✓ Generated: ${slug}.png`);
      processed++;
      await page.close();
    } catch (error) {
      console.error(`✗ Failed to generate social card for ${slug}:`, error);
    }
  }

  await browser.close();

  console.log('\n--- Summary ---');
  console.log(`Processed: ${processed}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total: ${slugsToProcess.length}`);
}

/**
 * Handles renaming the social card page to make it visible/hidden.
 * The underscore prefix hides it from production builds.
 */
async function generateWithPageRename(): Promise<void> {
  const cwd = process.cwd();
  const hiddenPath = join(cwd, 'src/pages/_social-card.astro');
  const visiblePath = join(cwd, 'src/pages/social-card.astro');

  const isHidden = existsSync(hiddenPath);
  const isVisible = existsSync(visiblePath);

  if (!isHidden && !isVisible) {
    console.error('Error: social-card.astro page not found');
    process.exit(1);
  }

  // If page is hidden, rename to visible, run generation, then rename back
  if (isHidden) {
    console.log('Unhiding social-card page for generation...');
    renameSync(hiddenPath, visiblePath);

    try {
      await generateSocialCards();
    } finally {
      console.log('Re-hiding social-card page...');
      renameSync(visiblePath, hiddenPath);
    }
  } else {
    // Page is already visible, just run generation
    await generateSocialCards();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const forceFlag = args.includes('--force') || args.includes('-f');
const noRenameFlag = args.includes('--no-rename');

if (forceFlag) {
  console.log('Force regeneration enabled - will overwrite existing files\n');
}

// Run the appropriate function based on flags
if (noRenameFlag) {
  generateSocialCards({ forceRegenerate: forceFlag }).catch(console.error);
} else {
  generateWithPageRename().catch(console.error);
}
