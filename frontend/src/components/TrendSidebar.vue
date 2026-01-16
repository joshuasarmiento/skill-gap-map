<template>
  <div class="space-y-6">
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
      <div class="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="text-xs text-slate-500 uppercase tracking-wider">Loading trends...</p>
    </div>

    <div v-else-if="!props.slug" class="flex flex-col items-center justify-center py-12 text-center">
      <svg class="w-16 h-16 text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
      <p class="text-sm text-slate-400 font-medium">Select a region on the map</p>
    </div>

    <div v-else-if="skills.length === 0 && !isLoading"
      class="flex flex-col items-center justify-center py-12 text-center">
      <p class="text-sm text-slate-400 font-medium">No data for this region</p>
    </div>

    <div v-else>
      <div class="mb-6 pb-4 border-b border-slate-800">
        <h3 class="text-lg font-black text-white uppercase tracking-tight">
          {{ props.displayName || regionName }}
        </h3>
        <p class="text-xs text-slate-500 mt-1">
          {{ skills.length }} skills in demand
        </p>
      </div>

      <div v-for="(skill, index) in skills" :key="skill.skillName" class="group mb-6 animate-fade-in"
        :style="{ animationDelay: `${index * 30}ms` }">
        <div class="flex justify-between items-end mb-2">
          <div class="flex-1">
            <p
              class="text-sm font-bold text-slate-100 uppercase tracking-tight group-hover:text-blue-400 transition-colors">
              {{ skill.skillName }}
            </p>
            <p class="text-[10px] text-slate-500 font-mono uppercase mt-0.5">
              {{ skill.category }}
            </p>
          </div>
          <div class="text-right">
            <span class="text-sm font-black text-blue-400 tabular-nums">{{ skill.count }}</span>
            <span class="text-xs text-slate-600 ml-1">jobs</span>
          </div>
        </div>

        <div class="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 transition-all duration-700 ease-out rounded-full"
            :style="{ width: `${(skill.count / maxCount) * 100}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = defineProps<{
  slug: string | null,
  displayName?: string | null
}>();

interface Skill {
  skillName: string;
  category: string;
  count: number;
  lastUpdated: string;
}

const skills = ref<Skill[]>([]);
const isLoading = ref(false);
const regionName = ref(''); 

const maxCount = computed(() => {
  if (skills.value.length === 0) return 1;
  return Math.max(...skills.value.map(s => s.count));
});

watch(
  () => props.slug,
  async (newSlug) => {
    if (!newSlug) {
      skills.value = [];
      regionName.value = '';
      return;
    }

    isLoading.value = true;

    try {
      const response = await fetch(`http://localhost:3000/api/trends/${newSlug}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (Array.isArray(data)) {
        skills.value = data;

        // 2. Fallback formatting kung sakaling walang displayName na pinasa
        if (!props.displayName) {
          regionName.value = newSlug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
      } else {
        skills.value = [];
      }
    } catch (err) {
      console.error('Failed to fetch trends:', err);
      skills.value = [];
    } finally {
      isLoading.value = false;
    }
  },
  { immediate: true }
);
</script>