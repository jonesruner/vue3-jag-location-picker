declare module "vue3-jag-location-picker" {
  import { DefineComponent } from "vue";

  export type LatLng = [number, number];
  export type MapType = 'amap' | 'gmap';

  export interface LocationPickerOptions {
    mapKey?: string;
    mapId?: string;
    securityKey?: string;
    height?: string | number;
    zoom?: number;
    center?: LatLng;
    showCenterIcon?: boolean;
    centerIconUrl?: string;
    showDebugInfo?: boolean;
    locale?: string;
  }

  export interface LocationResult {
    latlng: LatLng;
    address: string;
    formattedAddress: string;
    rawGeocodeResult?: any;
  }

  export interface LocationPickerProps extends LocationPickerOptions {
    type?: "amap" | "gmap";
  }

  export interface LocationPickerEmits {
    "location-selected": [result: LocationResult];
    "location-changed": [result: LocationResult];
  }

  export const LocationPicker: DefineComponent<
    LocationPickerProps,
    {},
    {},
    {},
    {},
    {},
    {},
    LocationPickerEmits
  >;

  export interface MapOptions {
    type?: MapType;
    zoom?: number;
    mapKey?: string;
    mapId?: string;
    securityKey?: string;
    center?: LatLng;
    showLocationIcon?: boolean;
    showCenterIcon?: boolean;
    centerIconUrl?: string;
    height?: string | number;
    locale?: string;
  }

  export const Map: DefineComponent<
    MapOptions,
    {},
    {},
    {},
    {},
    {},
    {},
    {}
  >;

  export interface AmapMap {
    setCenter: (center: LatLng) => void;
    setZoom: (zoom: number) => void;
    getCenter: () => LatLng;
    getZoom: () => number;
    on: (event: string, callback: Function) => void;
    off: (event: string, callback: Function) => void;
    add: (overlay: any) => void;
    remove: (overlay: any) => void;
    addControl: (control: any) => void;
    removeControl: (control: any) => void;
  }

  export interface AmapGeocoder {
    getAddress: (location: LatLng, callback: (status: string, result: any) => void) => void;
    getLocation: (address: string, callback: (status: string, result: any) => void) => void;
  }

  export interface AmapMarker {
    setPosition: (position: LatLng) => void;
    getPosition: () => LatLng;
    setIcon: (icon: string) => void;
    setOffset: (offset: [number, number]) => void;
  }

  export interface GeocoderResult {
    status: string;
    info: string;
    infocode: string;
    regeocode: {
      formattedAddress: string;
      addressComponent: {
        country: string;
        province: string;
        city: string;
        district: string;
        street: string;
        number: string;
      };
      pois: Array<{
        name: string;
        type: string;
        distance: string;
        location: LatLng;
      }>;
    };
  }

  export const install: (app: any) => void;

  export default LocationPicker;
}
