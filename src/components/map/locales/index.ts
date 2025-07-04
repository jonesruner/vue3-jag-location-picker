export interface MapLocaleMessages {
  // 按钮标题
  centerButtonTitle: string
  shareButtonTitle: string
  
  // 信息标签
  coordinatesLabel: string
  addressLabel: string
  
  // 状态信息
  loading: string
  shareSuccess: string
  
  // 错误信息
  mapInitError: string
  geocodeError: string
}

export const mapLocales: Record<string, MapLocaleMessages> = {
  'zh-CN': {
    // 按钮标题
    centerButtonTitle: '回到初始中心点',
    shareButtonTitle: '分享位置',
    
    // 信息标签
    coordinatesLabel: '坐标',
    addressLabel: '地址',
    
    // 状态信息
    loading: '地图加载中...',
    shareSuccess: '链接已复制到剪贴板！',
    
    // 错误信息
    mapInitError: '地图初始化失败',
    geocodeError: '地址解析失败'
  },
  
  'en-US': {
    // 按钮标题
    centerButtonTitle: 'Return to center',
    shareButtonTitle: 'Share location',
    
    // 信息标签
    coordinatesLabel: 'Coordinates',
    addressLabel: 'Address',
    
    // 状态信息
    loading: 'Loading map...',
    shareSuccess: 'Link copied to clipboard!',
    
    // 错误信息
    mapInitError: 'Map initialization failed',
    geocodeError: 'Address resolution failed'
  }
}

export const defaultMapLocale = 'en-US'

export function getMapLocale(locale?: string): MapLocaleMessages {
  return mapLocales[locale || defaultMapLocale] || mapLocales[defaultMapLocale]
} 