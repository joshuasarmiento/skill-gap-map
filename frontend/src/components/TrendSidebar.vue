<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ slug: string | null }>();
const skills = ref<any[]>([]);
const isLoading = ref(false);

// Watch for region changes and fetch new data
watch(() => props.slug, async (newSlug) => {
  if (!newSlug) return;
  
  isLoading.value = true;
  try {
    const response = await fetch(`http://localhost:3000/api/trends/${newSlug}`);
    skills.value = await response.json();
  } catch (err) {
    console.error("Failed to fetch trends:", err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <aside class="w-[400px] bg-slate-950 border-l border-slate-800 flex flex-col">
    <div v-if="!slug" class="flex-1 flex flex-col items-center justify-center p-12 text-center">
      <div class="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
        <span class="text-2xl italic text-blue-500">?</span>
      </div>
      <h3 class="text-lg font-bold text-slate-200">No Region Selected</h3>
      <p class="text-slate-500 text-sm mt-2">Click on a province on the map to see localized job demand data.</p>
    </div>

    <div v-else class="flex-1 flex flex-col p-8 overflow-y-auto">
      <div class="mb-8">
        <span class="text-xs font-bold text-blue-500 uppercase tracking-widest">Market Analysis</span>
        <h2 class="text-3xl font-black capitalize mt-1">{{ slug.replace(/-/g, ' ') }}</h2>
      </div>

      <div v-if="isLoading" class="space-y-6">
        <div v-for="i in 5" :key="i" class="h-12 w-full bg-slate-900 animate-pulse rounded-lg"></div>
      </div>

      <div v-else-if="skills.length > 0" class="space-y-8">
        <div v-for="skill in skills" :key="skill.skillName">
          <div class="flex justify-between items-end mb-2">
            <div>
              <p class="text-sm font-bold text-slate-100 uppercase tracking-tight">{{ skill.skillName }}</p>
              <p class="text-[10px] text-slate-500 font-mono uppercase">{{ skill.category }}</p>
            </div>
            <span class="text-sm font-black text-blue-400">{{ skill.count }} Jobs</span>
          </div>
          
          <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-700 ease-out"
              :style="{ width: `${Math.min(skill.count * 10, 100)}%` }"
            ></div>
          </div>
        </div>
      </div>

      <div v-else class="text-slate-500 italic text-sm">
        No specific skill data found for this region yet.
      </div>
    </div>

    <footer class="p-6 border-t border-slate-900 bg-slate-950/80">
      <p class="text-[10px] text-slate-600 leading-tight">
        Data sourced via Scraper from public job boards. Updated weekly. 
        Always verify with local PESO offices.
      </p>
    </footer>
  </aside>
</template>