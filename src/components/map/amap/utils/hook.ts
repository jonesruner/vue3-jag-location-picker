import { ref, reactive } from "vue"
import AMapLoader from '@amap/amap-jsapi-loader'
import type { MapOptions, LatLng } from "../../types"

// 声明全局AMap对象
declare global {
  interface Window {
    AMap: any
    _AMapSecurityConfig: any
  }
}

export const useAmap = () => {
    const amapRef = ref<HTMLDivElement>()
    const map = ref<any>(null)
    const geocoder = ref<any>(null)
    const marker = ref<any>(null)
    const initialCenter = ref<LatLng>([116.397428, 39.90923])
    
    // 保存props中的设置
    const mapSettings = reactive({
        zoom: 15,
        center: [116.397428, 39.90923] as LatLng,
        showCenterIcon: true,
        centerIconUrl: '',
        height: '250px' as string | number
    })
    
    // 地图状态
    const mapState = reactive({
        loading: false,
        error: '',
        initialAddress: ''
    })

    // 初始化高德地图
    const initAmap = async (props: MapOptions) => {
        if (!amapRef.value) return
        
        mapState.loading = true
        mapState.error = ''
        
        // 保存props设置
        mapSettings.zoom = props.zoom || 15
        mapSettings.center = props.center || [116.397428, 39.90923]
        mapSettings.showCenterIcon = props.showCenterIcon !== false
        mapSettings.centerIconUrl = props.centerIconUrl || ''
        mapSettings.height = props.height || '250px'
        
        initialCenter.value = mapSettings.center
        
        try {
            // 配置安全码
            if (props.securityKey) {
                window._AMapSecurityConfig = {
                    securityJsCode: props.securityKey
                }
            }
            
            // 加载SDK
            await loadAmapSDK(props.mapKey)
            
            // 创建地图
            map.value = new window.AMap.Map(amapRef.value, {
                viewMode: '3D',
                zoom: mapSettings.zoom,
                center: initialCenter.value
            })
            
            // 创建标记（如果启用）
            if (mapSettings.showCenterIcon) {
                createCenterMarker(initialCenter.value)
            }
            
            // 创建地理编码器并解析地址
            geocoder.value = new window.AMap.Geocoder()
            geocoder.value.getAddress(initialCenter.value, (status: string, result: any) => {
                if (status === 'complete' && result.regeocode) {
                    mapState.initialAddress = result.regeocode.formattedAddress
                }
            })
            
            mapState.loading = false
        } catch (error) {
            mapState.loading = false
            mapState.error = error instanceof Error ? error.message : '地图初始化失败'
        }
    }

    // 加载SDK
    const loadAmapSDK = (key?: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (window.AMap) {
                resolve()
                return
            }
            
            AMapLoader.load({
                key: key || '',
                version: '2.0',
                plugins: ['AMap.Geocoder']
            }).then((AMap) => {
                window.AMap = AMap
                resolve()
            }).catch((e) => {
                reject(new Error('SDK加载失败: ' + e.message))
            })
        })
    }

    // 创建中心点标记
    const createCenterMarker = (center: LatLng) => {
        if (!map.value) return
        
        const markerOptions: any = {
            position: center
        }
        
        // 如果设置了自定义图标
        if (mapSettings.centerIconUrl) {
            markerOptions.icon = new window.AMap.Icon({
                size: new window.AMap.Size(32, 32), // 设置图标大小
                image: mapSettings.centerIconUrl,
                imageSize: new window.AMap.Size(32, 32)
            })
        }
        
        marker.value = new window.AMap.Marker(markerOptions)
        marker.value.setMap(map.value)
    }

    // 回到初始中心点
    const locateToCenter = () => {
        if (map.value) {
            // 使用保存的zoom级别
            map.value.setZoom(mapSettings.zoom)
            map.value.setCenter(initialCenter.value)
            
            // 更新标记位置（如果存在）
            if (marker.value) {
                marker.value.setPosition(initialCenter.value)
            }
        }
    }

    return {
        amapRef,
        mapState,
        mapSettings,
        initAmap,
        locateToCenter
    }
}
