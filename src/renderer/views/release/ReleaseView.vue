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
      <v-tab v-if="torrents.length > 0">Торренты</v-tab>
    </v-tabs>

    <!-- Release Components -->
    <component v-if="component" v-on="component.events" v-bind="component.props" :is="component.is"/>

  </v-layout>
</template>

<script>

import Card from '@components/release/card'
import Episodes from '@components/release/episodes'
import Comments from '@components/release/comments'
import Torrents from '@components/release/torrents'

import { toVideo } from '@utils/router/views'
import { mapState } from 'vuex'
import router from '@router'
import { catGirlFetch } from '@utils/fetch'
import ReleaseProxy from '@proxies/release'
import {invokeGetTitleV3} from "@main/handlers/app/appHandlers";

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
    const id = this._release?.id
    if (this._release?.id) {
      await this.fetchAdditional(id)
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

      return this.$__get(this._release, 'episodes', [])
    },

    /**
     * Get release torrents
     *
     * @return {array}
     */
    torrents () {
      if (!this._release) return []

      return this.$__get(this._release, 'torrents', [])
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
        },
        {
          is: Torrents,
          props: { torrents: this.torrents }
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
      return await invokeGetTitleV3(`filter=franchises,team&playlist_type=array&id=${this.releaseId}`)
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
      const result = await Promise.allSettled(
          releaseIds.map((id) => invokeGetTitleV3(
            `filter=status.string,id,type.full_string,string,names.ru,posters.medium&include=raw_poster&description_type=plain&playlist_type=object&id=${id}`
          ))
      )

      return result
        .filter(({ value, reason }) => {
          return reason?.status !== 404
        })
        .map(({ value }) => value)
    },

    formatFranchises(franchises, additionalData) {
      return franchises.map(franchise => {
        return {
          ...franchise,
          releases: franchise.releases.map(release => {
            const releaseData = additionalData.find(data => data.id === release.id)

            if (!releaseData) return null

            const {
              posters,
              type,
              status: { string: status },
            } = releaseData

            return {
              ...release,
              poster: new ReleaseProxy().getStaticEndpoint() + posters?.medium.url,
              type: type?.full_string,
              status: status,
            }
          }).filter(x => x !== null),
        }
      })
    }
  },

  watch: {
    releaseId: {
      immediate: true,
      async handler (releaseId) {

        // Update if release data changed
        if (this._release === null || this._release.id !== parseInt(releaseId)) {

          // Get release data
          this.loading = true
          await this.$store.dispatchPromise('release/getRelease', releaseId)
          await this.fetchAdditional(releaseId)
          this.loading = false

        }
      }
    }
  }
}
</script>
