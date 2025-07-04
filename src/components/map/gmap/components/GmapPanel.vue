<template>
  <div class="map-content">
    <div class="map-box" ref="gmapRef" :style="{ height: mapHeight }"></div>
    <div class="map-controls">
      <button
        class="center-btn"
        @click="locateToCenter"
        :title="t.centerButtonTitle"
      >
        <img
          :src="locationIcon"
          style="width: 16px; height: 16px"
          :alt="t.centerButtonTitle"
        />
      </button>
      <button class="share-btn" @click="shareLocation" :title="t.shareButtonTitle">
        <img :src="copyIcon" style="width: 16px; height: 16px" :alt="t.shareButtonTitle" />
      </button>
    </div>
    <div v-if="mapState.initialAddress" class="location-info">
      <div class="info-row">
        <span class="label">{{ t.coordinatesLabel }}：</span>
        <span class="value"
          >{{ mapSettings.center[0].toFixed(6) }},
          {{ mapSettings.center[1].toFixed(6) }}</span
        >
      </div>
      <div class="info-row">
        <span class="label">{{ t.addressLabel }}：</span>
        <span class="value">{{ mapState.initialAddress }}</span>
      </div>
    </div>
    <div v-if="mapState.loading" class="loading">{{ t.loading }}</div>
    <div v-if="mapState.error" class="error">{{ mapState.error }}</div>
    <div v-if="showShareSuccess" class="share-success">
      {{ t.shareSuccess }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useGmap } from "../utils/hook";
import type { MapOptions, LatLng } from "../../types";
import { getMapLocale } from "../../locales";
import locationIcon from "../icons/location.svg";
import copyIcon from "../icons/copy.svg";

defineOptions({
  name: "GmapPanel",
});

const props = withDefaults(defineProps<MapOptions>(), {
  center: () => [116.397428, 39.90923] as LatLng,
  zoom: 15,
  showCenterIcon: true,
  locale: "en-US",
});

// 获取国际化文本
const t = computed(() => getMapLocale(props.locale));

const { gmapRef, mapState, mapSettings, initGmap, locateToCenter } = useGmap();

const showShareSuccess = ref(false);
const mapHeight = computed(() => {
  const height = mapSettings.height;
  if (typeof height === "number") {
    return height + "px";
  }
  return height;
});

const generateGmapLink = () => {
  const [lng, lat] = mapSettings.center;
  const address = mapState.initialAddress || "";
  // 使用更标准的Google Maps链接格式
  let link = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  if (address) {
    link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
  }
  return link;
};

const shareLocation = async () => {
  try {
    const link = generateGmapLink();
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(link);
      showShareSuccess.value = true;
      setTimeout(() => {
        showShareSuccess.value = false;
      }, 2000);
    } else {
      fallbackCopy(link);
    }
  } catch (error) {
    fallbackCopy(generateGmapLink());
  }
};

const fallbackCopy = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand("copy");
    if (successful) {
      showShareSuccess.value = true;
      setTimeout(() => {
        showShareSuccess.value = false;
      }, 2000);
    }
  } catch (error) {}
  document.body.removeChild(textArea);
}; 

onMounted(() => {
  initGmap(props);
});
</script>

<style scoped lang="scss">
.map-content {
  position: relative;
  .map-box {
    width: 100%;
    min-height: 300px;
    background-color: #f5f5f5;
  }
  .map-controls {
    position: absolute;
    top: 60px;
    right: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 1001;
    .center-btn,
    .share-btn,
    .test-btn {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.9);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      &:hover {
        background: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transform: translateY(-1px);
      }
    }
    .test-btn {
      width: 80px;
      font-size: 14px;
    }
  }
  .location-info {
    padding: 12px 16px;
    background: #fafafa;
    border-top: 1px solid #e0e0e0;
    .info-row {
      display: flex;
      margin-bottom: 6px;
      font-size: 13px;
      line-height: 1.5;
      &:last-child {
        margin-bottom: 0;
      }
      .label {
        color: #666;
        min-width: 40px;
        margin-right: 8px;
        font-weight: 500;
      }
      .value {
        color: #333;
        word-break: break-all;
        flex: 1;
      }
    }
  }
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.95);
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 13px;
    color: #666;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  .error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fef2f2;
    color: #dc2626;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 13px;
    z-index: 1000;
    border: 1px solid #fecaca;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  .share-success {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #f0fdf4;
    color: #16a34a;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 13px;
    z-index: 1000;
    border: 1px solid #bbf7d0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    animation: fadeInOut 2s ease-in-out;
  }
}
@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  80% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
}
</style>
