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
} from "../../../types";

// 声明全局Google Maps对象
declare global {
  interface Window {
    google: any;
  }
}

export const useGoogleMapHooks = (props: LocationPickerOptions, emit: any) => {
  // 响应式数据
  const mapRef = ref<HTMLDivElement>();
  const map = ref<any>(null);
  const geocoder = ref<any>(null);
  const placesService = ref<any>(null);
  const selectedLocation = ref<LocationResult | null>(null);
  const selectedMarker = ref<any>(null);
  const isResolvingAddress = ref(false);

  // 标记管理 - 使用单一标记引用
  const currentMarker = ref<any>(null);
  const markers = ref<any[]>([]);

  // 搜索相关数据
  const searchKeyword = ref("");
  const searchResults = ref<any[]>([]);
  const searchTimeout = ref<number | null>(null);
  const showSearchResults = ref(false);

  // 坐标输入相关数据
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
    // 清除当前标记 - 使用多种方法确保标记被移除
    if (currentMarker.value) {
      try {
        // 方法1: 从地图上移除
        if (currentMarker.value.setMap) {
          currentMarker.value.setMap(null);
        }

        // 方法2: 如果标记有remove方法，调用它
        if (
          currentMarker.value.remove &&
          typeof currentMarker.value.remove === "function"
        ) {
          currentMarker.value.remove();
        }

        // 方法3: 设置标记为不可见
        if (currentMarker.value.setVisible) {
          currentMarker.value.setVisible(false);
        }
      } catch (error) {
        console.error("清除当前标记时出错:", error);
      }
    }

    // 强制清除所有标记数组中的标记
    markers.value.forEach((marker, index) => {
      try {
        if (marker) {
          // 方法1: 从地图上移除
          if (marker.setMap) {
            marker.setMap(null);
          }

          // 方法2: 调用remove方法
          if (marker.remove && typeof marker.remove === "function") {
            marker.remove();
          }

          // 方法3: 设置不可见
          if (marker.setVisible) {
            marker.setVisible(false);
          }
        }
      } catch (error) {
        console.error(`清除标记数组中的第${index}个标记时出错:`, error);
      }
    });

    // 也清除selectedMarker
    if (selectedMarker.value) {
      try {
        if (selectedMarker.value.setMap) {
          selectedMarker.value.setMap(null);
        }
        if (
          selectedMarker.value.remove &&
          typeof selectedMarker.value.remove === "function"
        ) {
          selectedMarker.value.remove();
        }
        if (selectedMarker.value.setVisible) {
          selectedMarker.value.setVisible(false);
        }
      } catch (error) {
        console.error("清除selectedMarker时出错:", error);
      }
    }

    // 清空数组和引用
    markers.value = [];
    selectedMarker.value = null;
    currentMarker.value = null;
  };

  // 添加标记
  const addMarker = (position: any, title: string, color: string = "#007bff") => {
    // 先清除所有标记
    clearAllMarkers();

    // 确保地图已加载
    if (!map.value) {
      return null;
    }

    // 创建新标记
    const marker = new window.google.maps.Marker({
      position: position,
      map: map.value,
      title: title,
      icon: {
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        fillColor: color,
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: 1.5,
        anchor: { x: 12, y: 24 },
      },
      zIndex: 1000,
    });

    // 设置当前标记
    currentMarker.value = marker;
    markers.value.push(marker);
    selectedMarker.value = marker;

    return marker;
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

      const latLng = new window.google.maps.LatLng(latlng[1], latlng[0]);

      geocoder.value.geocode(
        { location: latLng },
        (results: any[], status: string) => {
          if (status === "OK" && results[0]) {
            resolve({
              latlng,
              address: results[0].formatted_address,
              formattedAddress: results[0].formatted_address,
              rawGeocodeResult: results[0],
            });
          } else {
            resolve({
              latlng,
              address: "",
              formattedAddress: `Coordinates: ${latlng[0].toFixed(
                6
              )}, ${latlng[1].toFixed(6)}`,
              rawGeocodeResult: results,
            });
          }
        }
      );
    });
  };

  // 初始化中心点
  const initialCenter = () => {
    if (!props.center || !map.value) return;

    const center = props.center as LatLng;

    // 添加标记（注意坐标顺序：lat, lng）
    addMarker(
      new window.google.maps.LatLng(center[1], center[0]),
      "Initial Location",
      "#007bff"
    );

    // 创建初始位置结果
    const locationResult: LocationResult = {
      latlng: center,
      address: "",
      formattedAddress: `Coordinates: ${center[0].toFixed(6)}, ${center[1].toFixed(6)}`,
    };

    selectedLocation.value = locationResult;
    emit("location-changed", locationResult);

    // 尝试解析地址
    if (geocoder.value) {
      geocoder.value.geocode(
        { location: { lat: center[1], lng: center[0] } },
        (results: any[], status: string) => {
          if (status === "OK" && results[0]) {
            const resolvedLocation: LocationResult = {
              latlng: center,
              address: results[0].formatted_address,
              formattedAddress: results[0].formatted_address,
              rawGeocodeResult: results[0],
            };
            selectedLocation.value = resolvedLocation;
            emit("location-changed", resolvedLocation);
          }
        }
      );
    }
  };

  // 初始化地图
  const initMap = async () => {
    if (!mapRef.value) return;

    mapState.loading = true;
    mapState.error = "";

    try {
      await loadGMapSDK();

      const mapOptions = {
        zoom: props.zoom,
        center: { lat: (props.center as LatLng)[1], lng: (props.center as LatLng)[0] },
        mapId: props.mapId,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: "greedy",
      };

      map.value = new window.google.maps.Map(mapRef.value, mapOptions);
      geocoder.value = new window.google.maps.Geocoder();
      placesService.value = new window.google.maps.places.PlacesService(
        map.value
      );

      // 监听地图事件
      map.value.addListener("click", handleMapClick);

      mapState.loaded = true;
      mapState.loading = false;

      // 等待地图完全加载后再初始化中心点
      setTimeout(() => {
        initialCenter();
      }, 100);
    } catch (error) {
      mapState.loading = false;
      mapState.error =
        error instanceof Error ? error.message : "Map initialization failed";
    }
  };

  // 加载Google Maps SDK
  const loadGMapSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        props.mapKey
      }&libraries=places,marker&language=${
        props.locale === "zh-CN" ? "zh-CN" : "en"
      }`;
      script.async = true;
      script.onload = () => {
        if (!props.mapId) {
          console.warn(
            "Map ID not provided. Advanced Markers require a valid Map ID."
          );
        }
        resolve();
      };
      script.onerror = () => {
        reject(new Error("Failed to load Google Maps SDK"));
      };
      document.head.appendChild(script);
    });
  };

  // 处理地图点击事件
  const handleMapClick = (event: any) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const latlng: LatLng = [lng, lat];

    // 将点击位置移动到地图中心，使用平滑动画
    if (map.value) {
      // 使用panTo方法实现平滑移动
      map.value.panTo(event.latLng);

      // 可选：调整缩放级别以更好地显示位置
      const currentZoom = map.value.getZoom();
      if (currentZoom < 14) {
        // 使用panTo和setZoom的组合实现平滑的缩放和移动
        map.value.panTo(event.latLng);
        setTimeout(() => {
          map.value.setZoom(14);
        }, 300);
      }
    }

    // 添加标记
    addMarker(event.latLng, "Selected Location", "#007bff");

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
      console.error("地址解析失败:", error);
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
    map.value.panTo({ lat, lng });
    map.value.setZoom(16);

    // 添加标记
    addMarker({ lat, lng }, "Selected Location", "#007bff");

    const locationResult: LocationResult = {
      latlng,
      address: "",
      formattedAddress: `Coordinates: ${latlng[0].toFixed(6)}, ${latlng[1].toFixed(6)}`,
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
    if (!searchKeyword.value.trim() || !placesService.value) return;

    const request = {
      query: searchKeyword.value,
      fields: ["name", "geometry", "formatted_address"],
    };

    placesService.value.findPlaceFromQuery(
      request,
      (results: any[], status: string) => {
        if (status === "OK" && results) {
          searchResults.value = results.map((place) => ({
            name: place.name,
            address: place.formatted_address,
            location: place.geometry.location,
          }));
          showSearchResults.value = true;
        } else {
          searchResults.value = [];
        }
      }
    );
  };

  // 选择搜索结果
  const selectSearchResult = (result: any) => {
    if (!map.value) return;

    const lat = result.location.lat();
    const lng = result.location.lng();
    const latlng: LatLng = [lng, lat];

    // 移动地图到搜索结果位置
    map.value.panTo(result.location);
    map.value.setZoom(16);

    // 添加标记
    addMarker(result.location, result.name, "#007bff");

    const locationResult: LocationResult = {
      latlng,
      address: result.address,
      formattedAddress: result.address,
    };

    selectedLocation.value = locationResult;
    emit("location-changed", locationResult);

    // 清除搜索结果
    searchResults.value = [];
    searchKeyword.value = result.name;
    showSearchResults.value = false;
  };

  // 监听地图状态变化
  watch(
    () => mapState.loaded,
    (isLoaded) => {
      if (isLoaded) {
        // 地图加载完成后，确保清除之前的标记
        clearAllMarkers();
      }
    }
  );

  // 监听 center 属性变化
  watch(
    () => props.center,
    async (newCenter, oldCenter) => {
      if (mapState.loaded && newCenter && 
          (newCenter[0] !== oldCenter?.[0] || newCenter[1] !== oldCenter?.[1])) {
        // 清除现有标记
        clearAllMarkers();
        
        // 移动到新位置
        if (map.value) {
          const latLng = new window.google.maps.LatLng(newCenter[1], newCenter[0]);
          map.value.panTo(latLng);
          map.value.setZoom(props.zoom);
        }
        
        // 初始化新位置
        await initialCenter();
      }
    },
    { deep: true }
  );

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

    // 强制清除所有标记 - 使用多重方法确保标记被移除
    if (currentMarker.value) {
      try {
        if (currentMarker.value.setMap) {
          currentMarker.value.setMap(null);
        }
        if (
          currentMarker.value.remove &&
          typeof currentMarker.value.remove === "function"
        ) {
          currentMarker.value.remove();
        }
        if (currentMarker.value.setVisible) {
          currentMarker.value.setVisible(false);
        }
      } catch (error) {
        console.error("卸载时清除当前标记出错:", error);
      }
      currentMarker.value = null;
    }

    if (markers.value.length > 0) {
      markers.value.forEach((marker, index) => {
        try {
          if (marker) {
            if (marker.setMap) {
              marker.setMap(null);
            }
            if (marker.remove && typeof marker.remove === "function") {
              marker.remove();
            }
            if (marker.setVisible) {
              marker.setVisible(false);
            }
          }
        } catch (error) {
          console.error(`卸载时清除第${index}个标记出错:`, error);
        }
      });
      markers.value = [];
    }

    if (selectedMarker.value) {
      try {
        if (selectedMarker.value.setMap) {
          selectedMarker.value.setMap(null);
        }
        if (
          selectedMarker.value.remove &&
          typeof selectedMarker.value.remove === "function"
        ) {
          selectedMarker.value.remove();
        }
        if (selectedMarker.value.setVisible) {
          selectedMarker.value.setVisible(false);
        }
      } catch (error) {
        console.error("卸载时清除selectedMarker出错:", error);
      }
      selectedMarker.value = null;
    }
  });
 
  return {
    // 响应式数据
    mapRef,
    map,
    selectedLocation,
    isResolvingAddress,
    searchKeyword,
    searchResults,
    showSearchResults,
    longitudeInput,
    latitudeInput,
    mapState,
    
    // 计算属性
    mapHeight,
    isValidCoordinates,
    
    // 方法
    clearAllMarkers,
    addMarker,
    handleClickOutside,
    resolveAddress,
    initialCenter,
    initMap,
    loadGMapSDK,
    handleMapClick,
    confirmLocation,
    handleCoordinateSearch,
    handleSearchInput,
    handleSearch,
    selectSearchResult,
  };
};