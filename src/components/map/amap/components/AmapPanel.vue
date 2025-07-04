<template>
  <div class="map-content">
    <div class="map-box" ref="amapRef" :style="{ height: mapHeight }">
      <button
        v-if="mapSettings.showCenterIcon"
        class="center-btn"
        @click="locateToCenter"
        :title="t.centerButtonTitle"
      >
        <img
          style="width: 16px; height: 16px"
          :src="locationIcon"
          :alt="t.centerButtonTitle"
        />
      </button>
      <button class="share-btn" @click="shareLocation" :title="t.shareButtonTitle">
        <img style="width: 16px; height: 16px" :src="copyIcon" :alt="t.shareButtonTitle" />
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
import { computed, ref, onMounted, nextTick } from "vue";
import { useAmap } from "../utils/hook";
import type { MapOptions, LatLng } from "../../types";
import { getMapLocale } from "../../locales";
import locationIcon from "../icons/location.svg";
import copyIcon from "../icons/copy.svg";

defineOptions({
  name: "AmapPanel",
});

const props = withDefaults(defineProps<MapOptions>(), {
  center: () => [116.397428, 39.90923] as LatLng,
  zoom: 15,
  showCenterIcon: true,
  locale: "en-US",
});

// 获取国际化文本
const t = computed(() => getMapLocale(props.locale));

const { amapRef, mapState, mapSettings, initAmap, locateToCenter } = useAmap();

const showShareSuccess = ref(false);
const mapHeight = computed(() => {
  const height = mapSettings.height;
  if (typeof height === "number") {
    return height + "px";
  }
  return height;
});

const generateAmapLink = () => {
  const [lng, lat] = mapSettings.center;
  const address = mapState.initialAddress || "";
  return `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(
    address
  )}&src=mypage&coordinate=gaode&callnative=0`;
};

const shareLocation = async () => {
  try {
    const link = generateAmapLink();
    await navigator.clipboard.writeText(link);
    showShareSuccess.value = true;
    setTimeout(() => {
      showShareSuccess.value = false;
    }, 2000);
  } catch (error) {
    fallbackCopy(generateAmapLink());
  }
};

const fallbackCopy = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand("copy");
    showShareSuccess.value = true;
    setTimeout(() => {
      showShareSuccess.value = false;
    }, 2000);
  } catch (error) {}
  document.body.removeChild(textArea);
};

onMounted(() => {
  nextTick(() => {
    console.log("initAmap", props);
    initAmap(props);
  });
});
</script>

<style scoped lang="scss">
.map-content {
  .map-box {
    width: 100%;
    min-height: 300px;
    background-color: #f5f5f5;
    position: relative;
    .center-btn,
    .share-btn {
      position: absolute;
      width: 32px;
      height: 32px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.9);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.2s ease;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      &:hover {
        background: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transform: translateY(-1px);
      }
    }
    .center-btn {
      top: 12px;
      right: 12px;
    }
    .share-btn {
      top: 12px;
      right: 52px;
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
