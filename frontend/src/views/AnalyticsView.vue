<template>
  <div class="min-h-screen w-full bg-slate-950 pt-32 pb-12 px-6">
    <div class="max-w-6xl mx-auto">
      <div class="mb-12">
        <h2 class="text-4xl font-black text-white uppercase tracking-tighter">
          Market <span class="text-blue-500">Analytics</span>
        </h2>
        <p class="text-slate-500 mt-2 max-w-xl">
          Aggregated labor market data across the Philippines. Identifying the most in-demand 
          technical and soft skills based on real-time job availability.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div v-for="stat in summaryStats" :key="stat.label" class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{{ stat.label }}</p>
          <p class="text-3xl font-black text-white">{{ stat.value }}</p>
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div class="p-8 border-b border-slate-800 flex justify-between items-center">
          <h3 class="text-xl font-bold text-white uppercase tracking-tight">Top Trending Skills</h3>
          <span class="text-xs font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">National Ranking</span>
        </div>
        
        <div class="p-8">
          <div v-if="loading" class="flex justify-center py-12">
            <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          <div v-else class="space-y-8">
            <div v-for="(skill, index) in topSkills" :key="skill.skillName" class="relative">
              <div class="flex justify-between items-end mb-2">
                <div>
                  <span class="text-slate-600 font-mono text-xs mr-3">#{{ index + 1 }}</span>
                  <span class="text-lg font-bold text-slate-100 uppercase">{{ skill.skillName }}</span>
                  <span class="ml-3 text-[10px] text-slate-500 uppercase font-bold tracking-widest">{{ skill.category }}</span>
                </div>
                <div class="text-right">
                  <span class="text-xl font-black text-blue-500">{{ skill.totalCount }}</span>
                  <span class="text-xs text-slate-600 ml-1 uppercase font-bold">Postings</span>
                </div>
              </div>
              <div class="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000"
                  :style="{ width: `${(skill.totalCount / maxDemand) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const topSkills = ref([]);
const loading = ref(true);

const summaryStats = computed(() => [
  { label: 'Total Postings Analyzed', value: topSkills.value.reduce((acc, s) => acc + s.totalCount, 0).toLocaleString() },
  { label: 'Unique Skills Tracked', value: topSkills.value.length },
  { label: 'Data Refresh Rate', value: '24 Hours' }
]);

const maxDemand = computed(() => {
  return topSkills.value.length > 0 ? topSkills.value[0].totalCount : 1;
});

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/top-skills?limit=15');
    topSkills.value = await res.json();
  } catch (err) {
    console.error('Failed to load analytics:', err);
  } finally {
    loading.value = false;
  }
});
</script>