# 高德地图组件

## 功能特性

- 🗺️ 高德地图基础显示
- 📍 坐标定位和地址解析
- 🎯 点击地图获取坐标
- 📱 用户位置定位功能
- 🎯 中心点图标显示
- 🔄 使用AMapLoader动态加载SDK
- ⚡ Vue 3 Composition API

## 使用方法

### 基础使用

```vue
<template>
  <AmapMap 
    :center="[116.397428, 39.90923]" 
    :zoom="15"
    mapKey="your-amap-key"
    :showLocationIcon="true"
    :showCenterIcon="true"
    centerIconUrl="https://example.com/icon.png"
  />
</template>

<script setup>
import AmapMap from '@/components/map/amap/index.vue'
</script>
```

### 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| center | `[number, number]` | `[116.397428, 39.90923]` | 地图中心点坐标 |
| zoom | `number` | `15` | 地图缩放级别 |
| mapKey | `string` | - | 高德地图API密钥 |
| showLocationIcon | `boolean` | `true` | 是否显示定位按钮 |
| showCenterIcon | `boolean` | `true` | 是否在中心点显示图标 |
| centerIconUrl | `string` | - | 中心点图标URL（可选） |
| type | `'amap'` | `'amap'` | 地图类型 |

### 功能说明

#### 定位功能
- **📍 定位按钮**: 点击获取用户当前位置并跳转
- **🎯 中心点按钮**: 点击回到初始中心点位置
- **用户位置显示**: 显示获取到的用户位置坐标

#### 中心点图标
- **自动显示**: 在地图中心点显示标记图标
- **自定义图标**: 支持自定义图标URL
- **动态更新**: 地图中心变化时图标位置同步更新

## 注意事项

1. 需要申请高德地图API密钥
2. 使用 `@amap/amap-jsapi-loader` 动态加载SDK
3. 点击地图可获取当前坐标和地址信息
4. 支持地理编码和逆地理编码功能
5. 定位功能需要用户授权地理位置权限

## 开发说明

组件使用Vue 3 Composition API开发，主要文件：

- `index.vue` - 主组件，包含UI和交互
- `utils/hook.ts` - 地图逻辑hook，使用AMapLoader
- `types/index.ts` - 类型定义

## 已安装依赖

```bash
pnpm add @amap/amap-jsapi-loader
```

## 核心功能

- **地图初始化**: 使用AMapLoader.load()加载SDK
- **坐标显示**: 实时显示点击位置的经纬度
- **地址解析**: 根据坐标自动解析地址信息
- **用户定位**: 获取并显示用户当前位置
- **中心点图标**: 在地图中心显示可自定义的标记
- **状态管理**: 响应式管理地图状态和错误处理 