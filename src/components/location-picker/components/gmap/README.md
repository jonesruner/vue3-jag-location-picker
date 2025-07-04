# Google Maps 位置选择器

基于Google Maps API的位置选择器组件，支持地图点击、搜索和坐标输入。

## 功能特性

- 🗺️ Google Maps集成
- 📍 地图点击选择位置
- 🔍 地址搜索功能
- 📊 坐标输入定位
- 🎯 确认位置时解析详细地址
- 📱 响应式设计
- 🐛 调试信息显示
- 🆔 支持Map ID（Advanced Markers）

## 使用方法

```vue
<template>
  <GmapLocationPicker
    :map-key="yourGoogleMapsKey"
    :map-id="yourMapId"
    @location-selected="handleLocationSelected"
    @location-changed="handleLocationChanged"
  />
</template>

<script setup>
import { GmapLocationPicker } from '@/components/location-picker/components/gmap';

const handleLocationSelected = (result) => {
  console.log('确认选择的位置:', result);
  // result 包含:
  // - latlng: [经度, 纬度]
  // - address: 地址字符串
  // - formattedAddress: 格式化地址
  // - rawGeocodeResult: 原始地理编码结果
};

const handleLocationChanged = (result) => {
  console.log('位置变化:', result);
};
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mapKey` | `string` | - | Google Maps API密钥 |
| `mapId` | `string` | - | Google Maps Map ID（Advanced Markers支持） |
| `height` | `string \| number` | `"400px"` | 地图容器高度 |
| `zoom` | `number` | `15` | 地图缩放级别 |
| `center` | `[number, number]` | `[116.397428, 39.90923]` | 地图中心坐标 |
| `showCenterIcon` | `boolean` | `false` | 是否显示中心图标 |
| `centerIconUrl` | `string` | - | 中心图标URL |
| `showDebugInfo` | `boolean` | `false` | 是否显示调试信息 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `location-selected` | `LocationResult` | 确认选择位置时触发 |
| `location-changed` | `LocationResult` | 位置变化时触发 |

## 地址解析逻辑

组件采用简化的地址解析策略：

1. **点击地图时**：只保存坐标，不解析地址
2. **确认位置时**：调用Google Maps地理编码API获取详细地址
3. **搜索结果**：直接使用搜索返回的地址信息

### LocationResult 结构

```typescript
interface LocationResult {
  latlng: [number, number];        // 经纬度坐标
  address: string;                 // 地址字符串
  formattedAddress: string;        // 格式化地址
  rawGeocodeResult?: any;          // 原始地理编码结果（调试用）
}
```

## 使用流程

1. **初始化**：提供Google Maps API密钥和Map ID（可选）
2. **选择位置**：
   - 点击地图选择位置（显示坐标）
   - 或使用搜索功能查找地址
   - 或直接输入经纬度坐标
3. **确认位置**：点击"确认位置"按钮获取详细地址
4. **获取结果**：通过事件获取最终的位置信息

## 高级功能

### Map ID 支持

为了使用Advanced Markers功能，建议配置Map ID：

```vue
<GmapLocationPicker
  :map-key="yourGoogleMapsKey"
  :map-id="yourMapId"
  @location-selected="handleLocationSelected"
/>
```

获取Map ID：
1. 访问 [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/credentials)
2. 创建或选择项目
3. 在"凭据"页面创建Map ID
4. 配置Map ID的样式和功能

### 搜索功能

组件支持多种搜索方式：

- **地址搜索**：输入地址关键词进行搜索
- **坐标搜索**：直接输入经纬度坐标
- **自动完成**：搜索时提供自动完成建议

## 注意事项

- 需要有效的Google Maps API密钥
- 建议配置Map ID以支持Advanced Markers
- 地址解析仅在确认位置时进行，减少API调用
- 调试模式下会显示原始地理编码结果
- 需要启用Places API和Geocoding API

## 故障排除

### 地图无法加载
- 检查API密钥是否正确
- 确认已启用Maps JavaScript API
- 检查网络连接和防火墙设置
- 查看浏览器控制台错误信息

### 地址解析失败
- 检查API密钥权限
- 确认已启用Geocoding API
- 查看调试信息中的原始结果
- 检查API配额是否超限

### 搜索功能异常
- 确认已启用Places API
- 检查搜索关键词格式
- 查看API配额使用情况

### Advanced Markers警告
- 配置有效的Map ID
- 确保Map ID已正确设置
- 检查Map ID的权限配置

## API配额管理

Google Maps API有使用配额限制，建议：

1. **监控使用量**：定期检查API使用情况
2. **优化调用**：只在确认位置时解析地址
3. **设置配额**：在Google Cloud Console设置配额限制
4. **错误处理**：妥善处理API错误和超限情况 