<template>
  <div class="location-picker">
    <!-- 顶部控制栏 -->
    <div class="top-controls">
      <!-- 搜索和坐标输入行 -->
      <div class="input-row">
        <!-- 搜索框 -->
        <div class="search-section">
          <div class="search-input-wrapper">
            <input
              v-model="searchKeyword"
              type="text"
              :placeholder="t.searchPlaceholder"
              class="search-input"
              @input="handleSearchInput"
              @keyup.enter="handleSearch"
              @focus="showSearchResults = true"
            />
            <button
              class="search-btn"
              @click="handleSearch"
              :disabled="!searchKeyword.trim()"
              :title="t.searchButton"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>

          <!-- 搜索结果 -->
          <div
            v-if="showSearchResults && searchResults.length > 0"
            class="search-results"
          >
            <div
              v-for="(result, index) in searchResults"
              :key="index"
              class="search-result-item"
              @click="selectSearchResult(result)"
            >
              <div class="result-name">{{ result.name }}</div>
              <div class="result-address">{{ result.address }}</div>
            </div>
          </div>
        </div>

        <!-- 坐标输入 -->
        <div class="coordinate-section">
          <div class="coordinate-inputs">
            <input
              v-model="longitudeInput"
              type="number"
              :placeholder="t.longitudePlaceholder"
              class="coordinate-input"
              step="any"
              @keyup.enter="handleCoordinateSearch"
            />
            <input
              v-model="latitudeInput"
              type="number"
              :placeholder="t.latitudePlaceholder"
              class="coordinate-input"
              step="any"
              @keyup.enter="handleCoordinateSearch"
            />
            <button
              class="coordinate-btn"
              @click="handleCoordinateSearch"
              :disabled="!isValidCoordinates"
              :title="t.coordinateButton"
            >
              {{ t.coordinateButton }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 地图容器 -->
    <div class="map-wrapper">
      <div
        ref="mapRef"
        class="map-container"
        :style="{ height: mapHeight }"
      ></div>

      <!-- 加载状态 -->
      <div v-if="mapState.loading" class="map-loading">
        <div class="loading-spinner"></div>
        <span>{{ t.loading }}</span>
      </div>
    </div>

    <!-- 位置信息 -->
    <div v-if="mapState.loaded" class="info-panel">
      <div class="info-content">
        <!-- 坐标信息 -->
        <div class="coordinate-info">
          <div class="coordinate-label">{{ t.coordinatesLabel }}</div>
          <div class="coordinate-value">
            <span class="coordinate-item">
              <span class="coordinate-type">{{ t.longitudeLabel }}:</span>
              <span class="coordinate-number">{{
                selectedLocation ? selectedLocation.latlng[0].toFixed(6) : "-"
              }}</span>
            </span>
            <span class="coordinate-item">
              <span class="coordinate-type">{{ t.latitudeLabel }}:</span>
              <span class="coordinate-number">{{
                selectedLocation ? selectedLocation.latlng[1].toFixed(6) : "-"
              }}</span>
            </span>
          </div>
        </div>

        <!-- 地址信息 -->
        <div
          v-if="selectedLocation && selectedLocation.address"
          class="address-info"
        >
          <div class="address-value">
            {{ selectedLocation.formattedAddress }}
          </div>
        </div>

        <div v-else-if="selectedLocation" class="address-placeholder">
          <div class="placeholder-icon">📝</div>
          <div class="placeholder-text">
            {{ t.addressPlaceholder }}
          </div>
        </div>

        <div v-else class="initial-placeholder">
          <div class="placeholder-icon">📍</div>
          <div class="placeholder-text">
            {{ t.initialPlaceholder }}
          </div>
        </div>

        <!-- 调试信息 -->
        <div
          v-if="
            showDebugInfo &&
            selectedLocation &&
            selectedLocation.rawGeocodeResult
          "
          class="debug-section"
        >
          <details>
            <summary>Debug Info</summary>
            <div class="debug-content">
              <div>
                Formatted Address:
                {{
                  selectedLocation.rawGeocodeResult.regeocode
                    ?.formattedAddress || "None"
                }}
              </div>
              <div>
                Address Components:
                {{
                  JSON.stringify(
                    selectedLocation.rawGeocodeResult.regeocode
                      ?.addressComponent
                  ) || "None"
                }}
              </div>
            </div>
          </details>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button
          class="action-btn primary-btn"
          @click="confirmLocation"
          :disabled="!selectedLocation || isResolvingAddress"
        >
          <span v-if="isResolvingAddress" class="loading-icon">⏳</span>
          {{ isResolvingAddress ? t.resolving : t.confirmLocation }}
        </button>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="mapState.error" class="error-message">
      {{ mapState.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  nextTick,
  watch,
} from "vue";
import type {
  LocationPickerOptions,
  LocationResult,
  LatLng,
} from "../../types";
import { getLocale } from "../../locales";

// 声明全局AMap对象
declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: any;
  }
}

const props = withDefaults(defineProps<LocationPickerOptions>(), {
  height: "400px",
  zoom: 15,
  center: () => [116.397428, 39.90923] as LatLng,
  showDebugInfo: false,
  locale: "en-US",
});

// 获取国际化文本
const t = computed(() => getLocale(props.locale));

const emit = defineEmits<{
  "location-selected": [result: LocationResult];
  "location-changed": [result: LocationResult];
}>();

// 响应式数据
const mapRef = ref<HTMLDivElement>();
const map = ref<any>(null);
const geocoder = ref<any>(null);
const placeSearch = ref<any>(null);
const selectedLocation = ref<LocationResult | null>(null);
const isResolvingAddress = ref(false);

// 标记管理 - 使用单一标记引用
const currentMarker = ref<any>(null);
const markers = ref<any[]>([]);

// 搜索相关数据
const searchKeyword = ref("");
const searchResults = ref<any[]>([]);
const searchTimeout = ref<number | null>(null);
const showSearchResults = ref(false);

// 经纬度输入相关数据
const longitudeInput = ref("");
const latitudeInput = ref("");

// 地图状态
const mapState = reactive({
  loading: false,
  loaded: false,
  error: "",
});

// 计算属性
const mapHeight = computed(() => {
  const height = props.height;
  if (typeof height === "number") {
    return height + "px";
  }
  return height;
});

const isValidCoordinates = computed(() => {
  const lng = parseFloat(longitudeInput.value);
  const lat = parseFloat(latitudeInput.value);
  return (
    !isNaN(lng) &&
    !isNaN(lat) &&
    lng >= -180 &&
    lng <= 180 &&
    lat >= -90 &&
    lat <= 90
  );
});

// 清除所有标记
const clearAllMarkers = () => {
  // 清除当前标记
  if (currentMarker.value) {
    try {
      currentMarker.value.setMap(null);
    } catch (error) {
      // 忽略清除错误
    }
  }

  // 清除所有标记数组中的标记
  markers.value.forEach((marker) => {
    try {
      if (marker) {
        marker.setMap(null);
      }
    } catch (error) {
      // 忽略清除错误
    }
  });

  // 清空数组和引用
  markers.value = [];
  currentMarker.value = null;
};

// 添加标记
const addMarker = (position: any, title: string) => {
  // 先清除所有标记
  clearAllMarkers();

  // 确保地图已加载
  if (!map.value) {
    return null;
  }

  // 验证坐标有效性
  let validPosition;
  if (position && typeof position === "object") {
    if (position.lng !== undefined && position.lat !== undefined) {
      // 检查坐标是否为有效数字
      if (isNaN(position.lng) || isNaN(position.lat)) {
        return null;
      }
      validPosition = position;
    } else if (Array.isArray(position) && position.length === 2) {
      // 如果是数组格式 [lng, lat]
      if (isNaN(position[0]) || isNaN(position[1])) {
        return null;
      }
      validPosition = { lng: position[0], lat: position[1] };
    } else {
      return null;
    }
  } else {
    return null;
  }

  try {
    // 创建新标记 - 使用最简单的配置
    const marker = new window.AMap.Marker({
      position: validPosition,
      map: map.value,
    });

    // 设置当前标记
    currentMarker.value = marker;
    markers.value.push(marker);

    return marker;
  } catch (error) {
    console.error("创建标记失败:", error);
    return null;
  }
};

// 监听点击外部关闭搜索结果
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".search-section")) {
    showSearchResults.value = false;
  }
};

// 解析地址信息
const resolveAddress = async (latlng: LatLng): Promise<LocationResult> => {
  return new Promise((resolve) => {
    if (!geocoder.value) {
      resolve({
        latlng,
        address: "",
        formattedAddress: `Coordinates: ${latlng[0].toFixed(
          6
        )}, ${latlng[1].toFixed(6)}`,
      });
      return;
    }

    geocoder.value.getAddress(latlng, (status: string, result: any) => {
      if (status === "complete" && result.regeocode) {
        resolve({
          latlng,
          address: result.regeocode.formattedAddress,
          formattedAddress: result.regeocode.formattedAddress,
          rawGeocodeResult: result,
        });
      } else {
        resolve({
          latlng,
          address: "",
          formattedAddress: `Coordinates: ${latlng[0].toFixed(
            6
          )}, ${latlng[1].toFixed(6)}`,
          rawGeocodeResult: result,
        });
      }
    });
  });
};


const initialCenter = () => {
  if (!map.value || !props.center) return;
  
  // 设置地图中心
  map.value.setCenter(props.center);
  
  // 解析地址
  resolveAddress(props.center).then((result) => {
    selectedLocation.value = result;
  });

  // 添加初始标记
  const lnglat = new window.AMap.LngLat(props.center[0], props.center[1]);
  addMarker(lnglat, "Initial Location");
};

// 初始化地图
const initMap = async () => {
  if (!mapRef.value) return;

  mapState.loading = true;
  mapState.error = "";

  try {
    // 配置安全码
    if (props.securityKey) {
      window._AMapSecurityConfig = {
        securityJsCode: props.securityKey,
      };
    }

    // 加载SDK
    const AMap = await loadAmapSDK();

    // 创建地图
    map.value = new AMap.Map(mapRef.value, {
      viewMode: "2D",
      zoom: props.zoom,
      center: props.center,
      mapStyle: "amap://styles/normal",
    });

    // 创建地理编码器
    geocoder.value = new AMap.Geocoder();

    // 创建地点搜索服务
    try {
      placeSearch.value = new AMap.PlaceSearch({
        pageSize: 10,
        pageIndex: 1,
        city: "全国",
        type: "",
        extensions: "all",
      });
    } catch (error) {
      placeSearch.value = null;
    }

    // 确保地图初始化时清除所有标记
    clearAllMarkers();

    // 监听地图点击事件
    map.value.on("click", handleMapClick);

    // 等待地图完全加载后再初始化中心点
    map.value.on('complete', () => {
      setTimeout(() => {
        initialCenter();
      }, 500);
    });

    mapState.loaded = true;
    mapState.loading = false;
  } catch (error) {
    mapState.loading = false;
    mapState.error =
      error instanceof Error ? error.message : "Map initialization failed";
  }
};

// 加载高德地图SDK
const loadAmapSDK = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap);
      return;
    }

    // 使用 AMapLoader 加载
    import("@amap/amap-jsapi-loader")
      .then(({ default: AMapLoader }) => {
        // 配置安全码
        if (props.securityKey) {
          window._AMapSecurityConfig = {
            securityJsCode: props.securityKey,
          };
        }

        AMapLoader.load({
          key: props.mapKey || "",
          version: "2.0",
          plugins: [
            "AMap.Geocoder",
            "AMap.PlaceSearch",
            "AMap.AutoComplete",
            "AMap.Geolocation",
          ],
        })
          .then((AMap) => {
            window.AMap = AMap;
            resolve(AMap);
          })
          .catch((error) => {
            reject(new Error("AMap SDK loading failed: " + error.message));
          });
      })
      .catch((error) => {
        reject(new Error("AMapLoader loading failed: " + error.message));
      });
  });
};

// 处理地图点击事件
const handleMapClick = (event: any) => {
  const lnglat = event.lnglat;

  // 验证点击坐标
  if (!lnglat || isNaN(lnglat.lng) || isNaN(lnglat.lat)) {
    return;
  }

  const latlng: LatLng = [lnglat.lng, lnglat.lat];

  // 移动地图中心到点击位置
  map.value.setCenter(latlng);

  // 添加标记
  const marker = addMarker(lnglat, "Selected Location");

  if (!marker) {
    return;
  }

  const locationResult: LocationResult = {
    latlng,
    address: "",
    formattedAddress: `Coordinates: ${latlng[0].toFixed(
      6
    )}, ${latlng[1].toFixed(6)}`,
  };

  selectedLocation.value = locationResult;
  emit("location-changed", locationResult);
};

// 确认选择位置
const confirmLocation = async () => {
  if (!selectedLocation.value) return;

  isResolvingAddress.value = true;

  try {
    const resolvedLocation = await resolveAddress(
      selectedLocation.value.latlng
    );
    selectedLocation.value = resolvedLocation;
    emit("location-selected", resolvedLocation);
  } catch (error) {
    console.error("Address resolution failed:", error);
    emit("location-selected", selectedLocation.value);
  } finally {
    isResolvingAddress.value = false;
  }
};

// 处理经纬度搜索
const handleCoordinateSearch = async () => {
  if (!isValidCoordinates.value || !map.value) return;

  const lng = parseFloat(longitudeInput.value);
  const lat = parseFloat(latitudeInput.value);
  const latlng: LatLng = [lng, lat];

  // 移动地图到指定坐标
  map.value.setCenter(latlng);
  map.value.setZoom(16);

  // 添加标记
  const marker = addMarker({ lng, lat }, "Selected Location");

  if (!marker) {
    return;
  }

  const locationResult: LocationResult = {
    latlng,
    address: "",
    formattedAddress: `Coordinates: ${latlng[0].toFixed(
      6
    )}, ${latlng[1].toFixed(6)}`,
  };

  selectedLocation.value = locationResult;
  emit("location-changed", locationResult);
};

// 处理搜索输入
const handleSearchInput = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = window.setTimeout(() => {
    if (searchKeyword.value.trim()) {
      handleSearch();
    } else {
      searchResults.value = [];
    }
  }, 300);
};

// 执行搜索
const handleSearch = () => {
  if (!searchKeyword.value.trim()) return;

  // 如果有 PlaceSearch 服务，使用它
  if (placeSearch.value) {
    placeSearch.value.search(
      searchKeyword.value,
      (status: string, result: any) => {
        if (status === "complete" && result.poiList) {
          searchResults.value = result.poiList.pois.map((poi: any) => ({
            name: poi.name,
            address: poi.address,
            location: poi.location,
            type: poi.type,
          }));
        } else {
          searchResults.value = [];
        }
      }
    );
  } else {
    // 备用方案：使用地理编码器搜索
    if (geocoder.value) {
      geocoder.value.getLocation(
        searchKeyword.value,
        (status: string, result: any) => {
          if (status === "complete" && result.geocodes) {
            searchResults.value = result.geocodes.map((geocode: any) => ({
              name: geocode.formattedAddress,
              address: geocode.formattedAddress,
              location: geocode.location,
              type: "address",
            }));
          } else {
            searchResults.value = [];
          }
        }
      );
    }
  }
};

// 选择搜索结果
const selectSearchResult = (result: any) => {
  if (!map.value || !result.location) return;

  // 验证搜索结果坐标
  if (
    !result.location.lng ||
    !result.location.lat ||
    isNaN(result.location.lng) ||
    isNaN(result.location.lat)
  ) {
    return;
  }

  // 移动地图到选中位置
  map.value.setCenter(result.location);
  map.value.setZoom(16);

  // 添加标记
  const marker = addMarker(result.location, "Selected Location");

  if (!marker) {
    return;
  }

  const latlng: LatLng = [result.location.lng, result.location.lat];
  const locationResult: LocationResult = {
    latlng,
    address: result.address,
    formattedAddress: result.address,
  };

  selectedLocation.value = locationResult;
  emit("location-changed", locationResult);

  searchResults.value = [];
  searchKeyword.value = result.name;
  showSearchResults.value = false;
};

// 组件挂载
onMounted(() => {
  nextTick(() => {
    initMap();
    document.addEventListener("click", handleClickOutside);
  });
});

// 组件卸载
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);

  // 强制清除所有标记
  if (currentMarker.value) {
    try {
      currentMarker.value.setMap(null);
    } catch (error) {
      // 忽略清除错误
    }
    currentMarker.value = null;
  }

  if (markers.value.length > 0) {
    markers.value.forEach((marker) => {
      try {
        if (marker) {
          marker.setMap(null);
        }
      } catch (error) {
        // 忽略清除错误
      }
    });
    markers.value = [];
  }
});
</script>

<style scoped lang="scss">
.location-picker {
  position: relative;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  .top-controls {
    padding: 12px;

    .input-row {
      display: flex;
      gap: 12px;

      .search-section {
        flex: 1;
        position: relative;

        .search-input-wrapper {
          display: flex;
          align-items: center;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          overflow: hidden;

          .search-input {
            flex: 1;
            padding: 10px 12px;
            border: none;
            outline: none;
            font-size: 14px;
            background: transparent;

            &::placeholder {
              color: #6c757d;
            }
          }

          .search-btn {
            padding: 10px 12px;
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            transition: background 0.2s;

            &:hover {
              background: #0056b3;
            }

            &:disabled {
              background: #6c757d;
              cursor: not-allowed;
            }
          }
        }

        .search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          max-height: 200px;
          overflow-y: auto;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

          .search-result-item {
            padding: 10px 12px;
            cursor: pointer;
            border-bottom: 1px solid #f8f9fa;

            &:last-child {
              border-bottom: none;
            }

            &:hover {
              background: #f8f9fa;
            }

            .result-name {
              font-weight: 500;
              margin-bottom: 2px;
              color: #212529;
            }

            .result-address {
              font-size: 12px;
              color: #6c757d;
            }
          }
        }
      }

      .coordinate-section {
        min-width: 280px;

        .coordinate-inputs {
          display: flex;
          gap: 8px;

          .coordinate-input {
            flex: 1;
            padding: 10px 12px;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            font-size: 14px;
            background: #f8f9fa;

            &:focus {
              outline: none;
              border-color: #007bff;
              background: #fff;
            }

            &::placeholder {
              color: #6c757d;
            }
          }

          .coordinate-btn {
            padding: 10px 16px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            white-space: nowrap;
            transition: background 0.2s;

            &:hover {
              background: #218838;
            }

            &:disabled {
              background: #6c757d;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }

  .map-wrapper {
    position: relative;

    .map-container {
      width: 100%;
    }

    .map-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.9);
      padding: 16px;
      border-radius: 6px;
      color: #6c757d;

      .loading-spinner {
        width: 24px;
        height: 24px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    }
  }

  .info-panel {
    background: #f8f9fa;
    border-top: 1px solid #dee2e6;

    .info-content {
      padding: 12px;

      .coordinate-info {
        margin-bottom: 12px;

        .coordinate-label {
          font-size: 12px;
          font-weight: 500;
          color: #6c757d;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .coordinate-value {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;

          .coordinate-item {
            display: flex;
            align-items: center;
            gap: 4px;
            background: #fff;
            padding: 8px 10px;
            border-radius: 6px;
            border: 1px solid #dee2e6;

            .coordinate-type {
              font-size: 12px;
              color: #6c757d;
              font-weight: 500;
            }

            .coordinate-number {
              font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
              font-size: 13px;
              color: #495057;
              font-weight: 500;
            }
          }
        }
      }

      .address-info {
        margin-bottom: 12px;

        .address-value {
          font-size: 14px;
          color: #212529;
          line-height: 1.4;
          background: #fff;
          padding: 10px 12px;
          border-radius: 6px;
          border: 1px solid #dee2e6;
        }
      }

      .address-placeholder {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        background: #e3f2fd;
        border-radius: 6px;
        border: 1px solid #bbdefb;

        .placeholder-icon {
          font-size: 16px;
        }

        .placeholder-text {
          font-size: 13px;
          color: #1976d2;
        }
      }

      .initial-placeholder {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 6px;
        border: 1px solid #dee2e6;
        text-align: center;
        justify-content: center;

        .placeholder-icon {
          font-size: 18px;
        }

        .placeholder-text {
          font-size: 14px;
          color: #6c757d;
        }
      }

      .debug-section {
        margin-top: 12px;
        border: 1px solid #dee2e6;
        border-radius: 4px;

        summary {
          padding: 8px 12px;
          background: #fff;
          cursor: pointer;
          font-weight: 500;
          font-size: 12px;
          border-bottom: 1px solid #dee2e6;
        }

        .debug-content {
          padding: 12px;
          background: #fff;
          font-size: 11px;
          font-family: monospace;
          color: #495057;

          div {
            margin-bottom: 4px;
          }
        }
      }
    }

    .action-buttons {
      padding: 12px;
      border-top: 1px solid #dee2e6;

      .action-btn {
        width: 100%;
        padding: 12px 16px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        .loading-icon {
          animation: spin 1s linear infinite;
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        &.primary-btn {
          background: #007bff;
          color: white;

          &:hover:not(:disabled) {
            background: #0056b3;
          }
        }
      }
    }
  }

  .error-message {
    margin: 12px;
    padding: 10px 12px;
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    font-size: 12px;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .location-picker {
    .top-controls {
      .input-row {
        flex-direction: column;
        gap: 8px;

        .coordinate-section {
          min-width: auto;
        }
      }
    }

    .info-panel {
      .info-content {
        .coordinate-info {
          .coordinate-value {
            flex-direction: column;
            gap: 8px;

            .coordinate-item {
              justify-content: space-between;
            }
          }
        }
      }
    }
  }
}
</style>
