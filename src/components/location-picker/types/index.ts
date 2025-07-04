export type LatLng = [number, number];

export interface LocationPickerOptions {
  mapKey?: string;
  mapId?: string; // Google Maps Map ID for Advanced Markers support
  securityKey?: string;
  height?: string | number;
  zoom?: number;
  center?: LatLng;
  showCenterIcon?: boolean;
  centerIconUrl?: string;
  showDebugInfo?: boolean; // 是否显示调试信息
  locale?: string; // 语言设置，支持 'zh-CN' 和 'en-US'
}

export interface LocationResult {
  latlng: LatLng;
  address: string;
  formattedAddress: string;
  rawGeocodeResult?: any; // 原始地理编码结果，用于调试
}

export interface LocationPickerEvents {
  'location-selected': (result: LocationResult) => void;
  'location-changed': (result: LocationResult) => void;
} 