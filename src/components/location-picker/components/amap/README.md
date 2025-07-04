# 高德地图位置选择器

基于高德地图API的位置选择器组件，支持地图点击、搜索和坐标输入。

## 功能特性

- 🗺️ 高德地图集成
- 📍 地图点击选择位置
- 🔍 地址搜索功能
- 📊 坐标输入定位
- 🎯 确认位置时解析详细地址
- 📱 响应式设计
- 🐛 调试信息显示

## 使用方法

```vue
<template>
  <AmapLocationPicker
    :map-key="yourAmapKey"
    :security-key="yourSecurityKey"
    @location-selected="handleLocationSelected"
    @location-changed="handleLocationChanged"
  />
</template>

<script setup>
import { AmapLocationPicker } from '@/components/location-picker/components/amap';

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
| `mapKey` | `string` | - | 高德地图API密钥 |
| `securityKey` | `string` | - | 高德地图安全密钥 |
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
2. **确认位置时**：调用高德地图地理编码API获取详细地址
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

1. **初始化**：提供高德地图API密钥和安全密钥
2. **选择位置**：
   - 点击地图选择位置（显示坐标）
   - 或使用搜索功能查找地址
   - 或直接输入经纬度坐标
3. **确认位置**：点击"确认位置"按钮获取详细地址
4. **获取结果**：通过事件获取最终的位置信息

## 注意事项

- 需要有效的高德地图API密钥
- 建议配置安全密钥以提高安全性
- 地址解析仅在确认位置时进行，减少API调用
- 调试模式下会显示原始地理编码结果

## 故障排除

### 地图无法加载
- 检查API密钥是否正确
- 确认网络连接正常
- 查看浏览器控制台错误信息

### 地址解析失败
- 检查API密钥权限
- 确认安全密钥配置正确
- 查看调试信息中的原始结果

### 搜索功能异常
- 检查PlaceSearch插件是否正常加载
- 确认搜索关键词格式正确 