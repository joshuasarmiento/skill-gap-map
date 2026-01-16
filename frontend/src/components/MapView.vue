<template>
  <div class="relative h-full w-full bg-slate-950">
    <div ref="mapContainer" class="h-full w-full"></div>

    <!-- Loading State -->
    <div v-if="loading" class="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <div class="flex flex-col items-center">
        <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-sm font-bold uppercase tracking-widest text-slate-400">
          Loading Map
        </p>
      </div>
    </div>

    <!-- Legend -->
    <div class="absolute bottom-6 left-6 z-10 bg-slate-900/90 p-4 border border-slate-800 rounded-lg backdrop-blur-md">
      <h4 class="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Job Demand</h4>
      <div class="h-2 w-32 bg-gradient-to-r from-slate-800 via-blue-600 to-cyan-400 rounded-full mb-1"></div>
      <div class="flex justify-between text-[9px] text-slate-500 font-bold uppercase">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>

    <!-- Hover Tooltip -->
    <div v-if="hoveredRegion"
      class="absolute z-40 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 pointer-events-none shadow-2xl"
      :style="{ top: `${tooltipY}px`, left: `${tooltipX}px` }">
      <p class="text-sm font-bold text-white">{{ hoveredRegion.name }}</p>
      <p class="text-xs text-blue-400 font-mono mt-1">
        {{ hoveredRegion.demand }} jobs
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, onUnmounted } from 'vue';
import maplibregl from 'maplibre-gl';
// @ts-ignore
import 'maplibre-gl/dist/maplibre-gl.css';

// 1. Define strict interfaces for type safety
interface RegionStat {
  name: string;
  totalDemand: number;
  slug: string;
}

interface DistrictMapping {
  primarySlug: string;
  cities: string[];
}

// 2. Map configuration to handle the complex NCR GeoJSON structure
const NCR_DISTRICT_CONFIG: Record<string, DistrictMapping> = {
  'NCR, City of Manila, First District (Not a Province)': {
    primarySlug: 'manila',
    cities: ['manila']
  },
  'NCR, Second District (Not a Province)': {
    primarySlug: 'mandaluyong',
    cities: ['mandaluyong', 'pasig', 'quezon-city', 'marikina', 'san-juan']
  },
  'NCR, Third District (Not a Province)': {
    primarySlug: 'caloocan',
    cities: ['caloocan', 'malabon', 'navotas', 'valenzuela']
  },
  'NCR, Fourth District (Not a Province)': {
    primarySlug: 'makati',
    cities: ['makati', 'pasay', 'taguig', 'paranaque', 'las-pinas', 'muntinlupa']
  }
};

const emit = defineEmits(['select-region']);
const mapContainer = ref<HTMLElement | null>(null);
const loading = ref(true);
const hoveredRegion = ref<{ name: string; demand: number } | null>(null);
const tooltipX = ref(0);
const tooltipY = ref(0);

let map: maplibregl.Map | null = null;
let hoveredId: string | number | null = null;

const slugify = (text: string): string => {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
};

onMounted(async () => {
  await nextTick();
  if (!mapContainer.value) return;

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    center: [121.7740, 12.8797],
    zoom: 5.5,
    attributionControl: false
  });

  

  map.on('load', async () => {
    try {
      const [geoRes, statsRes] = await Promise.all([
        fetch('/maps/philippines-regions.json'),
        fetch('http://localhost:3000/api/map-summary')
      ]);

      const geojson = await geoRes.json();
      const stats: RegionStat[] = await statsRes.json();

      // 3. Create a lookup Map for O(1) time complexity
      const statsLookup = new Map<string, number>(
        stats.map(s => [s.slug, s.totalDemand])
      );

      // 4. Transform GeoJSON features
      geojson.features = geojson.features.map((feature: any, index: number) => {
        const geojsonName = feature.properties.adm2_en || '';
        const config = NCR_DISTRICT_CONFIG[geojsonName];

        let totalDemand = 0;
        let finalSlug = '';

        if (config) {
          // Aggregating NCR District data
          finalSlug = config.primarySlug;
          totalDemand = config.cities.reduce((acc, citySlug) => {
            const cityData = stats.find((s: any) => s.slug === citySlug);
            return acc + (cityData?.totalDemand || 0);
          }, 0);
        } else {
          // Regular Provinces
          finalSlug = slugify(geojsonName);
          const data = stats.find((s: any) => s.slug === finalSlug);
          totalDemand = data?.totalDemand || 0;
        }

        return {
          ...feature,
          id: index,
          properties: {
            ...feature.properties,
            demand: totalDemand,
            slug: finalSlug, // This is for fetching data (e.g., 'mandaluyong')
            displayName: geojsonName // This is for the Title (e.g., 'NCR, Second District...')
          }
        };
      });

      map!.addSource('ph-provinces', {
        type: 'geojson',
        data: geojson,
        generateId: false // We provided our own numeric IDs above
      });

      map!.addLayer({
        id: 'province-fills',
        type: 'fill',
        source: 'ph-provinces',
        paint: {
          'fill-color': [
            'interpolate', ['linear'], ['get', 'demand'],
            0, '#0f172a',
            5, '#1e3a8a',
            15, '#2563eb',
            25, '#3b82f6',
            35, '#06b6d4'
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.9,
            0.7
          ]
        }
      });

      map!.addLayer({
        id: 'province-borders',
        type: 'line',
        source: 'ph-provinces',
        paint: { 'line-color': '#475569', 'line-width': 1 }
      });

      // Click handler
      map!.on('click', 'province-fills', (e) => {
        if (!e.features?.[0]) return;
        const { slug, displayName } = e.features[0].properties;

        console.log('Clicked region:', displayName, '(slug:', slug, ')');
        // emit('select-region', slug);
        emit('select-region', {
          slug: slug,
          name: displayName // This will be "NCR, Second District (Not a Province)"
        });

        map!.flyTo({
          center: e.lngLat,
          zoom: 8,
          duration: 1000
        });
      });

      // Hover handlers
      map!.on('mousemove', 'province-fills', (e) => {
        if (!e.features || e.features.length === 0) return;

        map!.getCanvas().style.cursor = 'pointer';

        // Update hover state
        if (hoveredId !== null) {
          map!.setFeatureState(
            { source: 'ph-provinces', id: hoveredId },
            { hover: false }
          );
        }

        hoveredId = e.features[0].id as number;
        map!.setFeatureState(
          { source: 'ph-provinces', id: hoveredId },
          { hover: true }
        );

        // Update tooltip
        const props = e.features[0].properties;
        hoveredRegion.value = {
          name: props.displayName || props.name || 'Unknown',
          demand: props.demand || 0
        };

        tooltipX.value = e.point.x + 15;
        tooltipY.value = e.point.y + 15;
      });

      map!.on('mouseleave', 'province-fills', () => {
        map!.getCanvas().style.cursor = '';

        if (hoveredId !== null) {
          map!.setFeatureState(
            { source: 'ph-provinces', id: hoveredId },
            { hover: false }
          );
        }
        hoveredId = null;
        hoveredRegion.value = null;
      });

      loading.value = false;
    } catch (err) {
      console.error("Error loading map data:", err);
      loading.value = false;
    }
  });
});

onUnmounted(() => {
  if (map) map.remove();
});
</script>

<style scoped>
.maplibregl-map {
  font-family: 'Inter', sans-serif;
}
</style>