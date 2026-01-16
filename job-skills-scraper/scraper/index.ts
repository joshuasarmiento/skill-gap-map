import { chromium } from 'playwright';
import { db } from '../backend/src/db/index.js';
import * as schema from '../backend/src/db/schema.js';
import { SKILLS_DICTIONARY } from './skill-list.js';
import { sql, eq } from 'drizzle-orm';

async function runScraper() {
    console.log('🚀 Starting scraper...\n');

    // Launch Browser
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
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
        const searchUrl = `https://ph.jobstreet.com/jobs/in-${region.slug}`;

        try {
            // Navigate to job listings page
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

            // Wait a bit for dynamic content to load
            await page.waitForTimeout(2000);

            // Extract text content from Job Cards
            const jobDescriptions = await page.$$eval('[data-testid="job-card"]', (cards) => {
                return cards.map(card => {
                    // You can narrow down to specific parts of the card if needed
                    const text = (card as HTMLElement).innerText || "";
                    return text.toLowerCase();
                });
            });

            if (jobDescriptions.length === 0) {
                console.warn(`   ⚠️  No job cards found for ${region.name}`);
                continue;
            }

            console.log(`   ✓ Found ${jobDescriptions.length} job listings`);

            // Count skill mentions
            const counts: Record<string, number> = {};

            jobDescriptions.forEach(desc => {
                SKILLS_DICTIONARY.forEach(skill => {
                    const skillLower = skill.name.toLowerCase();
                    if (desc.includes(skillLower)) {
                        counts[skill.name] = (counts[skill.name] || 0) + 1;
                    }
                });
            });

            // Save to database
            const skillsFound = Object.keys(counts).length;
            console.log(`   💾 Saving ${skillsFound} skills to database...`);

            for (const [skillName, count] of Object.entries(counts)) {
                // Find skill ID
                const [skillRecord] = await db
                    .select()
                    .from(schema.skills)
                    .where(eq(schema.skills.name, skillName))
                    .limit(1);

                if (skillRecord) {
                    // Upsert skill demand
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

            console.log(`   ✅ Completed ${region.name}\n`);

        } catch (err) {
            console.error(`   ❌ Failed processing ${region.name}:`, err);
            console.log('');
        }

        // Be nice to the server - wait 2 seconds between requests
        await page.waitForTimeout(2000);
    }

    await browser.close();
    console.log('🎉 Scraping complete!');
    process.exit(0);
}

runScraper().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});