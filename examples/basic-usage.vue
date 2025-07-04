<template>
  <div class="example-container">
    <h1>Vue Location Picker - Basic Usage</h1>
    
    <div class="example-section">
      <h2>Google Maps</h2>
      <LocationPicker
        type="gmap"
        :map-key="googleMapsKey"
        height="400px"
        @location-selected="handleLocationSelected"
        @location-changed="handleLocationChanged"
      />
    </div>

    <div class="example-section">
      <h2>AMap (高德地图)</h2>
      <LocationPicker
        type="amap"
        :map-key="amapKey"
        :security-key="amapSecurityKey"
        height="400px"
        @location-selected="handleLocationSelected"
        @location-changed="handleLocationChanged"
      />
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

const selectedLocation = ref(null)

const handleLocationSelected = (result) => {
  selectedLocation.value = result
  console.log('Location selected:', result)
}

const handleLocationChanged = (result) => {
  console.log('Location changed:', result)
}
</script>

<style scoped>
.example-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.example-section {
  margin-bottom: 30px;
}

.example-section h2 {
  margin-bottom: 10px;
  color: #333;
}

.result-section {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.result-section h3 {
  margin-bottom: 10px;
  color: #333;
}

pre {
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  overflow-x: auto;
  font-size: 14px;
}
</style> 