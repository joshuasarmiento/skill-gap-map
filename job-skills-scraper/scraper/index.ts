import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { db } from '../backend/src/db/index';
import * as schema from '../backend/src/db/schema';
import { SKILLS_DICTIONARY } from './skill-list';
import { sql, eq } from 'drizzle-orm';

// Apply the stealth plugin
chromium.use(StealthPlugin());

async function runScraper() {
  console.log('🚀 Starting stealth scraper...\n');

  // Launch with stealth capabilities
  const browser = await chromium.launch({ 
    headless: true // Set to false if you want to watch it work
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  // Fetch Regions from Database
  const allRegions = await db.select().from(schema.regions);

  if (allRegions.length === 0) {
    console.error("❌ No regions found in database. Run 'npm run seed' first.");
    await browser.close();
    return;
  }

  console.log(`📍 Found ${allRegions.length} regions to scrape\n`);

  for (const region of allRegions) {
    console.log(`🔍 Scraping: ${region.name}...`);
    // JobStreet URLs often look like this: /jobs/in-slug
    const searchUrl = `https://ph.jobstreet.com/jobs/in-${region.slug}`;
    
    try {
      // 1. Navigate with a realistic timeout and wait strategy
      await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 60000 });
      
      // 2. Human-like behavior: Scroll down slightly to trigger lazy-loaded elements
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(Math.floor(Math.random() * 2000) + 1000);

      // 3. Wait for the specific job card selector
      try {
        await page.waitForSelector('[data-testid="job-card"]', { timeout: 15000 });
      } catch (e) {
        console.warn(`   ⚠️  No job cards appeared for ${region.name} after waiting.`);
        // Take a screenshot to debug if you are being blocked
        await page.screenshot({ path: `debug-${region.slug}.png` });
        continue;
      }

      // 4. Extract text content from all cards
      const jobDescriptions = await page.$$eval('[data-testid="job-card"]', (cards) => {
        return cards.map(card => (card as HTMLElement).innerText?.toLowerCase() || "");
      });

      console.log(`   ✓ Found ${jobDescriptions.length} job listings`);

      // 5. Count skill mentions using the dictionary
      const counts: Record<string, number> = {};
      
      jobDescriptions.forEach(desc => {
        SKILLS_DICTIONARY.forEach(skill => {
          const skillLower = skill.name.toLowerCase();
          // Use a simple boundary check to avoid matching "Go" in "Google"
          const regex = new RegExp(`\\b${skillLower}\\b`, 'i');
          if (regex.test(desc)) {
            counts[skill.name] = (counts[skill.name] || 0) + 1;
          }
        });
      });

      // 6. Save to database
      const skillsFound = Object.keys(counts).length;
      if (skillsFound > 0) {
        console.log(`   💾 Saving ${skillsFound} skills to database...`);
        
        for (const [skillName, count] of Object.entries(counts)) {
          const [skillRecord] = await db
            .select()
            .from(schema.skills)
            .where(eq(schema.skills.name, skillName))
            .limit(1);

          if (skillRecord) {
            await db.insert(schema.skillDemand)
              .values({ 
                regionId: region.id, 
                skillId: skillRecord.id, 
                count: count 
              })
              .onConflictDoUpdate({
                target: [schema.skillDemand.regionId, schema.skillDemand.skillId],
                set: { 
                  count: count, 
                  lastUpdated: sql`CURRENT_TIMESTAMP`
                }
              });
          }
        }
      }

      console.log(`   ✅ Completed ${region.name}\n`);
      
    } catch (err) {
      console.error(`   ❌ Failed processing ${region.name}:`, err);
    }

    // 7. Critical: Wait between regions to avoid rate limiting
    const sleepTime = Math.floor(Math.random() * 5000) + 3000;
    await page.waitForTimeout(sleepTime);
  }

  await browser.close();
  console.log('🎉 Scraping complete!');
  process.exit(0);
}

runScraper().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});