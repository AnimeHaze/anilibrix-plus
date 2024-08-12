<template>
    <v-app-bar v-if="!hideToolbar" flat color="transparent" class="toolbar shrink">
      <!-- Releases -->
      <v-btn small text exact class="mr-1" height="38" :to="{name: 'releases'}">
        <v-icon size="18" class="mr-2">mdi-view-column</v-icon>
        <span>Releases</span>
      </v-btn>

      <!-- Catalog-->
      <v-btn small text exact class="mr-1" height="38" :to="{name: 'catalog'}">
        <v-icon size="18" class="mr-2">mdi-folder-text-outline</v-icon>
        <span>Catalog</span>
      </v-btn>

      <!-- Favorite -->
      <v-btn small text exact class="mr-4" height="38" :to="{name: 'favorites'}">
        <v-icon size="18" class="mr-2">mdi-star</v-icon>
        <span>Featured</span>
      </v-btn>

      <!-- Search-->
      <search class="mr-4"/>

      <div>
        <v-btn :disabled="diceIntervalId !== null" icon id="toolbar__rand" v-on:click="randomRelease">
          <v-icon>mdi-dice-{{ dice }}</v-icon>
        </v-btn>

        <v-tooltip left activator="#toolbar__rand">Random release</v-tooltip>
      </div>

      <update/>
      <notifications/>
      <settings/>
      <account/>


    </v-app-bar>
</template>

<script>

import Update from './components/update'
import Search from './components/search'
import Account from './components/account'
import Settings from './components/settings'
import Notifications from './components/notifications'
import { invokeRand } from '@main/handlers/app/appHandlers'
import {showAppError} from "@main/handlers/notifications/notificationsHandler";

export default {
  components: {
    Update,
    Search,
    Account,
    Settings,
    Notifications
  },
  methods: {
    async randomRelease() {
      this.diceIntervalId = setInterval(() => {
        if (this.direction) {
          this.dice--
        } else {
          this.dice++
        }

        if (this.dice === 6) {
          this.direction = 1
        } else if (this.dice === 0) {
          this.direction = 0
        }
      }, 200)
      try {
        const {id, name} = await invokeRand()
        if (id === -1) {
          this.$toasted.show('The function is not supported by the selected API server.', {type: 'error'})
          return
        }
        await this.$router.push('/release/' + id + '/' + name)
        clearInterval(this.diceIntervalId)
        this.dice = 5
        this.diceIntervalId = null
      } catch (e) {
        clearInterval(this.diceIntervalId)
        this.dice = 5
        this.diceIntervalId = null
        console.log(e)
        showAppError(e)
      }
    }
  },
  data () {
    return {
      dice: 5,
      diceIntervalId: null,
      direction: 0
    }
  },
  computed: {
    /**
     * Check if should hide toolbar
     *
     * @return {*|boolean}
     */
    hideToolbar () {
      return this.$__get(this.$route, 'meta.layout.hide_toolbar') || false
    }

  }
}

</script>

<style lang="scss" scoped>

.toolbar {
  ::v-deep {
    .v-toolbar__content {
      padding-left: 0;
      padding-right: 0;
    }
  }
}

</style>
