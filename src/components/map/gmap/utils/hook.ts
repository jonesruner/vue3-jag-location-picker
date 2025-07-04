import { ref, reactive } from "vue";
import type { MapOptions, LatLng } from "../../types";

// 声明全局Google Maps对象
declare global {
  interface Window {
    google: any;
  }
}

// 全局SDK加载状态
let sdkLoaded = false;
let sdkLoading = false;

export const useGmap = () => {
  const gmapRef = ref<HTMLDivElement>();
  const map = ref<any>(null);
  const geocoder = ref<any>(null);
  const marker = ref<any>(null);
  const initialCenter = ref<LatLng>([116.397428, 39.90923]);

  // 保存props中的设置
  const mapSettings = reactive({
    zoom: 15,
    center: [116.397428, 39.90923] as LatLng,
    showCenterIcon: true,
    centerIconUrl: "",
    height: "250px" as string | number,
  });

  // 地图状态
  const mapState = reactive({
    loading: false,
    error: "",
    initialAddress: "",
  });

  // 初始化Google地图
  const initGmap = async (props: MapOptions) => {
    if (!gmapRef.value) return;

    mapState.loading = true;
    mapState.error = "";

    // 保存props设置
    mapSettings.zoom = props.zoom || 15;
    mapSettings.center = props.center || [116.397428, 39.90923];
    mapSettings.showCenterIcon = props.showCenterIcon !== false;
    mapSettings.centerIconUrl = props.centerIconUrl || "";
    mapSettings.height = props.height || "250px";

    initialCenter.value = mapSettings.center;

    try {
      // 加载SDK
      await loadGmapSDK(props.mapKey);

      // 创建地图配置
      const mapOptions: any = {
        zoom: mapSettings.zoom,
        center: { lat: initialCenter.value[1], lng: initialCenter.value[0] },
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      };

      // 如果有 Map ID，使用它来支持 Advanced Markers
      if (props.mapId) {
        mapOptions.mapId = props.mapId;
      }

      // 创建地图
      map.value = new window.google.maps.Map(gmapRef.value, mapOptions);

      // 创建标记（如果启用）
      if (mapSettings.showCenterIcon) {
        createCenterMarker(initialCenter.value, props);
      }

      // 创建地理编码器并解析地址
      geocoder.value = new window.google.maps.Geocoder();
      geocoder.value.geocode(
        {
          location: {
            lat: initialCenter.value[1],
            lng: initialCenter.value[0],
          },
        },
        (results: any[], status: string) => {
          if (status === "OK" && results[0]) {
            mapState.initialAddress = results[0].formatted_address;
          }
        }
      );

      mapState.loading = false;
    } catch (error) {
      mapState.loading = false;
      mapState.error =
        error instanceof Error ? error.message : "地图初始化失败";
    }
  };

  // 加载SDK
  const loadGmapSDK = (key?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (sdkLoaded && window.google) {
        resolve();
        return;
      }

      if (sdkLoading) {
        // 如果正在加载，等待加载完成
        const checkLoaded = () => {
          if (sdkLoaded && window.google) {
            resolve();
          } else if (!sdkLoading) {
            reject(new Error("SDK加载失败"));
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }

      sdkLoading = true;

      // 创建script标签加载Google Maps API
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        key || ""
      }&libraries=geometry,places,marker&language=en`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        sdkLoaded = true;
        sdkLoading = false;
        resolve();
      };

      script.onerror = () => {
        sdkLoading = false;
        reject(new Error("Google Maps SDK加载失败"));
      };

      document.head.appendChild(script);
    });
  };

  // 创建中心点标记
  const createCenterMarker = (center: LatLng, props: MapOptions) => {
    if (!map.value) return;

    try {
      // 检查是否有 Map ID 和 Advanced Marker 支持
      const hasMapId = props.mapId && props.mapId.trim() !== '';
      const hasAdvancedMarkerSupport = window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement;
      
      if (hasMapId && hasAdvancedMarkerSupport) {
        // 使用新的 AdvancedMarkerElement API
        console.log('Using AdvancedMarkerElement with Map ID');
        const markerOptions: any = {
          position: { lat: center[1], lng: center[0] },
          map: map.value,
        };

        // 如果设置了自定义图标
        if (mapSettings.centerIconUrl) {
          markerOptions.content = new window.google.maps.marker.PinElement({
            background: mapSettings.centerIconUrl,
            scale: 1.2,
          });
        }

        marker.value = new window.google.maps.marker.AdvancedMarkerElement(markerOptions);
      } else {
        // 降级到旧的 Marker API
        if (!hasMapId) {
          console.warn('Map ID not provided, falling back to deprecated Marker API. Advanced Markers require a valid Map ID.');
        } else {
          console.warn('AdvancedMarkerElement not available, falling back to deprecated Marker API');
        }
        
        const markerOptions: any = {
          position: { lat: center[1], lng: center[0] },
          map: map.value,
        };

        if (mapSettings.centerIconUrl) {
          markerOptions.icon = {
            url: mapSettings.centerIconUrl,
            scaledSize: new window.google.maps.Size(32, 32),
          };
        }

        marker.value = new window.google.maps.Marker(markerOptions);
      }
    } catch (error) {
      console.error('Error creating marker:', error);
      // 如果新API失败，尝试使用旧API
      try {
        console.log('Falling back to deprecated Marker API due to error');
        const markerOptions: any = {
          position: { lat: center[1], lng: center[0] },
          map: map.value,
        };

        if (mapSettings.centerIconUrl) {
          markerOptions.icon = {
            url: mapSettings.centerIconUrl,
            scaledSize: new window.google.maps.Size(32, 32),
          };
        }

        marker.value = new window.google.maps.Marker(markerOptions);
      } catch (fallbackError) {
        console.error('Fallback marker creation also failed:', fallbackError);
      }
    }
  };

  // 回到初始中心点
  const locateToCenter = () => {
    if (map.value) {
      // 使用保存的zoom级别
      map.value.setZoom(mapSettings.zoom);
      map.value.setCenter({
        lat: initialCenter.value[1],
        lng: initialCenter.value[0],
      });

      // 更新标记位置（如果存在）
      if (marker.value) {
        if (marker.value.position) {
          // 新API
          marker.value.position = {
            lat: initialCenter.value[1],
            lng: initialCenter.value[0],
          };
        } else if (marker.value.setPosition) {
          // 旧API
          marker.value.setPosition({
            lat: initialCenter.value[1],
            lng: initialCenter.value[0],
          });
        }
      }
    }
  };

  return {
    gmapRef,
    mapState,
    mapSettings,
    initGmap,
    locateToCenter,
  };
};
