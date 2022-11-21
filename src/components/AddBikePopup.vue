<template>
  <v-dialog :model-value="modelValue" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-container>
        <v-row align="center">
          <v-btn icon flat @click="emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <h4>Add bike</h4>
        </v-row>
      </v-container>
      <v-container>
        <v-form>
          <v-text-field clearable label="Serial number" variant="outlined" v-model="bike.serial_number" />
          <v-radio-group v-model="bike.in_order">
            <template v-slot:label>
              <div>Is your bike is ready to use ?</div>
            </template>
            <v-radio label="Yes" :value="true" />
            <v-radio label="No" :value="false" />
          </v-radio-group>
          <div class="v-label">Battery</div>
          <v-slider thumb-label :min="0" :max="100" v-model="bike.battery_level" :step="1" />
          <v-radio-group v-model="bike.service_status">
            <template v-slot:label>
              <div>Status</div>
            </template>
            <v-radio label="Free" :value="1" />
            <v-radio label="Booked" :value="2" />
            <v-radio label="In use" :value="3" />
          </v-radio-group>
        </v-form>
      </v-container>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="addBike">
          Add bike
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { Bike } from '@/types/bike';
import { Coordinates } from '@/types/coordinates';
import { ref } from '@vue/reactivity';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export interface AddBikePopupProps { modelValue: boolean, coordinates: Coordinates }

const bike = ref<Bike>({} as Bike)
const props = defineProps<AddBikePopupProps>()
const emit = defineEmits(['close', 'addBike'])

async function addBike() {
  bike.value.coordinates = props.coordinates.toArray().reverse() as [];
  bike.value.id = uuidv4();

  await axios.post(`https://637617647e93bcb006c2d314.mockapi.io/bikes`, {
    id: bike.value.id,
    battery_level: bike.value.battery_level,
    in_order: bike.value.in_order,
    serial_number: bike.value.serial_number,
    service_status: bike.value.service_status,
    coordinates: props.coordinates.toArray().reverse(),
  })
  emit('addBike', bike.value)
}
</script>
