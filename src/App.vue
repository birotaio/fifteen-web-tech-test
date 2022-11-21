<template>
  <main class="main">
    <FMap :center="mapCenter" @bikeClicked="openBike" @updateLastCoordinates="updateLastCoordinates" ref="map" />
    <BikePopup :bike="bike" @close="close" />
    <AddBikePopup :model-value="addBikeStatus" @close="addBikeStatus = false" @addBike="addBike" :coordinates="coordinates" v-if="coordinates" />
    <!-- Dark / Light mode -->
    <v-btn class="darkMode" @click="toggleDarkMode" icon>
      <v-icon :icon="theme.global.current.value.dark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'" />
    </v-btn>
    <!-- Add Bike Btn -->
    <v-btn class="addBikeBtn" v-if="coordinates?.lat" icon @click="addBikeStatus = true">
      <v-icon icon="mdi-plus" />
    </v-btn>
  </main>
</template>
<script setup lang="ts">
import FMap from "@/components/FMap.vue";
import BikePopup from "@/components/BikePopup.vue";
import AddBikePopup from "@/components/AddBikePopup.vue";

import { useTheme } from 'vuetify'

import { ref } from "vue";
import { Bike } from "./types/bike";
import { Coordinates } from "./types/coordinates";

const mapCenter = ref({ lat: 48.864716, lng: 2.349014 });
const bike = ref<Bike>({} as Bike)
const coordinates = ref<Coordinates>()
const map = ref({});
const theme = useTheme()
const addBikeStatus = ref(false)

function openBike (iBike: Bike) {
  coordinates.value = {} as Coordinates
  bike.value = iBike;
}

function close () {
  bike.value = {} as Bike;
}

function toggleDarkMode() {
  // toggle // localStorage
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  localStorage.setItem('theme', theme.global.name.value);
  map.value.changeTheme(theme.global.name.value);
}

function updateLastCoordinates(iCoordinates: Coordinates) {
  coordinates.value = iCoordinates
}

function addBike(iBike: Bike) {
  addBikeStatus.value = false;
  map.value.addBike(iBike);
}


</script>
<style scoped>
.main {
  position: relative;
}
.darkMode {
  position: absolute;
  top: 20px;
  right: 20px;
}

.addBikeBtn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
