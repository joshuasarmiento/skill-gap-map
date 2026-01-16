<script setup lang="ts">
import { onMounted } from 'vue';
import L from 'leaflet';
// @ts-ignore
import 'leaflet/dist/leaflet.css';

const emit = defineEmits(['select-region']);

onMounted(async () => {
  // Initialize map centered on the PH archipelago
  const map = L.map('map-container', {
    zoomControl: false, // We'll keep it clean
    attributionControl: false
  }).setView([12.8797, 121.7740], 6);

  // Dark Matter tiles from CartoDB
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

  try {
    // Fetching the official GeoJSON for PH Provinces
    const res = await fetch('https://raw.githubusercontent.com/faeldon/philippines-json-maps/master/2023/geojson/provinces.0.1.json');
    const geojsonData = await res.json();

    L.geoJSON(geojsonData, {
      style: {
        fillColor: '#1e40af', // blue-800
        weight: 1,
        opacity: 1,
        color: '#334155', // slate-700
        fillOpacity: 0.3
      },
      onEachFeature: (feature, layer) => {
        // Interaction Logic
        layer.on('mouseover', () => {
          (layer as L.Path).setStyle({ fillOpacity: 0.7, fillColor: '#3b82f6' });
        });
        
        layer.on('mouseout', () => {
          (layer as L.Path).setStyle({ fillOpacity: 0.3, fillColor: '#1e40af' });
        });

        layer.on('click', () => {
          // Convert "Metro Manila" -> "metro-manila" to match DB slugs
          const slug = feature.properties.name.toLowerCase().replace(/\s+/g, '-');
          emit('select-region', slug);
          
          // Smooth zoom to the region
          map.fitBounds((layer as L.Polygon).getBounds(), { padding: [50, 50] });
        });
      }
    }).addTo(map);
  } catch (err) {
    console.error("GeoJSON Load Error:", err);
  }
});
</script>

<template>
  <div id="map-container" class="h-full w-full"></div>
</template>