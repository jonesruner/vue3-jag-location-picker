<template>
  <div class="initialization-example">
    <h1>Location Picker - Initialization Example</h1>
    
    <div class="controls">
      <h3>Set Initial Location</h3>
      <div class="coordinate-inputs">
        <input
          v-model="longitude"
          type="number"
          placeholder="Longitude"
          step="any"
        />
        <input
          v-model="latitude"
          type="number"
          placeholder="Latitude"
          step="any"
        />
        <button @click="setLocation">Set Location</button>
      </div>
      
      <div class="preset-locations">
        <h4>Preset Locations:</h4>
        <button @click="setBeijing">Beijing (北京)</button>
        <button @click="setShanghai">Shanghai (上海)</button>
        <button @click="setNewYork">New York (纽约)</button>
        <button @click="setLondon">London (伦敦)</button>
      </div>
    </div>

    <div class="map-container">
      <div class="map-section">
        <h3>Google Maps (English)</h3>
        <LocationPicker
          type="gmap"
          :map-key="googleMapsKey"
          :center="currentLocation"
          :height="300"
          locale="en-US"
          @location-selected="handleLocationSelected"
          @location-changed="handleLocationChanged"
        />
      </div>

      <div class="map-section">
        <h3>AMap (Chinese)</h3>
        <LocationPicker
          type="amap"
          :map-key="amapKey"
          :security-key="amapSecurityKey"
          :center="currentLocation"
          :height="300"
          locale="zh-CN"
          @location-selected="handleLocationSelected"
          @location-changed="handleLocationChanged"
        />
      </div>
    </div>

    <div class="result-section">
      <h3>Selected Location:</h3>
      <pre>{{ selectedLocation ? JSON.stringify(selectedLocation, null, 2) : 'No location selected' }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { LocationPicker } from 'vue3-jag-location-picker'

// Replace with your actual API keys
const googleMapsKey = 'your-google-maps-api-key'
const amapKey = 'your-amap-api-key'
const amapSecurityKey = 'your-amap-security-key'

// Current location state
const currentLocation = ref([116.397428, 39.90923]) // Default: Beijing
const longitude = ref('116.397428')
const latitude = ref('39.90923')
const selectedLocation = ref(null)

// Preset locations
const presetLocations = {
  beijing: [116.397428, 39.90923],
  shanghai: [121.4737, 31.2304],
  newYork: [-74.006, 40.7128],
  london: [-0.1276, 51.5074]
}

// Set location from inputs
const setLocation = () => {
  const lng = parseFloat(longitude.value)
  const lat = parseFloat(latitude.value)
  
  if (!isNaN(lng) && !isNaN(lat)) {
    currentLocation.value = [lng, lat]
  }
}

// Preset location functions
const setBeijing = () => {
  currentLocation.value = presetLocations.beijing
  longitude.value = '116.397428'
  latitude.value = '39.90923'
}

const setShanghai = () => {
  currentLocation.value = presetLocations.shanghai
  longitude.value = '121.4737'
  latitude.value = '31.2304'
}

const setNewYork = () => {
  currentLocation.value = presetLocations.newYork
  longitude.value = '-74.006'
  latitude.value = '40.7128'
}

const setLondon = () => {
  currentLocation.value = presetLocations.london
  longitude.value = '-0.1276'
  latitude.value = '51.5074'
}

// Event handlers
const handleLocationSelected = (result) => {
  selectedLocation.value = result
  console.log('Location selected:', result)
}

const handleLocationChanged = (result) => {
  console.log('Location changed:', result)
}
</script>

<style scoped>
.initialization-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.coordinate-inputs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.coordinate-inputs input {
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 14px;
}

.coordinate-inputs button {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.preset-locations {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.preset-locations button {
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.preset-locations button:hover {
  background: #218838;
}

.map-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.map-section {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
}

.map-section h3 {
  margin: 0;
  padding: 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  font-size: 16px;
}

.result-section {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.result-section h3 {
  margin-bottom: 15px;
}

pre {
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  overflow-x: auto;
  font-size: 14px;
  white-space: pre-wrap;
}

@media (max-width: 768px) {
  .map-container {
    grid-template-columns: 1fr;
  }
  
  .coordinate-inputs {
    flex-direction: column;
  }
  
  .preset-locations {
    flex-direction: column;
  }
}
</style> 