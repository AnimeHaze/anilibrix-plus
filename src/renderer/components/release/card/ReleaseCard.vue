<template>
  <v-card flat color="transparent">
    <loader v-if="loading"/>
    <v-layout v-else column>

      <!-- Avatar + Release main data -->
      <v-layout align-center class="my-4">

        <!-- Poster -->
        <img
          class="mx-4 rounded-lg"
          :src="poster"
          style="max-width: 200px;"
        >

        <!-- Title -->
        <!-- Original Name + Genres -->
        <!-- Meta -->
        <div>
          <v-card-title v-text="title" class="allow-select display-1 mb-2 font-weight-black" :style="{wordBreak: 'break-word'}"/>
          <v-card-subtitle v-text="original" class="allow-select pb-0"/>
          <v-card-subtitle v-text="genres" class="allow-select pt-1"/>

          <div style="margin-bottom: -10px;" v-for="(type, prop) in release.team" :key="prop" class="pl-4" v-if="type.length">
            <span class="subtitle-2" style="color: rgb(184 184 184);">{{ teamProps[prop] }}:</span>
            <v-chip
              v-for="name in type"
              :key="name"
              class="ma-2"
              small
            >
              {{ name }}
            </v-chip>
          </div>

          <v-card-text class="mb-1">
            <favorite v-bind="{release}" color="grey darken-3"/>
            <v-chip v-if="year" v-text="year" label color="grey darken-3" :style="{height: '36px'}"/>
            <v-chip v-if="type" v-text="type" label color="grey darken-3" :style="{height: '36px'}"/>
            <v-chip v-if="status" v-text="status" label color="grey darken-3" :style="{height: '36px'}"/>
          </v-card-text>
        </div>

      </v-layout>

      <!-- Description -->
      <v-card-text v-text="description" class="white--text"/>

    </v-layout>
  </v-card>
</template>

<script>

import Loader from './components/loader'
import Favorite from './../favorite'

const props = {
  loading: {
    type: Boolean,
    default: false
  },
  release: {
    type: Object,
    default: null
  }
}

export default {
  props,
  components: {
    Loader,
    Favorite
  },
  data () {
    return {
      teamProps: {
        voice: 'Voiced over',
        translator: 'Translated',
        decor: 'Editing',
        editing: 'Subtitles',
        timing: 'Timings'
      }
    }
  },
  computed: {

    /**
     * Get title
     *
     * @return {string|null}
     */
    title () {
      return this.$__get(this.release, 'names.ru')
    },

    /**
     * Get original title
     *
     * @return {string|null}
     */
    original () {
      return this.$__get(this.release, 'names.original')
    },

    /**
     * Get release genres
     *
     * @return {string}
     */
    genres () {
      return (this.$__get(this.release, 'genres') || []).join(' | ')
    },

    /**
     * Get year
     *
     * @return {string|number|null}
     */
    year () {
      return this.$__get(this.release, 'year')
    },

    /**
     * Get release type
     *
     * @return {string|null}
     */
    type () {
      return this.$__get(this.release, 'type')
    },

    /**
     * Get release description
     *
     * @return {*}
     */
    description () {
      return this.$__get(this.release, 'description')
    },

    /**
     * Get release poster
     *
     * @return {*}
     */
    poster () {
      return this.$__get(this.release, 'poster')
    },

    /**
    * Get release status
    *
    * @return {*}
    */
    status () {
      return this.$__get(this.release, 'status')
    }

  }
}
</script>
