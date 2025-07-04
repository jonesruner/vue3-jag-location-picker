export interface LocaleMessages {
  // 搜索相关
  searchPlaceholder: string
  searchButton: string
  searchResults: string
  searchResultsCount: string
  
  // 坐标输入
  longitudePlaceholder: string
  latitudePlaceholder: string
  coordinateButton: string
  
  // 坐标显示
  coordinatesLabel: string
  longitudeLabel: string
  latitudeLabel: string
  
  // 地址相关
  addressLabel: string
  addressPlaceholder: string
  initialPlaceholder: string
  
  // 按钮
  confirmLocation: string
  resolving: string
  
  // 加载状态
  loading: string
  
  // 错误信息
  mapInitError: string
  geocodeError: string
}

export const locales: Record<string, LocaleMessages> = {
  'zh-CN': {
    // 搜索相关
    searchPlaceholder: '搜索地址或地点...',
    searchButton: '搜索',
    searchResults: '搜索结果',
    searchResultsCount: '个结果',
    
    // 坐标输入
    longitudePlaceholder: '经度',
    latitudePlaceholder: '纬度',
    coordinateButton: '定位',
    
    // 坐标显示
    coordinatesLabel: '坐标',
    longitudeLabel: '经度',
    latitudeLabel: '纬度',
    
    // 地址相关
    addressLabel: '地址',
    addressPlaceholder: '点击"确认位置"获取详细地址',
    initialPlaceholder: '点击地图或搜索位置开始选择',
    
    // 按钮
    confirmLocation: '确认位置',
    resolving: '解析中...',
    
    // 加载状态
    loading: '加载中...',
    
    // 错误信息
    mapInitError: '地图初始化失败',
    geocodeError: '地址解析失败'
  },
  
  'en-US': {
    // 搜索相关
    searchPlaceholder: 'Search address or place...',
    searchButton: 'Search',
    searchResults: 'Search Results',
    searchResultsCount: 'result',
    
    // 坐标输入
    longitudePlaceholder: 'Longitude',
    latitudePlaceholder: 'Latitude',
    coordinateButton: 'Go',
    
    // 坐标显示
    coordinatesLabel: 'Coordinates',
    longitudeLabel: 'Longitude',
    latitudeLabel: 'Latitude',
    
    // 地址相关
    addressLabel: 'Address',
    addressPlaceholder: 'Click "Confirm Location" to get detailed address',
    initialPlaceholder: 'Click on the map or search for a location to get started',
    
    // 按钮
    confirmLocation: 'Confirm Location',
    resolving: 'Resolving...',
    
    // 加载状态
    loading: 'Loading...',
    
    // 错误信息
    mapInitError: 'Map initialization failed',
    geocodeError: 'Address resolution failed'
  }
}

export const defaultLocale = 'en-US'

export function getLocale(locale?: string): LocaleMessages {
  return locales[locale || defaultLocale] || locales[defaultLocale]
} 