<template>

  <!-- Loading -->
  <loader v-if="loading"/>

  <!-- Torrents -->
  <div v-else-if="loading === false && torrents" id="torrents">
    <v-list v-if="torrents.length > 0" dense dark>
      <template v-for="(torrent, k) in torrents">
        <v-divider v-if="k > 0" :key="`d:${k}`"/>

        <v-list-item two-line ref="container" @click="download(torrent)">
          <v-list-item-content>
            <v-list-item-title class="d-flex justify-space-between">
              <span>Серия {{ torrent.series }}</span>
              <span>{{ formatTimestamp(torrent.ctime) }}</span>
            </v-list-item-title>
            <v-list-item-subtitle class="d-flex justify-space-between caption grey--text text--darken-1">
              <span>{{ formatSize(torrent.size) }} | {{ torrent.quality }}</span>
              <div class="d-flex justify-center align-center">
                <span class="d-flex justify-center align-center mr-1">
                  <span>{{ humanFormat(torrent.seeders) }}</span>
                  <v-icon dark small color="green">mdi-arrow-up</v-icon>
                </span>

                <span class="d-flex justify-center align-center mr-1">
                  <span>{{ humanFormat(torrent.leechers) }}</span>
                  <v-icon dark small color="red">mdi-arrow-down</v-icon>
                </span>

                <span class="d-flex justify-center align-center">
                  <span>{{ humanFormat(torrent.completed) }}</span>
                  <v-icon dark small color="blue">mdi-download</v-icon>
                </span>
              </div>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>

  </div>
</template>

<script>

import Loader from './components/loader'
import humanFormat from 'human-format'
import moment from 'moment'

const domain = 'https://wwnd.space'

const props = {
  loading: {
    type: Boolean,
    default: false,
  },
  torrents: {
    type: Array,
    default: []
  }
}

export default {
  props,
  components: {
    Loader,
  },
  data() {
    return {
      binaryScale: humanFormat.Scale.create(['б', 'Кб', 'Мб', 'Гб', 'Тб'], 1024)
    }
  },

  methods: {
    humanFormat,

    download(torrent) {
      window.open(domain + torrent.url, '_blank')
      // window.location.href = domain + torrent.url
    },

    formatSize(size) {
      return humanFormat(size, { scale: this.binaryScale })
    },

    formatTimestamp(time) {
      return moment.unix(time).format('DD.MM.YYYY HH:mm:ss')
    }
  }
}
</script>
