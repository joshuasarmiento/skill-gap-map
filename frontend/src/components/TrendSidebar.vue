<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
      <div class="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="text-xs text-slate-500 uppercase tracking-wider">Loading trends...</p>
    </div>

    <!-- Empty State (No Region Selected) -->
    <div v-else-if="!props.slug" class="flex flex-col items-center justify-center py-12 text-center">
      <svg 
        class="w-16 h-16 text-slate-700 mb-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
      <p class="text-sm text-slate-400 font-medium">
        Select a region on the map
      </p>
      <p class="text-xs text-slate-600 mt-1">
        Click any province to view skill demand
      </p>
    </div>

    <!-- No Data State (Region Selected but No Skills) -->
    <div v-else-if="skills.length === 0 && !isLoading" class="flex flex-col items-center justify-center py-12 text-center">
      <svg 
        class="w-16 h-16 text-slate-700 mb-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <p class="text-sm text-slate-400 font-medium">
        No data for this region
      </p>
      <p class="text-xs text-slate-600 mt-1">
        Try running the scraper for this area
      </p>
    </div>

    <!-- Skills List -->
    <div v-else>
      <!-- Region Header -->
      <div class="mb-6 pb-4 border-b border-slate-800">
        <h3 class="text-lg font-black text-white uppercase tracking-tight">
          {{ regionName }}
        </h3>
        <p class="text-xs text-slate-500 mt-1">
          {{ skills.length }} skills in demand
        </p>
      </div>

      <!-- Skill Items -->
      <div 
        v-for="(skill, index) in skills" 
        :key="skill.skillName"
        class="group mb-6 animate-fade-in"
        :style="{ animationDelay: `${index * 30}ms` }"
      >
        <!-- Skill Header -->
        <div class="flex justify-between items-end mb-2">
          <div class="flex-1">
            <p class="text-sm font-bold text-slate-100 uppercase tracking-tight group-hover:text-blue-400 transition-colors">
              {{ skill.skillName }}
            </p>
            <p class="text-[10px] text-slate-500 font-mono uppercase mt-0.5">
              {{ skill.category }}
            </p>
          </div>
          <div class="text-right">
            <span class="text-sm font-black text-blue-400 tabular-nums">
              {{ skill.count }}
            </span>
            <span class="text-xs text-slate-600 ml-1">jobs</span>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 transition-all duration-700 ease-out rounded-full"
            :style="{ width: `${(skill.count / maxCount) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = defineProps<{ slug: string | null }>();

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
    // Clear previous data
    if (!newSlug) {
      skills.value = [];
      regionName.value = '';
      return;
    }
    
    isLoading.value = true;
    
    try {
      console.log('Fetching trends for:', newSlug);
      const response = await fetch(`http://localhost:3000/api/trends/${newSlug}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      if (data.error) {
        console.warn('API returned error:', data.error);
        skills.value = [];
        regionName.value = '';
      } else if (Array.isArray(data)) {
        skills.value = data;
        // Convert slug to readable name
        regionName.value = newSlug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      } else {
        console.warn('Unexpected data format:', data);
        skills.value = [];
        regionName.value = '';
      }
    } catch (err) {
      console.error('Failed to fetch trends:', err);
      skills.value = [];
      regionName.value = '';
    } finally {
      isLoading.value = false;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
  opacity: 0;
}

/* Custom scrollbar for parent container */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #0f172a;
}

::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>