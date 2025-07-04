# 位置选择器组件

一个基于 Vue 3 + TypeScript 的位置选择器组件，支持高德地图和 Google 地图。

## 功能特性

- 🗺️ 支持高德地图和 Google 地图
- 🔍 地点搜索功能（高德地图）
- 📍 点击地图获取坐标
- 🎯 中心十字线指示器
- 📱 响应式设计
- 🎨 现代化 UI 界面
- 🚀 自动初始化位置（当 center 属性有值时）
- 🔄 实时响应 center 属性变化

## 安装依赖

```bash
npm install @amap/amap-jsapi-loader
```

## 使用方法

### 基本使用

```vue
<template>
  <LocationPicker
    type="amap"
    :height="500"
    :zoom="15"
    :center="[116.397428, 39.90923]"
    map-key="your-amap-key"
    security-key="your-security-key"
    @location-selected="handleLocationSelected"
    @location-changed="handleLocationChanged"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LocationPicker from '@/components/location-picker/index.vue';
import type { LocationResult } from '@/components/location-picker/types';

const selectedLocation = ref<LocationResult | null>(null);

const handleLocationSelected = (result: LocationResult) => {
  console.log('位置已选择:', result);
  selectedLocation.value = result;
};

const handleLocationChanged = (result: LocationResult) => {
  console.log('位置已变化:', result);
};
</script>
```

### 动态初始化位置

组件支持动态设置初始位置，当 `center` 属性变化时会自动更新地图位置并添加标记：

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

<script setup lang="ts">
import { ref } from 'vue';
import LocationPicker from '@/components/location-picker/index.vue';

const currentLocation = ref([116.397428, 39.90923]); // 默认北京

const setBeijing = () => {
  currentLocation.value = [116.397428, 39.90923];
};

const setShanghai = () => {
  currentLocation.value = [121.4737, 31.2304];
};

const setNewYork = () => {
  currentLocation.value = [-74.006, 40.7128];
};

const handleLocationSelected = (result) => {
  console.log('Selected location:', result);
};
</script>
```

### 高德地图位置选择器（直接使用）

### 通过主入口组件使用

```vue
<template>
  <LocationPicker
    type="amap"
    :height="500"
    :zoom="15"
    :center="[113.166423, 28.239428]"
    map-key="your-amap-key"
    security-key="your-security-key"
    @location-selected="handleLocationSelected"
    @location-changed="handleLocationChanged"
  />
</template>

<script setup lang="ts">
import LocationPicker from '@/components/location-picker/index.vue';
import type { LocationResult } from '@/components/location-picker/types';

const handleLocationSelected = (result: LocationResult) => {
  console.log('位置已选择:', result);
};

const handleLocationChanged = (result: LocationResult) => {
  console.log('位置已变化:', result);
};
</script>
```

## Props 配置

### LocationPickerOptions

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mapKey` | `string` | - | 地图 API 密钥 |
| `securityKey` | `string` | - | 安全密钥（高德地图） |
| `height` | `string \| number` | `'400px'` | 地图高度 |
| `zoom` | `number` | `15` | 地图缩放级别 |
| `center` | `[number, number]` | `[116.397428, 39.90923]` | 地图中心点 |
| `showCenterIcon` | `boolean` | `false` | 是否显示中心图标 |
| `centerIconUrl` | `string` | - | 中心图标 URL |

### LocationPickerProps (扩展)

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | `'amap' \| 'gmap'` | `'amap'` | 地图类型 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `location-selected` | `LocationResult` | 确认选择位置时触发 |
| `location-changed` | `LocationResult` | 位置变化时触发 |

## 类型定义

```typescript
export interface LocationResult {
  latlng: [number, number];      // 坐标 [经度, 纬度]
  address: string;               // 地址
  formattedAddress: string;      // 格式化地址
}
```

## 高德地图配置

1. 申请高德地图 API 密钥：https://lbs.amap.com/
2. 配置安全密钥（可选）
3. 确保域名已在高德地图控制台白名单中

## 搜索功能

高德地图位置选择器支持地点搜索：

- 在搜索框中输入地名
- 支持防抖搜索（500ms 延迟）
- 点击搜索结果自动定位到地图
- 如果 PlaceSearch 插件加载失败，会自动使用地理编码器作为备用方案

## 样式定制

组件使用 SCSS 编写样式，可以通过 CSS 变量或深度选择器进行定制：

```scss
.location-picker {
  // 自定义样式
  .search-container {
    // 搜索框样式
  }
  
  .map-container {
    // 地图容器样式
  }
}
```

## 初始化功能

### 自动初始化
当组件接收到有效的 `center` 属性时，会自动：
1. 在地图上添加标记
2. 解析地址信息
3. 触发 `location-changed` 事件
4. 更新坐标输入框

### 动态更新
当 `center` 属性发生变化时，组件会：
1. 清除现有标记
2. 平滑移动到新位置
3. 添加新标记
4. 重新解析地址

### 默认值处理
所有有效的 `center` 值（包括默认值）都会自动添加标记并初始化位置。

## 注意事项

1. 确保网络环境可以访问高德地图 API
2. 高德地图需要配置安全密钥才能在生产环境使用
3. 搜索功能依赖 PlaceSearch 插件，如果加载失败会自动降级到地理编码器
4. 组件使用 `@amap/amap-jsapi-loader` 进行 SDK 加载，确保已安装该依赖
5. 初始化功能会自动解析地址，可能需要几秒钟时间

## 示例

查看 `src/views/amap-picker-test.vue` 获取完整的使用示例。 