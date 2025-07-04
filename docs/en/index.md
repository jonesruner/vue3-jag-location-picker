# Vue3 Jag Location Picker

A Vue 3 location picker component library supporting both Google Maps and AMap (高德地图).

## Features

- 🗺️ **Dual Map Support**: Google Maps and AMap (高德地图)
- 📍 **Interactive Selection**: Click on map to select location
- 🔍 **Address Search**: Search for places and addresses
- 📊 **Coordinate Input**: Direct coordinate input support
- 🎯 **Marker Management**: Visual markers for selected locations
- 🌐 **Address Resolution**: Get detailed address information
- 📱 **Responsive Design**: Works on desktop and mobile
- 🎨 **Customizable**: Flexible styling and configuration options
- 🚀 **Auto Initialization**: Automatically initialize location when center prop is provided
- 🔄 **Dynamic Updates**: Real-time response to center prop changes

## Installation

```bash
npm install vue3-jag-location-picker
```

## Import Styles

```javascript
// In main.js or main.ts
import 'vue3-jag-location-picker/style.css'
```

## Basic Usage

### LocationPicker Component

Main location picker component providing complete location selection functionality:

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
  console.log('Selected location:', result)
  // result: { latlng: [lng, lat], address: '...', formattedAddress: '...' }
}
</script>
```

### Map Component

Independent map display component for simple map visualization:

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
    locale="en-US"
  />
</template>

<script setup>
import { Map } from 'vue3-jag-location-picker'

const amapKey = 'your-amap-api-key'
const amapSecurityKey = 'your-amap-security-key'
</script>
```

## API Keys Setup

### Google Maps

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Maps JavaScript API and Places API
4. Create credentials (API Key)
5. Restrict the API key for security

### AMap (高德地图)

1. Visit [AMap Developer Console](https://console.amap.com/)
2. Create a new application
3. Get your API Key and Security Key
4. Configure domain restrictions

## Props

### LocationPicker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'amap' \| 'gmap'` | `'amap'` | Map provider type |
| `mapKey` | `string` | - | Map API key |
| `securityKey` | `string` | - | Security key (required for AMap) |
| `height` | `string \| number` | `'400px'` | Map height |
| `zoom` | `number` | `15` | Initial zoom level |
| `center` | `[number, number]` | `[116.397428, 39.90923]` | Initial center coordinates |
| `showDebugInfo` | `boolean` | `false` | Show debug information |
| `locale` | `string` | `'en-US'` | Language setting (`'zh-CN'` or `'en-US'`) |

### Map Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'amap' \| 'gmap'` | `'amap'` | Map provider type |
| `mapKey` | `string` | - | Map API key |
| `mapId` | `string` | - | Google Map ID (optional) |
| `securityKey` | `string` | - | Security key (required for AMap) |
| `height` | `string \| number` | `'400px'` | Map height |
| `zoom` | `number` | `15` | Initial zoom level |
| `center` | `[number, number]` | `[116.397428, 39.90923]` | Initial center coordinates |
| `showCenterIcon` | `boolean` | `false` | Show center indicator |
| `showDebugInfo` | `boolean` | `false` | Show debug information |
| `locale` | `string` | `'en-US'` | Language setting (`'zh-CN'` or `'en-US'`) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `location-selected` | `LocationResult` | Fired when user confirms location selection |
| `location-changed` | `LocationResult` | Fired when location changes (click, search, etc.) |

## Types

```typescript
interface LocationResult {
  latlng: [number, number]; // [longitude, latitude]
  address: string;
  formattedAddress: string;
  rawGeocodeResult?: any; // Raw geocoding result for debugging
}

type LatLng = [number, number];
```

## Complete Examples

### Dynamic Location Switching

```vue
<template>
  <div>
    <div class="controls">
      <button @click="setBeijing">Beijing</button>
      <button @click="setShanghai">Shanghai</button>
      <button @click="setNewYork">New York</button>
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

### Custom Styling

```vue
<style>
/* Using CSS variables */
:root {
  --location-picker-border-radius: 12px;
  --location-picker-box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Using deep selectors */
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

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT 