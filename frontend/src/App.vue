<script setup lang="ts">
import { ref } from 'vue';
import MapView from './components/MapView.vue';
import TrendSidebar from './components/TrendSidebar.vue';

// The state that keeps track of which region is clicked
const selectedRegionSlug = ref<string | null>(null);

const onRegionClick = (slug: string) => {
  selectedRegionSlug.value = slug;
};
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
    <section class="relative flex-1 bg-slate-900">
      <div class="absolute top-6 left-6 z-[1000] pointer-events-none">
        <h1 class="text-3xl font-black tracking-tighter text-blue-500 uppercase">
          Skill-Gap <span class="text-white">PH</span>
        </h1>
        <p class="text-slate-400 text-sm font-medium bg-slate-950/50 backdrop-blur-md p-2 rounded-md mt-1 border border-slate-800">
          Real-time Labor Market Intelligence
        </p>
      </div>
      
      <MapView @select-region="onRegionClick" />
    </section>

    <TrendSidebar :slug="selectedRegionSlug" />
  </div>
</template>

<style>
/* Remove the default Leaflet focus outline */
.leaflet-container {
  background: #0f172a !important;
  outline: none;
}
</style>