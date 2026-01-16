<template>
  <div class="flex h-full w-full bg-slate-950">
    <div class="w-80 h-full border-r border-slate-800 flex flex-col pt-20">
      <div class="flex-1 overflow-y-auto p-6">
        <TrendSidebar :slug="selectedSlug" />
      </div>
    </div>

    <div class="flex-1 relative">
      <MapView @select-region="handleRegionSelect" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MapView from '../components/MapView.vue';
import TrendSidebar from '../components/TrendSidebar.vue';

const selectedSlug = ref<string | null>(null);

function handleRegionSelect(slug: string) {
  selectedSlug.value = slug;
}
</script>