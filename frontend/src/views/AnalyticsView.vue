<template>
  <div class="min-h-screen bg-slate-950 pt-32 px-8 pb-20">
    <div class="max-w-6xl mx-auto">
      <div class="mb-12">
        <h1 class="text-6xl font-black text-white mb-2 uppercase tracking-tighter">
          National <span class="text-blue-500">Analytics</span>
        </h1>
        <div class="flex items-center gap-4">
          <p class="text-slate-500 font-medium">Consolidated trends from the latest market wide-scan across 88 regions.
          </p>
          <div class="h-px flex-1 bg-slate-800"></div>
          <span
            class="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Active Market Pulse
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <div class="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-[2rem] p-10 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10"></div>

          <div class="flex justify-between items-center mb-10">
            <h2 class="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
              <span class="w-8 h-px bg-blue-500"></span>
              In-Demand Skills
            </h2>
          </div>

          <div v-if="loading" class="space-y-6">
            <div v-for="i in 8" :key="i" class="h-10 bg-slate-800/50 rounded-xl w-full animate-pulse"></div>
          </div>

          <div v-else class="space-y-8">
            <div v-for="(skill, index) in topSkills" :key="skill.skillName" class="group">
              <div class="flex justify-between items-end mb-3">
                <div class="flex items-baseline gap-3">
                  <span class="text-slate-600 font-mono text-xs italic">{{ (index + 1).toString().padStart(2, '0')
                    }}</span>
                  <span
                    class="text-slate-200 font-black uppercase tracking-tight group-hover:text-blue-400 transition-colors text-lg">
                    {{ skill.skillName }}
                  </span>
                </div>
                <div class="flex items-baseline gap-1">
                  <span class="text-blue-500 font-black text-2xl tabular-nums">{{ skill.totalCount }}</span>
                  <span class="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Jobs</span>
                </div>
              </div>
              <div class="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
                  :style="{ width: (skill.totalCount / maxCount * 100) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div
            class="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group">
            <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <svg class="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">Gross Listings</p>
            <p class="text-5xl font-black tracking-tighter mb-4">{{ totalDemand.toLocaleString() }}</p>
            <div class="text-[10px] font-bold bg-white/10 w-fit px-2 py-1 rounded backdrop-blur-sm">
              PH MARKET AGGREGATE
            </div>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
            <h3 class="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Infrastructure</h3>
            <div class="space-y-4">
              <div class="flex justify-between border-b border-slate-800 pb-2">
                <span class="text-xs text-slate-400 font-bold uppercase">Regions</span>
                <span class="text-xs text-white font-mono">88</span>
              </div>
              <div class="flex justify-between border-b border-slate-800 pb-2">
                <span class="text-xs text-slate-400 font-bold uppercase">Skill Dict</span>
                <span class="text-xs text-white font-mono">200+</span>
              </div>
              <div class="flex justify-between">
                <span class="text-xs text-slate-400 font-bold uppercase">Cities</span>
                <span class="text-xs text-white font-mono">1,400+</span>
              </div>
            </div>
            <p class="text-slate-500 text-[10px] mt-6 leading-relaxed italic">
              Data is synthesized using multi-city district mapping for high-fidelity metropolitan snapshots.
            </p>
          </div>
        </div>

      </div>
      <p class="text-slate-500 text-[10px] mt-6 leading-relaxed italic">
        Data reflects the most recent snapshots of active job listings. Scanned and synchronized to capture current
        hiring patterns.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const topSkills = ref([]);
const loading = ref(true);

// Computed properties for safety and formatting
const maxCount = computed(() => {
  const counts = topSkills.value.map(s => s.totalCount);
  return counts.length > 0 ? Math.max(...counts) : 1;
});

const totalDemand = computed(() =>
  topSkills.value.reduce((acc, s) => acc + (s.totalCount || 0), 0)
);

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/top-skills?limit=10');
    if (!res.ok) throw new Error('Failed to fetch');
    topSkills.value = await res.json();
  } catch (err) {
    console.error('National analytics fetch error:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group {
  animation: slide-up 0.5s ease-out forwards;
}
</style>