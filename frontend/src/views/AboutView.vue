<template>
  <div class="min-h-screen w-full bg-slate-950 pt-32 pb-12 px-6">
    <div class="max-w-4xl mx-auto">
      <div class="space-y-16">
        <section>
          <h2 class="text-4xl font-black text-white uppercase tracking-tighter mb-6">
            About <span class="text-blue-500">The Project</span>
          </h2>
          <p class="text-xl text-slate-400 leading-relaxed">
            Skill-Gap PH is an open-source labor market intelligence platform designed to map the 
            digital and physical skill requirements of the Philippine economy across all provinces.
          </p>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h4 class="text-blue-500 font-black uppercase tracking-widest text-sm mb-4">The Engine</h4>
            <p class="text-slate-400 text-sm leading-relaxed">
              Our system utilizes a customized stealth scraper built with Playwright to analyze job boards. 
              It identifies demand by cross-referencing thousands of job descriptions against our 
              proprietary skills dictionary.
            </p>
          </div>
          <div>
            <h4 class="text-blue-500 font-black uppercase tracking-widest text-sm mb-4">The Data</h4>
            <p class="text-slate-400 text-sm leading-relaxed">
              Data is aggregated at the provincial level and visualized using MapLibre GL. 
              The backend is powered by a high-performance Hono API and a SQLite database managed with Drizzle ORM.
            </p>
          </div>
        </section>

        <section class="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <h4 class="text-white font-bold uppercase tracking-tight mb-6">Core Focus Areas</h4>
          <div class="flex flex-wrap gap-3">
            <span v-for="cat in categories" :key="cat" 
                  class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold uppercase border border-slate-700">
              {{ cat }}
            </span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
const categories = [
  'Tech & Programming', 'Finance', 'Marketing & Sales', 
  'Design & Creative', 'Healthcare', 'Engineering', 'Customer Support'
];
</script>