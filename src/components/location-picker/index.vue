<template>
  <div class="location-picker-wrapper">
    <AmapLocationPicker
      v-if="type === 'amap'"
      :map-key="mapKey"
      :security-key="securityKey"
      :height="height"
      :zoom="zoom"
      :center="center"
      :show-center-icon="showCenterIcon"
      :center-icon-url="centerIconUrl"
      @location-selected="handleLocationSelected"
      @location-changed="handleLocationChanged"
      :locale="locale"
    />
    <GmapLocationPicker
      v-else-if="type === 'gmap'"
      :map-key="mapKey"
      :height="height"
      :zoom="zoom"
      :center="center"
      :show-center-icon="showCenterIcon"
      :center-icon-url="centerIconUrl"
      @location-selected="handleLocationSelected"
      @location-changed="handleLocationChanged"
      :locale="locale"
    />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import type { LocationPickerOptions, LocationResult } from './types';

// 异步加载地图组件
const AmapLocationPicker = defineAsyncComponent(() => import('./components/amap/index.vue'));
const GmapLocationPicker = defineAsyncComponent(() => import('./components/gmap/index.vue'));

// 扩展 LocationPickerOptions 添加地图类型
interface LocationPickerProps extends LocationPickerOptions {
  type?: 'amap' | 'gmap';
}

const props = withDefaults(defineProps<LocationPickerProps>(), {
  type: 'amap',
  height: '400px',
  zoom: 15,
  center: () => [116.397428, 39.90923] as [number, number],
  showCenterIcon: false,
});

const emit = defineEmits<{
  'location-selected': [result: LocationResult];
  'location-changed': [result: LocationResult];
}>();

// 处理位置选择事件
const handleLocationSelected = (result: LocationResult) => {
  emit('location-selected', result);
};

// 处理位置变化事件
const handleLocationChanged = (result: LocationResult) => {
  emit('location-changed', result);
};

// 定义组件名称
defineOptions({
  name: 'LocationPicker'
});
</script>

<style scoped>
.location-picker-wrapper {
  width: 100%;
}
</style>
