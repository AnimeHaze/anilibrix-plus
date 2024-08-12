<template>
  <v-layout column align-center justify-center>

    <!-- Noise -->
    <blank-noise/>

    <!-- Message -->
    <div class="text-center caption" :style="{zIndex: 1}">
      <div>{{ text }}</div>
      <div>{{ error }}</div>
      <v-btn text class="mt-5" @click="toReleases">Назад</v-btn>
    </div>

  </v-layout>
</template>

<script>

import BlankNoise from './components/noise'
import { toReleases } from '@utils/router/views'

const props = {
  message: {
    type: String,
    default: null,
  },
  error: {
    type: String,
    default: null
  }
}

export default {
  props,
  meta: { title: `Video is not available` },
  components: {
    BlankNoise
  },

  computed: {

    /**
     * Get blank message
     *
     * @return {string}
     */
    text () {
      return this.message || 'There was an error loading the episode.'
    }

  },

  methods: {

    /**
     * Go back
     *
     * @return void
     */
    toReleases,

  }

}
</script>
