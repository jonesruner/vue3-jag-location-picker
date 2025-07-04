<template>
  <div class="map-container">
    <GmapPanel 
      :center="center"
      :zoom="zoom"
      :height="height"
      :show-center-icon="showCenterIcon"
      :center-icon-url="centerIconUrl"
      :map-key="mapKey"
      :security-key="securityKey"
      :locale="locale"
    />
  </div>
</template>

<script setup lang="ts">
import type { MapOptions, LatLng } from "../types";
import { defineAsyncComponent } from "vue";

const GmapPanel = defineAsyncComponent(() => import("./components/GmapPanel.vue"));

defineProps<MapOptions>()
</script>

<style scoped>
.map-container {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fff;
  overflow: hidden;
  position: relative;
}
</style>