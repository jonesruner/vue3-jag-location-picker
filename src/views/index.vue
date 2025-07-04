<script setup lang="ts">
const Map = defineAsyncComponent(() => import("../components/map/index.vue"));
const LocationPicker = defineAsyncComponent(
  () => import("../components/location-picker/index.vue")
);
import { ref, defineAsyncComponent } from "vue";
import type { LocationResult } from "../components/location-picker/types";

const selectedLocation = ref<LocationResult | null>(null);

const handleLocationSelected = (result: LocationResult) => {
  selectedLocation.value = result;
  console.log("位置已选择:", result);
};

const handleLocationChanged = (result: LocationResult) => {
  console.log("位置已变化:", result);
};

const params = {
  zoom: 15,
  center: [116.397029, 39.917839],
  mapKey: "xxx",
  securityKey: "xxx",
  googleMapKey: "xxx",
  showCenterIcon: true,
  locale: "zh-CN",
};
</script>

<template>
  <main>
    <div class="map-demo-wrappers">
      <Map
        key="1"
        type="amap"
        :height="260"
        :zoom="params.zoom"
        :center="params.center"
        :map-key="params.mapKey"
        :security-key="params.securityKey"
        :show-center-icon="params.showCenterIcon"
        :locale="params.locale"
      />
      <Map
        key="2"
        type="gmap"
        :height="260"
        :zoom="params.zoom"
        :center="params.center"
        :map-key="params.googleMapKey"
        :show-center-icon="params.showCenterIcon"
        :locale="params.locale"
      />
    </div>

    <div class="location-picker-demo">
      <div class="picker-section">
        <h3>高德地图位置选择器（带搜索功能）</h3>
        <LocationPicker
          type="amap"
          :height="260"
          :zoom="params.zoom"
          :center="params.center"
          :map-key="params.mapKey"
          :security-key="params.securityKey"
          @location-selected="handleLocationSelected"
          @location-changed="handleLocationChanged"
        />
      </div>
      <div class="picker-section">
        <h3>Google地图位置选择器（带搜索功能）</h3>
        <LocationPicker
          type="gmap"
          :height="260"
          :zoom="params.zoom"
          :center="params.center"
          :map-key="params.googleMapKey"
          :show-center-icon="params.showCenterIcon"
          :locale="params.locale"
          @location-selected="handleLocationSelected"
          @location-changed="handleLocationChanged"
        />
      </div>
    </div>

    <div v-if="selectedLocation" class="result-section">
      <h3>选择的位置信息：</h3>
      <div class="result-info">
        <div class="info-item">
          <span class="label">经度：</span>
          <span class="value">{{ selectedLocation.latlng[0].toFixed(6) }}</span>
        </div>
        <div class="info-item">
          <span class="label">纬度：</span>
          <span class="value">{{ selectedLocation.latlng[1].toFixed(6) }}</span>
        </div>
        <div class="info-item">
          <span class="label">地址：</span>
          <span class="value">{{ selectedLocation.formattedAddress }}</span>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
h1,
h2,
h3 {
  color: #333;
  margin-bottom: 20px;
}

.map-demo-wrappers {
  display: flex;
  gap: 10px;
  width: 100%;
  margin-bottom: 40px;
}

.location-picker-demo {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;

  .picker-section {
    flex: 1;

    h3 {
      margin-bottom: 15px;
      font-size: 16px;
    }
  }
}

.result-section {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;

  .result-info {
    .info-item {
      display: flex;
      margin-bottom: 10px;
      font-size: 14px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        color: #666;
        min-width: 60px;
        margin-right: 10px;
        font-weight: 500;
      }

      .value {
        color: #333;
        word-break: break-all;
        flex: 1;
      }
    }
  }
}
</style>
