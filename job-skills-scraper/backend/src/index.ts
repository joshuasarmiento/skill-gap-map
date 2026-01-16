import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { db } from './db/index.js';
import { regions, skillDemand, skills } from './db/schema.js';
import { eq, desc, sql } from 'drizzle-orm';

const app = new Hono();

// Enable CORS for all API routes
app.use('/api/*', cors());

// Home route
app.get('/', (c) => {
  return c.json({ 
    message: 'Job Skills API',
    endpoints: {
      mapSummary: '/api/map-summary',
      trends: '/api/trends/:slug',
    }
  });
});

// Get all regions with their total skill demand
app.get('/api/map-summary', async (c) => {
  try {
    const result = await db
      .select({
        id: regions.id,
        name: regions.name,
        slug: regions.slug,
        totalDemand: sql<number>`COALESCE(SUM(${skillDemand.count}), 0)`.as('total_demand'),
      })
      .from(regions)
      .leftJoin(skillDemand, eq(regions.id, skillDemand.regionId))
      .groupBy(regions.id, regions.name, regions.slug);

    return c.json(result);
  } catch (error) {
    console.error('Error fetching map summary:', error);
    return c.json({ error: 'Failed to fetch map summary' }, 500);
  }
});

// Get detailed skill trends for a specific region
app.get('/api/trends/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');
    
    const data = await db
      .select({
        skillName: skills.name,
        category: skills.category,
        count: skillDemand.count,
        lastUpdated: skillDemand.lastUpdated,
      })
      .from(skillDemand)
      .innerJoin(regions, eq(skillDemand.regionId, regions.id))
      .innerJoin(skills, eq(skillDemand.skillId, skills.id))
      .where(eq(regions.slug, slug))
      .orderBy(desc(skillDemand.count));

    if (data.length === 0) {
      return c.json({ error: 'Region not found or no data available' }, 404);
    }

    return c.json(data);
  } catch (error) {
    console.error('Error fetching trends:', error);
    return c.json({ error: 'Failed to fetch trends' }, 500);
  }
});

// Get top skills across all regions
app.get('/api/top-skills', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '10');
    
    const topSkills = await db
      .select({
        skillName: skills.name,
        category: skills.category,
        totalCount: sql<number>`SUM(${skillDemand.count})`.as('total_count'),
      })
      .from(skillDemand)
      .innerJoin(skills, eq(skillDemand.skillId, skills.id))
      .groupBy(skills.id, skills.name, skills.category)
      .orderBy(desc(sql`SUM(${skillDemand.count})`))
      .limit(limit);

    return c.json(topSkills);
  } catch (error) {
    console.error('Error fetching top skills:', error);
    return c.json({ error: 'Failed to fetch top skills' }, 500);
  }
});

const port = 3000;
console.log(`🚀 Server running at http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
});