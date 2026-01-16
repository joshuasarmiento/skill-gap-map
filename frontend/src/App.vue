<template>
  <div class="h-screen w-full bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">

    <header class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-4xl">
      <nav
        class="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl px-6 py-3 shadow-2xl flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-black text-xs">SG</span>
          </div>
          <span class="font-black uppercase tracking-tighter text-blue-500">
            Skill-Gap <span class="text-white">PH</span>
          </span>
        </div>

        <div class="flex items-center gap-6">
          <RouterLink to="/" class="text-xs font-bold uppercase tracking-widest transition-colors hover:text-blue-400"
            active-class="text-blue-500">
            Map
          </RouterLink>
          <RouterLink to="/analytics"
            class="text-xs font-bold uppercase tracking-widest transition-colors hover:text-blue-400"
            active-class="text-blue-500">
            Analytics
          </RouterLink>
          <RouterLink to="/about" class="text-xs font-bold uppercase" active-class="text-blue-500">About</RouterLink>
          <div class="h-4 w-[1px] bg-slate-800"></div>

          <button @click="isDropdownOpen = !isDropdownOpen"
            class="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase px-4 py-2 rounded-lg transition-all flex items-center gap-2">
            {{ isExporting ? 'Processing...' : 'Export Data' }}
            <svg class="w-3 h-3 transition-transform" :class="{ 'rotate-180': isDropdownOpen }" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div v-if="isDropdownOpen"
            class="absolute top-10 right-6 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-[110]"
            @mouseleave="isDropdownOpen = false">
            <button @click="handleExport('csv')"
              class="w-full text-left px-4 py-3 text-[10px] font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border-b border-slate-800 flex justify-between">
              SPREADSHEET <span>.CSV</span>
            </button>
            <button @click="handleExport('json')"
              class="w-full text-left px-4 py-3 text-[10px] font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border-b border-slate-800 flex justify-between">
              RAW DATA <span>.JSON</span>
            </button>
            <button @click="handleExport('summary')"
              class="w-full text-left px-4 py-3 text-[10px] font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex justify-between">
              STATS SUMMARY <span>.JSON</span>
            </button>
          </div>
        </div>
      </nav>
    </header>

    <main class="h-full w-full">
      <RouterView />
    </main>

  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { ref } from 'vue';
import { exportToCSV, exportToJSON } from './utils/export';

const isExporting = ref(false);
const isDropdownOpen = ref(false);

async function handleExport(format) {
  isExporting.value = true;
  try {
    const response = await fetch('http://localhost:3000/api/export/csv');
    const data = await response.json();

    if (data.error) throw new Error(data.error);

    if (format === 'csv') {
      exportToCSV(data);
    } else {
      exportToJSON(data);
    }
  } catch (error) {
    alert('Export failed: ' + error.message);
  } finally {
    isExporting.value = false;
  }
}
</script>

<style>
/* Ensure map controls don't overlap with floating header */
.maplibregl-ctrl-top-right {
  top: 80px !important;
}
</style>