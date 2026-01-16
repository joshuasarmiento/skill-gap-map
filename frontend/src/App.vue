<template>
  <div class="flex h-screen w-full bg-slate-950">
    <!-- Sidebar -->
    <div class="w-80 h-full border-r border-slate-800 flex flex-col">
      <!-- Header -->
      <div class="p-6 border-b border-slate-800">
        <h1 class="text-2xl font-black text-blue-500 uppercase tracking-tight">
          Skill-Gap <span class="text-white">PH</span>
        </h1>
        <p class="text-xs text-slate-500 mt-1">Labor Market Intelligence</p>
      </div>

      <!-- Trends Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <TrendSidebar :slug="selectedSlug" />
      </div>
    </div>

    <!-- Map -->
    <div class="flex-1 relative">
      <MapView @select-region="handleRegionSelect" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MapView from './components/MapView.vue';
import TrendSidebar from './components/TrendSidebar.vue';

const selectedSlug = ref<string | null>(null);

function handleRegionSelect(slug: string) {
  selectedSlug.value = slug;
  console.log('Selected region:', slug);
}
</script>