import { createApp } from 'vue'
import App from './App.vue'

import '@/assets/global.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  },
  theme: {
    defaultTheme: localStorage.getItem('theme') || 'light'
  },
  components,
  directives,
})

createApp(App).use(vuetify).mount('#app')
