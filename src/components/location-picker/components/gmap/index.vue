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
          <div v-if="searchResults.length > 0" class="search-results">
            <div
              v-for="(result, index) in searchResults"
              :key="index"
              class="search-result-item"
              @click="selectSearchResult(result)"
            >
              <div class="result-name">{{ result.name }}</div>
              <div class="result-address">{{ result.address }}</div>
            </div>
            <div class="search-results-count">
              {{ searchResults.length }} {{ t.searchResultsCount
              }}{{ searchResults.length > 1 ? "s" : "" }}
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
        <!-- 坐标信息 - 始终显示 -->
        <div class="coordinate-info">
          <div class="coordinate-label">{{ t.coordinatesLabel }}</div>
          <div class="coordinate-value">
            <span class="coordinate-item">
              <span class="coordinate-type">{{ t.longitudeLabel }}:</span>
              <span class="coordinate-number">
                {{
                  selectedLocation ? selectedLocation.latlng[0].toFixed(6) : "-"
                }}
              </span>
            </span>
            <span class="coordinate-item">
              <span class="coordinate-type">{{ t.latitudeLabel }}:</span>
              <span class="coordinate-number">
                {{
                  selectedLocation ? selectedLocation.latlng[1].toFixed(6) : "-"
                }}
              </span>
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
                  selectedLocation.rawGeocodeResult.formatted_address || "None"
                }}
              </div>
              <div>
                Address Components:
                {{
                  JSON.stringify(
                    selectedLocation.rawGeocodeResult.address_components
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
import { computed } from "vue";
import type { LocationPickerOptions, LocationResult } from "../../types";
import { getLocale } from "../../locales";
import { useGoogleMapHooks } from "./utils/hooks";

const props = withDefaults(defineProps<LocationPickerOptions>(), {
  height: "400px",
  zoom: 15,
  center: () => [116.397428, 39.90923] as [number, number],
  showDebugInfo: false,
  locale: "en-US",
});

// 获取国际化文本
const t = computed(() => getLocale(props.locale));

const emit = defineEmits<{
  "location-selected": [result: LocationResult];
  "location-changed": [result: LocationResult];
}>();

// 使用 hooks
const {
  mapRef,
  selectedLocation,
  isResolvingAddress,
  searchKeyword,
  searchResults,
  showSearchResults,
  longitudeInput,
  latitudeInput,
  mapState,
  mapHeight,
  isValidCoordinates,
  confirmLocation,
  handleCoordinateSearch,
  handleSearchInput,
  handleSearch,
  selectSearchResult,
} = useGoogleMapHooks(props, emit);

// 定义组件名称
defineOptions({
  name: 'GmapLocationPicker'
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

          .search-results-count {
            padding: 8px 12px;
            font-size: 11px;
            color: #6c757d;
            background: #f8f9fa;
            border-top: 1px solid #dee2e6;
            text-align: center;
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

  .coordinate-panel {
    padding: 0 12px 12px;

    .coordinate-inputs {
      display: flex;
      gap: 8px;

      .coordinate-input {
        flex: 1;
        padding: 8px 10px;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        font-size: 14px;

        &:focus {
          outline: none;
          border-color: #007bff;
        }

        &::placeholder {
          color: #6c757d;
        }
      }

      .coordinate-btn {
        padding: 8px 12px;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;

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

        .address-label {
          font-size: 12px;
          font-weight: 500;
          color: #6c757d;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

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
