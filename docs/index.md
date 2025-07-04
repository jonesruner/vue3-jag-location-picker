# Vue3 Jag Location Picker

一个基于 Vue 3 的位置选择器组件库，支持 Google Maps 和 AMap (高德地图)。

## 特性

- 🗺️ **双地图支持**: Google Maps 和 AMap (高德地图)
- 📍 **交互式选择**: 点击地图选择位置
- 🔍 **地址搜索**: 搜索地点和地址
- 📊 **坐标输入**: 直接坐标输入支持
- 🎯 **标记管理**: 选中位置的视觉标记
- 🌐 **地址解析**: 获取详细地址信息
- 📱 **响应式设计**: 支持桌面和移动端
- 🎨 **可定制**: 灵活的样式和配置选项
- 🚀 **自动初始化**: 当提供 center 属性时自动初始化位置
- 🔄 **动态更新**: 实时响应 center 属性变化

## 安装

```bash
npm install vue3-jag-location-picker
```

## 导入样式

```javascript
// 在 main.js 或 main.ts 中
import 'vue3-jag-location-picker/style.css'
```

## 基本使用

### LocationPicker 组件

主要的位置选择器组件，提供完整的位置选择功能：

```vue
<template>
  <LocationPicker
    type="gmap"
    :map-key="googleMapsKey"
    :height="400"
    :zoom="15"
    :center="[116.397428, 39.90923]"
    @location-selected="handleLocationSelected"
  />
</template>

<script setup>
import { LocationPicker } from 'vue3-jag-location-picker'

const googleMapsKey = 'your-google-maps-api-key'

const handleLocationSelected = (result) => {
  console.log('选中的位置:', result)
  // result: { latlng: [lng, lat], address: '...', formattedAddress: '...' }
}
</script>
```

### Map 组件

独立的地图展示组件，用于简单的地图显示：

```vue
<template>
  <Map
    type="amap"
    :map-key="amapKey"
    :security-key="amapSecurityKey"
    :height="400"
    :zoom="15"
    :center="[116.397428, 39.90923]"
    :show-center-icon="true"
    locale="zh-CN"
  />
</template>

<script setup>
import { Map } from 'vue3-jag-location-picker'

const amapKey = 'your-amap-api-key'
const amapSecurityKey = 'your-amap-security-key'
</script>
```

## API 密钥设置

### Google Maps

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Maps JavaScript API 和 Places API
4. 创建凭据（API 密钥）
5. 为安全起见限制 API 密钥

### AMap (高德地图)

1. 访问 [AMap 开发者控制台](https://console.amap.com/)
2. 创建新应用
3. 获取 API 密钥和安全密钥
4. 配置域名白名单

## Props

### LocationPicker Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `type` | `'amap' \| 'gmap'` | `'amap'` | 地图提供商类型 |
| `mapKey` | `string` | - | 地图 API 密钥 |
| `securityKey` | `string` | - | 安全密钥（AMap 需要） |
| `height` | `string \| number` | `'400px'` | 地图高度 |
| `zoom` | `number` | `15` | 初始缩放级别 |
| `center` | `[number, number]` | `[116.397428, 39.90923]` | 初始中心坐标 |
| `showDebugInfo` | `boolean` | `false` | 显示调试信息 |
| `locale` | `string` | `'en-US'` | 语言设置（`'zh-CN'` 或 `'en-US'`） |

### Map Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `type` | `'amap' \| 'gmap'` | `'amap'` | 地图提供商类型 |
| `mapKey` | `string` | - | 地图 API 密钥 |
| `mapId` | `string` | - | Google 地图 ID（可选） |
| `securityKey` | `string` | - | 安全密钥（AMap 需要） |
| `height` | `string \| number` | `'400px'` | 地图高度 |
| `zoom` | `number` | `15` | 初始缩放级别 |
| `center` | `[number, number]` | `[116.397428, 39.90923]` | 初始中心坐标 |
| `showCenterIcon` | `boolean` | `false` | 显示中心指示器 |
| `showDebugInfo` | `boolean` | `false` | 显示调试信息 |
| `locale` | `string` | `'en-US'` | 语言设置（`'zh-CN'` 或 `'en-US'`） |

## Events

| 事件 | 载荷 | 描述 |
|------|------|------|
| `location-selected` | `LocationResult` | 用户确认位置选择时触发 |
| `location-changed` | `LocationResult` | 位置变化时触发（点击、搜索等） |

## 类型定义

```typescript
interface LocationResult {
  latlng: [number, number]; // [经度, 纬度]
  address: string;
  formattedAddress: string;
  rawGeocodeResult?: any; // 原始地理编码结果，用于调试
}

type LatLng = [number, number];
```

## 完整示例

### 动态位置切换

```vue
<template>
  <div>
    <div class="controls">
      <button @click="setBeijing">北京</button>
      <button @click="setShanghai">上海</button>
      <button @click="setNewYork">纽约</button>
    </div>
    
    <LocationPicker
      type="gmap"
      :map-key="googleMapsKey"
      :center="currentLocation"
      :height="400"
      locale="en-US"
      @location-selected="handleLocationSelected"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { LocationPicker } from 'vue3-jag-location-picker'

const googleMapsKey = 'your-google-maps-api-key'
const currentLocation = ref([116.397428, 39.90923])

const setBeijing = () => {
  currentLocation.value = [116.397428, 39.90923]
}

const setShanghai = () => {
  currentLocation.value = [121.4737, 31.2304]
}

const setNewYork = () => {
  currentLocation.value = [-74.006, 40.7128]
}

const handleLocationSelected = (result) => {
  console.log('Selected location:', result)
}
</script>
```

### 样式定制

```vue
<style>
/* 使用 CSS 变量 */
:root {
  --location-picker-border-radius: 12px;
  --location-picker-box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 使用深度选择器 */
:deep(.location-picker) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

:deep(.map-demo-wrappers) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
</style>
```

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT 