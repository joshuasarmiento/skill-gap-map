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
          <button @click="handleExport" :disabled="isExporting"
            class="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[10px] font-black uppercase px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-500/20">
            {{ isExporting ? 'Processing...' : 'Export CSV' }}
          </button>
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
import { exportToCSV } from './utils/export';

const isExporting = ref(false);

async function handleExport() {
  isExporting.value = true;
  try {
    const response = await fetch('http://localhost:3000/api/export/csv');
    const data = await response.json();

    if (data.error) throw new Error(data.error);

    exportToCSV(data);
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