<template>
  <v-overlay v-if="visible" absolute opacity=".85">
    <v-dialog v-bind="{attach}" v-model="visible" hide-overlay>
      <v-card>
        <v-card-title>Application cache</v-card-title>
        <v-card-subtitle class="pt-2 pb-0">Are you sure you want to reset the app cache and settings?
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-bind="{loading}" text color="red" @click="resetCache">Reset</v-btn>
          <v-btn v-bind="{loading}" text @click="visible = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-overlay>
</template>

<script>

const props = {
  attach: {
    type: HTMLDivElement,
    default: null
  }
}

export default {
  props,
  data () {
    return {
      visible: false,
      loading: false,
    }
  },

  methods: {

    /**
     * Show dialog
     *
     * @return void
     */
    showDialog () {
      this.visible = true
    },

    /**
     * Reset cache
     *
     * @return void
     */
    resetCache () {
      this.loading = true
      this.$store
        .dispatchPromise('RESET_STORE')
        .then(() => require('@electron/remote').getCurrentWindow().reload())
        .finally(() => this.loading = false)
    }
  }

}
</script>
