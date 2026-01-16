import { db } from './backend/src/db/index';
import * as schema from './backend/src/db/schema';
import { SKILLS_DICTIONARY } from './scraper/skill-list';

async function seed() {
  console.log('🌱 Seeding database...\n');

  // Philippine regions and cities with proper JobStreet slugs
  const regionData = [
    { name: 'Metro Manila', slug: 'metro-manila' },
    { name: 'Quezon City', slug: 'quezon-city' },
    { name: 'Makati', slug: 'makati' },
    { name: 'Taguig', slug: 'taguig' },
    { name: 'Pasig', slug: 'pasig' },
    { name: 'Mandaluyong', slug: 'mandaluyong' },
    { name: 'Manila', slug: 'manila' },
    { name: 'Muntinlupa', slug: 'muntinlupa' },
    { name: 'Parañaque', slug: 'paranaque' },
    { name: 'Las Piñas', slug: 'las-pinas' },
    { name: 'Pasay', slug: 'pasay' },
    { name: 'Cebu', slug: 'cebu' },
    { name: 'Davao', slug: 'davao' },
    { name: 'Cavite', slug: 'cavite' },
    { name: 'Laguna', slug: 'laguna' },
    { name: 'Pampanga', slug: 'pampanga' },
    { name: 'Bulacan', slug: 'bulacan' },
  ];

  try {
    // Insert regions
    console.log('📍 Inserting regions...');
    for (const region of regionData) {
      await db.insert(schema.regions)
        .values(region)
        .onConflictDoNothing();
    }
    console.log(`   ✅ Inserted ${regionData.length} regions\n`);

    // Insert skills from dictionary
    console.log('🎯 Inserting skills...');
    for (const skill of SKILLS_DICTIONARY) {
      await db.insert(schema.skills)
        .values({
          name: skill.name,
          category: skill.category
        })
        .onConflictDoNothing();
    }
    console.log(`   ✅ Inserted ${SKILLS_DICTIONARY.length} skills\n`);

    // Verify data
    const regionCount = await db.select().from(schema.regions);
    const skillCount = await db.select().from(schema.skills);
    
    console.log('📊 Database Summary:');
    console.log(`   - Regions: ${regionCount.length}`);
    console.log(`   - Skills: ${skillCount.length}`);
    console.log('\n✅ Database seeding complete!');
    console.log('\n💡 Next step: Run the scraper with "npm run scrape"\n');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }

  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});