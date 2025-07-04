# Map Component

一个基于 Vue 3 + TypeScript 的地图组件，支持高德地图和 Google 地图，提供现代化的地图展示功能。

## 功能特性

- 🗺️ **双地图支持**: 高德地图 (AMap) 和 Google 地图
- 🌍 **国际化支持**: 中文和英文界面
- 📍 **中心点指示器**: 可选的十字线中心指示器
- 🔗 **位置分享**: 一键复制位置链接到剪贴板
- 📱 **响应式设计**: 完美适配桌面和移动端
- 🎨 **现代化 UI**: 简洁美观的用户界面
- ⚡ **高性能**: 异步加载地图组件
- 🔧 **高度可定制**: 丰富的配置选项

## 安装

Map 组件已包含在主包中，无需单独安装：

```bash
npm install vue3-jag-location-picker
```

## 基本使用

### 导入组件

```vue
<template>
  <div>
    <!-- 高德地图 -->
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
    
    <!-- Google 地图 -->
    <Map
      type="gmap"
      :map-key="googleMapsKey"
      :height="400"
      :zoom="15"
      :center="[116.397428, 39.90923]"
      :show-center-icon="true"
      locale="en-US"
    />
  </div>
</template>

<script setup lang="ts">
import { Map } from 'vue3-jag-location-picker'
import type { MapOptions, LatLng } from 'vue3-jag-location-picker'

const amapKey = 'your-amap-api-key'
const amapSecurityKey = 'your-amap-security-key'
const googleMapsKey = 'your-google-maps-api-key'
</script>
```

### 全局注册

```typescript
// main.ts
import { createApp } from 'vue'
import { install } from 'vue3-jag-location-picker'
import App from './App.vue'

const app = createApp(App)
app.use({ install })
app.mount('#app')
```

然后在模板中直接使用：

```vue
<template>
  <Map
    type="amap"
    :map-key="amapKey"
    :height="500"
    :zoom="12"
    :center="[121.4737, 31.2304]"
  />
</template>
```

## 高级使用

### 动态配置

```vue
<template>
  <div>
    <div class="controls">
      <button @click="switchToAmap">切换到高德地图</button>
      <button @click="switchToGmap">切换到 Google 地图</button>
      <button @click="updateLocation">更新位置</button>
    </div>
    
    <Map
      :type="mapType"
      :map-key="currentMapKey"
      :security-key="securityKey"
      :height="mapHeight"
      :zoom="zoomLevel"
      :center="currentCenter"
      :show-center-icon="showCenter"
      :locale="currentLocale"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Map } from 'vue3-jag-location-picker'
import type { MapType, LatLng } from 'vue3-jag-location-picker'

const mapType = ref<MapType>('amap')
const mapHeight = ref(400)
const zoomLevel = ref(15)
const currentCenter = ref<LatLng>([116.397428, 39.90923])
const showCenter = ref(true)
const currentLocale = ref('zh-CN')

const amapKey = 'your-amap-key'
const gmapKey = 'your-google-maps-key'
const securityKey = 'your-amap-security-key'

const currentMapKey = computed(() => {
  return mapType.value === 'amap' ? amapKey : gmapKey
})

const switchToAmap = () => {
  mapType.value = 'amap'
  currentLocale.value = 'zh-CN'
}

const switchToGmap = () => {
  mapType.value = 'gmap'
  currentLocale.value = 'en-US'
}

const updateLocation = () => {
  // 随机更新位置
  const locations: LatLng[] = [
    [116.397428, 39.90923], // 北京
    [121.4737, 31.2304],    // 上海
    [113.2644, 23.1291],    // 广州
    [114.0579, 22.5431],    // 深圳
  ]
  const randomIndex = Math.floor(Math.random() * locations.length)
  currentCenter.value = locations[randomIndex]
}
</script>
```

### 响应式配置

```vue
<template>
  <div>
    <div class="config-panel">
      <label>
        地图高度:
        <input v-model.number="mapHeight" type="range" min="200" max="800" step="50" />
        {{ mapHeight }}px
      </label>
      
      <label>
        缩放级别:
        <input v-model.number="zoomLevel" type="range" min="3" max="20" step="1" />
        {{ zoomLevel }}
      </label>
      
      <label>
        <input v-model="showCenter" type="checkbox" />
        显示中心指示器
      </label>
    </div>
    
    <Map
      type="amap"
      :map-key="amapKey"
      :height="mapHeight"
      :zoom="zoomLevel"
      :center="currentCenter"
      :show-center-icon="showCenter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Map } from 'vue3-jag-location-picker'

const mapHeight = ref(400)
const zoomLevel = ref(15)
const currentCenter = ref([116.397428, 39.90923])
const showCenter = ref(true)
const amapKey = 'your-amap-key'
</script>

<style scoped>
.config-panel {
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.config-panel label {
  display: block;
  margin-bottom: 10px;
}

.config-panel input[type="range"] {
  margin: 0 10px;
}
</style>
```

## Props 配置

### MapOptions

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `type` | `'amap' \| 'gmap'` | `'amap'` | 否 | 地图提供商类型 |
| `mapKey` | `string` | - | 是 | 地图 API 密钥 |
| `mapId` | `string` | - | 否 | Google 地图 Map ID（用于高级标记） |
| `securityKey` | `string` | - | 否 | 安全密钥（高德地图推荐） |
| `height` | `string \| number` | `'400px'` | 否 | 地图高度 |
| `zoom` | `number` | `15` | 否 | 初始缩放级别 (3-20) |
| `center` | `[number, number]` | `[116.397428, 39.90923]` | 否 | 初始中心坐标 [经度, 纬度] |
| `showLocationIcon` | `boolean` | `false` | 否 | 是否显示定位按钮 |
| `showCenterIcon` | `boolean` | `true` | 否 | 是否显示中心点指示器 |
| `centerIconUrl` | `string` | - | 否 | 自定义中心图标 URL |
| `locale` | `string` | `'en-US'` | 否 | 语言设置 (`'zh-CN'` 或 `'en-US'`) |

## 功能详解

### 中心点指示器

中心点指示器是一个十字线图标，显示在地图的中心位置：

```vue
<template>
  <Map
    type="amap"
    :map-key="amapKey"
    :show-center-icon="true"
    :center-icon-url="customIconUrl"
  />
</template>

<script setup>
const customIconUrl = 'https://example.com/custom-icon.png'
</script>
```

### 位置分享

地图组件包含一个分享按钮，点击后会将当前位置的链接复制到剪贴板：

- 高德地图：生成高德地图链接
- Google 地图：生成 Google 地图链接

### 国际化支持

组件支持中文和英文界面：

```vue
<template>
  <div>
    <!-- 中文界面 -->
    <Map
      type="amap"
      :map-key="amapKey"
      locale="zh-CN"
    />
    
    <!-- 英文界面 -->
    <Map
      type="gmap"
      :map-key="gmapKey"
      locale="en-US"
    />
  </div>
</template>
```

## API 密钥配置

### 高德地图 (AMap)

1. 访问 [高德开放平台](https://console.amap.com/)
2. 创建新应用或选择现有应用
3. 获取 API Key 和 Security Key
4. 配置域名白名单（推荐）

```javascript
// 推荐配置
const amapConfig = {
  mapKey: 'your-amap-api-key',
  securityKey: 'your-amap-security-key', // 推荐配置
  type: 'amap'
}
```

### Google 地图

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Maps JavaScript API
4. 创建 API 密钥
5. 配置 API 密钥限制（推荐）

```javascript
// 推荐配置
const gmapConfig = {
  mapKey: 'your-google-maps-api-key',
  mapId: 'your-map-id', // 可选，用于高级标记
  type: 'gmap'
}
```

## 样式定制

### CSS 变量

组件使用 CSS 变量，可以轻松定制样式：

```css
:root {
  --map-border-radius: 12px;
  --map-box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  --map-controls-bg: rgba(255, 255, 255, 0.95);
  --map-controls-border: 1px solid rgba(0, 0, 0, 0.1);
}
```

### 深度选择器

```vue
<style scoped>
/* 自定义地图容器样式 */
:deep(.map-demo-wrappers) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* 自定义控制按钮样式 */
:deep(.map-controls) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 8px;
}

/* 自定义中心指示器样式 */
:deep(.center-indicator) {
  border: 3px solid #ff4757;
  box-shadow: 0 0 10px rgba(255, 71, 87, 0.5);
}
</style>
```

## 性能优化

### 异步加载

组件使用 `defineAsyncComponent` 异步加载地图组件，提高首屏加载性能：

```typescript
const Amap = defineAsyncComponent(() => import('./amap/index.vue'))
const GoogleMap = defineAsyncComponent(() => import('./gmap/index.vue'))
```

### 条件渲染

根据地图类型条件渲染对应组件，避免不必要的资源加载：

```vue
<template>
  <Amap v-if="type === 'amap'" v-bind="amapProps" />
  <GoogleMap v-else-if="type === 'gmap'" v-bind="gmapProps" />
</template>
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- 移动端浏览器

## 常见问题

### Q: 地图无法加载？
A: 请检查：
1. API 密钥是否正确
2. 域名是否在白名单中
3. 网络连接是否正常
4. 浏览器控制台是否有错误信息

### Q: 高德地图显示异常？
A: 建议配置 Security Key 以提高安全性，并确保域名已在高德控制台白名单中。

### Q: Google 地图无法显示？
A: 请确保：
1. Maps JavaScript API 已启用
2. API 密钥有正确的权限
3. 计费账户已设置（Google 地图需要计费账户）

### Q: 如何自定义地图样式？
A: 可以通过 CSS 变量或深度选择器自定义样式，具体参考"样式定制"部分。

## 更新日志

### v1.0.0
- 初始版本发布
- 支持高德地图和 Google 地图
- 添加国际化支持
- 实现中心点指示器功能
- 添加位置分享功能 