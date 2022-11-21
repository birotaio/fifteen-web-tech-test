<template>
  <v-dialog
    :model-value="true"
    @update:modelValue="updateModelValue"
    v-if="!!bike.serial_number"
    class="bike-popup-dialog"
  >
  <v-card :loading="loading">
      <v-container fluid>
        <v-row>
          <v-btn icon flat @click="emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-spacer />
          <v-btn icon flat @click="toggleEditMode">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-row>
      </v-container>
      <v-list lines="one">
        <!-- Serial Number -->
        <v-list-item>
          <v-list-item-title>
            Serial number
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ bike.serial_number }}
          </v-list-item-subtitle>
        </v-list-item>
        <!-- In Order -->
        <v-list-item>
          <v-list-item-title>
            <template v-if="editMode">
              Is the bike Ok ?
            </template>
            <template v-else-if="bike.in_order">
              Bike is in order
            </template>
            <template v-else>
              There is a problem with this bike
            </template>
          </v-list-item-title>
          <v-radio-group v-model="editedBike.in_order" v-if="editMode">
            <v-radio label="Yes" :value="true" />
            <v-radio label="No" :value="false" />
          </v-radio-group>
          <template v-slot:append>
            <v-icon :icon="bike.in_order ? 'mdi-thumb-up-outline' : 'mdi-alert-decagram'" v-if="!editMode"/>
          </template>
        </v-list-item>
        <!-- Battery -->
        <v-list-item>
          <v-list-item-title>
            Battery
          </v-list-item-title>
          <template v-if="!editMode">
            <v-list-item-subtitle>
              <v-progress-linear :model-value="bike.battery_level" height="25">
                <template v-slot:default="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>
            </v-list-item-subtitle>
          </template>
          <template v-else>
            <v-slider thumb-label :min="0" :max="100" v-model="editedBike.battery_level" :step="1" :disabled="loading" />
          </template>
        </v-list-item>
        <!-- Status -->
        <v-list-item>
          <v-list-item-title>Status</v-list-item-title>
          <template v-if="!editMode">
            <v-list-item-subtitle>
              <template v-if="bike.service_status === 1">
                Free
              </template>
              <template v-if="bike.service_status === 2">
                Booked
              </template>
              <template v-if="bike.service_status === 3">
                In use
              </template>
            </v-list-item-subtitle>
          </template>
          <template v-else>
            <v-radio-group v-model="editedBike.service_status">
              <v-radio label="Free" :value="1" />
              <v-radio label="Booked" :value="2" />
              <v-radio label="In use" :value="3" />
            </v-radio-group>
          </template>
          <template v-slot:append v-if="!editMode">
            <v-icon :icon="icon" />
          </template>
        </v-list-item>
      </v-list>
      <v-card-actions v-if="editMode">
        <v-spacer />
        <v-btn variant="outlined" @click="saveChanges" :disabled="loading">
          Save changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
export interface BikePopupProps { bike: Bike }
import { Bike } from '@/types/bike';
import axios from 'axios'
import { computed, ref } from '@vue/reactivity';

const props = defineProps<BikePopupProps>()
const emit = defineEmits(['close'])

const editMode = ref(false)
const editedBike = ref<Bike>({} as Bike)
const loading = ref(false)

const icon = computed(() => {
    if(!props.bike.id) return '';
    switch(props.bike.service_status) {
      case 1: 
        return 'mdi-bicycle';
      case 2: 
        return 'mdi-av-timer';
      case 3:
        return 'mdi-bike'
      default: 
        return '';
    }
})

function updateModelValue(value:boolean) {
  if(!value) {
    emit('close')
  }
}

function toggleEditMode() {
  editMode.value = !editMode.value

  if(!editMode.value) {
    editedBike.value = {} as Bike
  }
  else {
    editedBike.value = props.bike
  }
}

async function saveChanges() {
  const id = props.bike.id;
  loading.value = true;
  await axios.put(`https://637617647e93bcb006c2d314.mockapi.io/bikes/${id}`, {
    battery_level: editedBike.value.battery_level,
    service_status: editedBike.value.service_status,
    in_order: editedBike.value.in_order
  });
  loading.value = false;
  editMode.value = false;
}
</script>
<style scoped>
.bike-popup-dialog {
  max-width: 700px;
}

.v-list-item__content {
  overflow: visible!important;
}
</style>
