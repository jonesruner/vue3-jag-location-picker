# Vue3 AG Location Picker

A Vue 3 location picker component supporting both Google Maps and AMap (高德地图).

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

The component includes default styles. You can import them in your main file:

```javascript
// In your main.js or main.ts
import 'vue3-jag-location-picker/style.css'
```

Or import the styles in your component:

```vue
<style>
@import 'vue3-jag-location-picker/style.css';
</style>
```

## Usage

### Basic Usage

```vue
<template>
  <div>
    <LocationPicker
      type="gmap"
      :map-key="googleMapsKey"
      @location-selected="handleLocationSelected"
    />
  </div>
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

### Dynamic Initialization

The component automatically initializes with a location when the `center` prop is provided:

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
      @location-selected="handleLocationSelected"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { LocationPicker } from 'vue3-jag-location-picker'

const currentLocation = ref([116.397428, 39.90923]) // Default: Beijing

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

### AMap Usage

```vue
<template>
  <div>
    <LocationPicker
      type="amap"
      :map-key="amapKey"
      :security-key="amapSecurityKey"
      @location-selected="handleLocationSelected"
    />
  </div>
</template>

<script setup>
import { LocationPicker } from 'vue3-jag-location-picker'

const amapKey = 'your-amap-api-key'
const amapSecurityKey = 'your-amap-security-key'

const handleLocationSelected = (result) => {
  console.log('Selected location:', result)
}
</script>
```

### Internationalization

The component supports multiple languages. You can set the `locale` prop:

```vue
<template>
  <div>
    <!-- English (default) -->
    <LocationPicker
      type="gmap"
      :map-key="googleMapsKey"
      locale="en-US"
      @location-selected="handleLocationSelected"
    />
    
    <!-- Chinese -->
    <LocationPicker
      type="gmap"
      :map-key="googleMapsKey"
      locale="zh-CN"
      @location-selected="handleLocationSelected"
    />
  </div>
</template>
```

**Supported Languages:**
- `en-US` - English (default)
- `zh-CN` - Chinese (中文)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'amap' \| 'gmap'` | `'amap'` | Map provider type |
| `mapKey` | `string` | - | API key for the map provider |
| `securityKey` | `string` | - | Security key (required for AMap) |
| `height` | `string \| number` | `'400px'` | Map height |
| `zoom` | `number` | `15` | Initial zoom level |
| `center` | `[number, number]` | `[116.397428, 39.90923]` | Initial center coordinates |
| `showCenterIcon` | `boolean` | `false` | Show center icon (deprecated) |
| `centerIconUrl` | `string` | - | Center icon URL (deprecated) |
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

## Initialization Features

### Auto Initialization
When the component receives a valid `center` prop, it automatically:
1. Adds a marker on the map
2. Resolves the address information
3. Triggers the `location-changed` event
4. Updates the coordinate input fields

### Dynamic Updates
When the `center` prop changes, the component will:
1. Clear existing markers
2. Smoothly move to the new location
3. Add a new marker
4. Re-resolve the address

### Default Value Handling
All valid `center` values (including the default value) will automatically add markers and initialize the location.

## API Keys Setup

### Google Maps

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Maps JavaScript API and Places API
4. Create credentials (API Key)
5. Restrict the API key for security

### AMap (高德地图)

1. Go to [AMap Developer Console](https://console.amap.com/)
2. Create a new application
3. Get your API Key and Security Key
4. Configure domain restrictions

## Styling

The component includes default styles, but you can customize them:

```vue
<style>
/* Override default styles */
.location-picker {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.location-picker .top-controls {
  background: #f8f9fa;
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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
