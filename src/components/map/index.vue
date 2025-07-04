<template>
  <div class="map-demo-wrappers">
    <Amap
      v-if="type == 'amap'"
      :mapKey="mapKey"
      :height="height"
      :zoom="zoom"
      :center="center"
      :securityKey="securityKey"
      :showCenterIcon="showCenterIcon"
      :centerIconUrl="centerIconUrl"
      :locale="locale"
    />
    <GoogleMap
      v-else-if="type == 'gmap'"
      :mapKey="mapKey"
      :height="height"
      :zoom="zoom"
      :center="center"
      :showCenterIcon="showCenterIcon"
      :centerIconUrl="centerIconUrl"
      :locale="locale"
    />
  </div>
</template>

<script setup lang="ts">
import type { MapOptions } from "./types";
import { defineAsyncComponent } from "vue";

const Amap = defineAsyncComponent(() => import("./amap/index.vue"));
const GoogleMap = defineAsyncComponent(() => import("./gmap/index.vue"));

const props = defineProps<MapOptions>();
</script>

<style lang="scss" scoped>
.map-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}
.map-demo-wrappers {
  display: flex;
  gap: 10px;
}
</style>
