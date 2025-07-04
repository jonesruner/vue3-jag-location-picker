import LocationPicker from './components/location-picker/index.vue'
import Map from './components/map/index.vue'
import type { LocationPickerOptions, LocationResult, LatLng } from './components/location-picker/types'
import type { 
  MapOptions, 
  MapType, 
  AmapMap, 
  AmapGeocoder, 
  AmapMarker, 
  GeocoderResult 
} from './components/map/types'

// 导入样式文件
import './assets/location-picker.css'

// 导出组件
export { LocationPicker, Map }

// 导出类型
export type { 
  LocationPickerOptions, 
  LocationResult, 
  LatLng, 
  MapOptions,
  MapType,
  AmapMap,
  AmapGeocoder,
  AmapMarker,
  GeocoderResult
}

// 默认导出
export default LocationPicker

// 为 Vue 应用提供安装方法
export const install = (app: any) => {
  app.component('LocationPicker', LocationPicker)
  app.component('Map', Map)
}

// 自动安装
if (typeof window !== 'undefined' && (window as any).Vue) {
  (window as any).Vue.use({ install })
} 