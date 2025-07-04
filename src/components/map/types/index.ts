export type MapType = 'amap' | 'gmap'

export type LatLng = [number, number]

export type MapOptions = {
  type?: MapType
  zoom?: number
  mapKey?: string
  mapId?: string // Google Maps Map ID for Advanced Markers support
  securityKey?: string
  center?: LatLng
  showLocationIcon?: boolean // 是否显示定位按钮
  showCenterIcon?: boolean // 是否在中心点显示图标
  centerIconUrl?: string // 中心点图标URL
  height?: string | number // 地图高度
  locale?: string // 语言设置，支持 'zh-CN' 和 'en-US'
}

// 高德地图相关类型
export interface AmapMap {
  setCenter: (center: LatLng) => void
  setZoom: (zoom: number) => void
  getCenter: () => LatLng
  getZoom: () => number
  on: (event: string, callback: Function) => void
  off: (event: string, callback: Function) => void
  add: (overlay: any) => void
  remove: (overlay: any) => void
  addControl: (control: any) => void
  removeControl: (control: any) => void
}

export interface AmapGeocoder {
  getAddress: (location: LatLng, callback: (status: string, result: any) => void) => void
  getLocation: (address: string, callback: (status: string, result: any) => void) => void
}

export interface AmapMarker {
  setPosition: (position: LatLng) => void
  getPosition: () => LatLng
  setIcon: (icon: string) => void
  setOffset: (offset: [number, number]) => void
}

export interface GeocoderResult {
  status: string
  info: string
  infocode: string
  regeocode: {
    formattedAddress: string
    addressComponent: {
      country: string
      province: string
      city: string
      district: string
      street: string
      number: string
    }
    pois: Array<{
      name: string
      type: string
      distance: string
      location: LatLng
    }>
  }
}
