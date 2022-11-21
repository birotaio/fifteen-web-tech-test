<template>
  <div id="map" style="height: 100vh" class="dark" />
</template>

<script setup lang="ts">
export interface FMapProps { center: LngLatLike; }

import { Map, LngLatLike, Marker } from "mapbox-gl";
import { useTheme } from 'vuetify'
import axios from 'axios';
import { onMounted, ref } from "vue";

import "mapbox-gl/dist/mapbox-gl.css";

import ClickableMarker from "@/types/clickable_marker";
import { Bike } from "@/types/bike";
import { Coordinates } from "@/types/coordinates";

const theme = useTheme()
const emit = defineEmits(['bikeClicked', 'updateLastCoordinates'])
const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const props = defineProps<FMapProps>();
const bikes = ref<Bike[]>([]);
const markers = [] as any;

let lastClickedMarker: { setLngLat: (arg0: any) => { (): any; new(): any; addTo: { (arg0: {}): void; new(): any; }; }; } | null = null;
let map = {} as any;

onMounted(async () => {
  const { data } = await axios.get('https://637617647e93bcb006c2d314.mockapi.io/bikes');
  bikes.value = data.bikes;

  map = new Map({
    accessToken: token,
    container: "map",
    style: getStyle(theme.global.name.value),
    center: props.center,
    zoom: 9,
  });
  map.on('click', (event: { lngLat: any; }) => {
    if(!lastClickedMarker) {  return; }
    const coordinates = new Coordinates(event.lngLat.lng, event.lngLat.lat)
    lastClickedMarker.setLngLat(coordinates.toArray()).addTo(map);
    emit('updateLastCoordinates', coordinates)
  });
  addMarkers();

  lastClickedMarker = new Marker({ color: "#F55353", draggable: false, scale: 0.5 });
});

function changeTheme (theme: string) {
  map.setStyle(getStyle(theme))
}

function getStyle(theme: string) {
  return `mapbox://styles/mapbox/${theme}-v10`
}

function addBike(iBike: Bike) {
  bikes.value.push(iBike);
  clearMarkers();
  addMarkers();
}

function clickOnMarker(iBike: Bike) {
  if(lastClickedMarker) { lastClickedMarker.setLngLat([0,0]) }
  emit('bikeClicked', iBike); 
}

function clearMarkers() {
  markers.forEach(el => el.remove());
  markers.length = 0;
}

function addMarkers() {
  bikes.value.filter(el => el.coordinates.length).forEach((bike) => {
    const marker = new ClickableMarker().setLngLat(bike.coordinates.reverse()).addTo(map);
    marker.onClick(() => clickOnMarker(bike))
  })
}

defineExpose({ changeTheme, addBike })
</script>
