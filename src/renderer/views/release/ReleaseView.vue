<template>
  <v-layout v-if="loading || _release" column>

    <!-- Release Card -->
    <card v-bind="{loading}" class="mb-2" :release="__release"/>
    <v-card v-if="franchises.length && !loading" flat color="transparent" class="mb-6">
      <v-card-title>Связанное</v-card-title>
      <v-list three-line>
        <template v-for="(item, index) in franchises">
          <v-list-item :link="true" @click="router().push('/release/' + release.id + '/' + release.names.en)"
                       :disabled="release.id == releaseId"
                       v-for="(release, index) in item.releases"
                       :key="release.id"
          >
            <v-list-item-avatar>
              <v-img :src="release.poster"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                <span>{{ release.names.ru }}</span>

                <v-chip
                  class="ma-2"
                  v-if="release.status"
                  color="secondary"
                  text-color="white"
                >
                  {{ release.status }}
                </v-chip>
              </v-list-item-title>
              <v-list-item-subtitle v-html="release.type"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-card>

    <!-- Release Tabs -->
    <v-tabs v-if="!loading" v-model="tab" class="shrink mb-4" background-color="transparent">
      <v-tab>Эпизоды</v-tab>
      <v-tab>Комментарии</v-tab>
    </v-tabs>

    <!-- Release Components -->
    <component v-if="component" v-on="component.events" v-bind="component.props" :is="component.is"/>

  </v-layout>
</template>

<script>

import Card from '@components/release/card'
import Episodes from '@components/release/episodes'
import Comments from '@components/release/comments'

import { toVideo } from '@utils/router/views'
import { mapState } from 'vuex'
import router from '@router'
import { catGirlFetch } from '@utils/fetch'

const props = {
  releaseId: {
    type: [String, Number],
    default: null
  },
  releaseName: {
    type: String,
    default: null
  }
}

export default {
  props,
  name: 'Release.View',
  meta () {
    return { title: `Релиз [${this.releaseId}]: ${this.releaseName}` }
  },
  components: {
    Card,
    Episodes,
    Comments
  },

  async mounted () {
    if (this._release?.id) {
      await this.fetchDates(this._release.id)
      await this.fetchAdditional(this._release.id)
    }
  },

  data () {
    return {
      tab: 0,
      loading: false,
      franchises: [],
      dates: {},
      team: null
    }
  },

  computed: {
    ...mapState('release', { _release: s => s.data }),
    __release () {
      return {
        ...this._release,
        team: this.team
      }
    },
    /**
     * Get release episodes
     *
     * @return {array}
     */
    episodes () {
      if (!this._release) return []

      if (!Object.keys(this.dates).length) return this.$__get(this._release, 'episodes', [])

      return this.$__get(this._release, 'episodes', [])
        .map(episode => {
          let date = ''

          if (this.dates[episode.id]) {
            const dt = new Date(this.dates[episode.id] * 1000)
            const formattedDate = new Intl.DateTimeFormat('ru-RU').format(dt)
            date = this.dates[episode.id] ? ` (${formattedDate})` : ''
          }

          return {
            ...episode,
            date: date,
          }
        })
    },

    /**
     * Get available components
     *
     * @return {array}
     */
    components () {
      return [
        {
          is: Episodes,
          props: {
            loading: this.loading,
            release: this._release,
            episodes: this.episodes,
          },
          events: { episode: episode => toVideo(this._release, episode) },
        },
        {
          is: Comments,
          props: { release: this._release }
        }
      ]
    },

    /**
     * Get active component
     *
     * @return {*}
     */
    component () {
      return this.components[this.tab] || null
    }

  },

  methods: {
    router () {
      return router
    },
    async fetchAdditional() {
      try {
        const { franchises, team } = await this.loadFranchisesAndTeam()

        this.team = team
        const releaseIds = this.extractReleaseIds(franchises)
        const additionalData = await this.loadAdditionalData(releaseIds)

        this.franchises = this.formatFranchises(franchises, additionalData)
      } catch (error) {
        console.error(error)
        this.$toasted.error('Ошибка загрузки связанных данных')
      }
    },

    async loadFranchisesAndTeam() {
      return await catGirlFetch(`https://api.wwnd.space/v3/title?filter=franchises,team&playlist_type=array&id=${this.releaseId}`)
    },

    extractReleaseIds(franchises) {
      const releaseIds = new Set()
      franchises.forEach(franchise => {
        franchise.releases.forEach(release => {
          releaseIds.add(release.id)
        })
      })
      return Array.from(releaseIds)
    },

    async loadAdditionalData(releaseIds) {
      return await catGirlFetch(
        `https://api.wwnd.space/v3/title/list?filter=status.string,id,type.full_string,string,names.ru,posters.medium&include=raw_poster&description_type=plain&playlist_type=object&id_list=${releaseIds}`
      )
    },

    formatFranchises(franchises, additionalData) {
      return franchises.map(franchise => {
        return {
          ...franchise,
          releases: franchise.releases.map(release => {
            const releaseData = additionalData.find(data => data.id === release.id)
            const {
              posters,
              type,
              status: { string: status },
            } = releaseData

            return {
              ...release,
              poster: process.env.STATIC_ENDPOINT_URL + posters?.medium.url,
              type: type?.full_string,
              status: status,
            }
          }),
        }
      })
    },

    async fetchDates() {
      try {
        const { player: { playlist } } = await this.loadTitleData()

        this.dates = this.extractDatesFromPlaylist(playlist)
      } catch (error) {
        this.$toasted.error('Ошибка загрузки связанных данных')
        console.error(error)
      }
    },

    async loadTitleData() {
      return await catGirlFetch('https://api.wwnd.space/v2/getTitle?id=' + this.releaseId)
    },

    extractDatesFromPlaylist(playlist) {
      const dates = {}
      for (const [key, { created_timestamp }] of Object.entries(playlist)) {
        dates[key] = created_timestamp
      }
      return dates
    },
  },

  watch: {
    releaseId: {
      immediate: true,
      async handler (releaseId) {

        // Update if release data changed
        if (this._release === null || this._release.id !== parseInt(releaseId)) {

          // Get release data
          this.loading = true
          await this.fetchDates(releaseId)
          await this.fetchAdditional(releaseId)
          await this.$store.dispatchPromise('release/getRelease', releaseId)
          this.loading = false

        }
      }
    }
  }
}
</script>
