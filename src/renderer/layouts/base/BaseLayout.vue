<template>
  <v-layout
    ref="container"
    column
    fill-height
    id="container"
    class="base-layout"
    :class="{ showScroll, isOnBlack }">

    <!-- App Toolbar -->
    <!-- Content -->
    <app-tool-bar/>
    <v-btn
      width="30"
      height="30"
      v-show="fab"
      fab
      dark
      fixed
      bottom
      right
      color="grey darken-3"
      @click="toTop"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
    <slot/>

  </v-layout>
</template>

<script>

import AppToolBar from '@components/app/toolbar'

export default {
  name: 'Layout.Base',
  components: {
    AppToolBar
  },
  data () {
    return {
      fab: false
    }
  },
  methods: {
    onScroll (e) {
      this.fab = e.target.scrollTop > 20;
    },
    toTop () {
      this.$refs.container.scrollTo({ top: 0, behavior: 'smooth' })
    },
  },
  mounted() {
    this.$refs.container.addEventListener('scroll', this.onScroll)
  },
  beforeDestroy () {
    this.$refs.container.removeEventListener('scroll', this.onScroll)
  },
  computed: {

    /**
     * Check if should show scroll
     *
     * @return {*|boolean}
     */
    showScroll () {
      return this.$__get(this.$route, 'meta.layout.show_scroll') || false
    },

    /**
     * Check if is on black background
     *
     * @return {*|boolean}
     */
    isOnBlack () {
      return this.$__get(this.$route, 'meta.layout.is_on_black') || false
    }

  }
}
</script>

<style lang="scss" scoped>

.base-layout {
  top: 40px;
  padding: 15px 5% 30px 5%;
  position: absolute;
  overflow-x: hidden;
  overflow-y: overlay;
  width: 100%;
  height: calc(100vh - 40px);

  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }

  &::-webkit-scrollbar {
    background-color: transparent;
  }


  &.showScroll {
    &::-webkit-scrollbar-thumb {
      background-color: #353535;
    }

    &::-webkit-scrollbar {
      background-color: #1d1d1d;
    }
  }

  &.isOnBlack {
    background: black;
  }
}

</style>
