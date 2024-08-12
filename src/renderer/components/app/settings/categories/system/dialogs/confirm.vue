<template>
  <v-dialog
    v-model="visible"
    persistent
    max-width="500"
  >
    <v-card>
      <v-card-title class="text-h5">
        WARNING
      </v-card-title>
      <v-card-text>

        <p>
          Consent to the transfer of data (session identifier) ​​to a third -party server to work with snapshots is required
        </p>

        <p class="mt-1">
          <b>Your account password is not disclosed and is not transmitted in any form</b>
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          text
          v-on:click="$emit('openSnapshots')"
        >
          I agree
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          v-on:click="visible = false"
        >
          No, thanks
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      loading: false,
    }
  },
  methods: {
    hideDialog () {
      this.visible = false
    },
    /**
     * Show dialog
     *
     * @return void
     */
    showDialog () {
      this.visible = true
    }
  }

}
</script>
