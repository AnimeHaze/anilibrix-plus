<template>
  <div>
    <!-- Main Interface Components -->
    <v-slide-y-reverse-transition>
      <v-layout v-show="visible" column class="interface pa-8 pt-0">

        <player-headline v-bind="{player, release, episode}" class="pb-2"/>
        <player-timeline v-bind="{player}"/>
        <v-row no-gutters justify="center">

          <!-- Links -->
          <v-col align-self="center">
            <player-links
              v-bind="{release, source, player}"
              :upscale="() => $refs.upscale"
              :torrent="() => $refs.torrent"
              :episodes="() => $refs.episodes"
              @set:time="setTime">
            </player-links>
          </v-col>

          <!-- Play -->
          <v-col align-self="center">
            <player-play v-bind="{player, release, episode}"/>
          </v-col>

          <!-- Controls -->
          <v-col align-self="center">
            <player-controls
              v-bind="{episode, source, player}"
              @set:speed="setSpeed"
              @set:source="setSource"
              @set:volume="setVolume"
              @toggle:pip="togglePIP"
              @toggle:fullscreen="toggleFullscreen">
            </player-controls>
          </v-col>
        </v-row>

      </v-layout>
    </v-slide-y-reverse-transition>

    <!-- Keyboard -->
    <player-keyboard
      v-bind="{player, release, episode}"
      @set:volume="setVolume"
      @set:time="setTime"
      @set:speed="setSpeed"
      @toggle:play="togglePlay"
      @toggle:fullscreen="toggleFullscreen">
    </player-keyboard>

    <template v-if="_auto_opening_skip" v-for="skip in skips">
      <player-skip v-bind="{player, isInterfaceVisible: visible, ...skip}" @set:time="setTime"/>
    </template>
    <player-next v-bind="{player, release, episode}"/>
    <player-mouse v-bind="{player}" @set:volume="setVolume"/>
    <player-label v-bind="{player}" :key="`label:${episode.id}:${source.label}`"/>
    <player-torrent v-bind="{source}" ref="torrent" :key="`torrent:${source.label}`"/>
    <player-episodes v-bind="{release, episode}" ref="episodes" :key="`episodes:${source.label}`"/>
    <player-buffering v-bind="{player}" :key="`buffering:${source.label}`"/>

  </div>
</template>

<script>

import PlayerSkip from './components/skip'
import PlayerPlay from './components/play'
import PlayerNext from './components/next'
import PlayerLabel from './components/label'
import PlayerLinks from './components/links'
import PlayerMouse from './components/mouse'
import PlayerTorrent from './components/torrent'
import PlayerKeyboard from './components/keyboard'
import PlayerHeadline from './components/headline'
import PlayerTimeline from './components/timeline'
import PlayerControls from './components/controls'
import PlayerEpisodes from './components/episodes'
import PlayerBuffering from './components/buffering'

import screenfull from 'screenfull'
import { AppKeyboardHandlerMixin, AppMouseHandlerMixin } from '@mixins/app'
import { mapActions, mapState } from 'vuex'
import { catGirlFetch } from '@utils/fetch'
import {invokeGetTitleV1New, invokeGetTitleV2} from "@main/handlers/app/appHandlers";

const props = {
  player: {
    type: Object,
    default: null
  },
  source: {
    type: Object,
    default: null
  },
  release: {
    type: Object,
    default: null
  },
  episode: {
    type: Object,
    default: null
  }
}

export default {
  props,
  mixins: [
    AppMouseHandlerMixin,
    AppKeyboardHandlerMixin,
  ],
  components: {
    PlayerSkip,
    PlayerPlay,
    PlayerNext,
    PlayerLinks,
    PlayerMouse,
    PlayerLabel,
    PlayerTorrent,
    PlayerKeyboard,
    PlayerHeadline,
    PlayerTimeline,
    PlayerControls,
    PlayerEpisodes,
    PlayerBuffering,
  },

  data () {
    return {
      video: null,
      visible: true,
      visible_handler: null,
      keysDown: [],
      skips: []
    }
  },

  computed: {
    ...mapState('app/settings/player', {
      _auto_opening_skip: s => s.opening.autoSkip,
      _opening_skip_button_key: s => s.opening.skip_button_key,
      _auto_opening_skip_key: s => s.opening.autoSkipKey,
      _opening_skip_time: s => s.opening.skip_time
    })
  },

  methods: {

    /**
     * Show player controls
     *
     * @return void
     */
    showInterface () {

      // Show controls
      // Send event to show cursor
      this.visible = true
      this.$emit('show:cursor')

      // Clear previous interval
      // Create new interval
      if (this.visible_handler) clearTimeout(this.visible_handler)
      this.visible_handler = setTimeout(() => {

        // Hide interface
        // Send event to hide cursor
        this.visible = false
        this.$emit('hide:cursor')

      }, 2500)
    },

    /**
     * Handle mouse move
     * Show interface on mouse move
     *
     * @return {void}
     */
    handleMouseEvents () {
      this.showInterface()
    },

    /**
     * Handler mouse scroll
     * Show interface on mouse move
     */
    handleMouseScroll () {
      this.showInterface()
    },

    /**
     * Handle keyboard move
     * Show interface on mouse move
     *
     * @return {void}
     */
    handleKeyboardEvents () {
      this.showInterface()
    },

    /**
     * Enter fullscreen mode
     * Fullscreen div container with player and controls
     *
     * @return {void}
     */
    toggleFullscreen () {
      screenfull.toggle(document.getElementsByName('body')[0])
    },

    /**
     * Toggle pip
     *
     * @return {void}
     */
    togglePIP () {
      this.player.pip = !this.player.pip
    },

    /**
     * Toggle player play state
     *
     * @return {void}
     */
    togglePlay () {
      this.player.togglePlay()
    },

    /**
     * Set player speed
     *
     * @param speed
     */
    setSpeed (speed) {
      this.player.speed = speed
    },

    /**
     * Set player time
     *
     * @return void
     */
    setTime (time) {
      if (this.player.paused) {
        this.player.once('playing', () => this.player.pause())
      }

      this.player.currentTime = time
    },

    /**
     * Set source
     *
     * @param source
     */
    setSource (source) {
      this.$emit('set:source', source)
    },

    /**
     * Set volume
     *
     * @param volume
     */
    setVolume (volume) {
      this.player.volume = volume
    },

    handleKeys (type, e) {
      if (type === 'keydown') {
        if (this.keysDown.indexOf(e.code) === -1) {
          this.keysDown.push(e.code);
        }

        if (this.keysDown.length && !['ControlLeft'].includes(this.keysDown.toString())) {
          if (this._opening_skip_button_key !== '' && this._opening_skip_button_key === this.keysDown.join('+')) {
            this.setTime(this.player.currentTime + (this._opening_skip_time || 0))
          }

          if (this._auto_opening_skip_key !== '' && this._auto_opening_skip_key === this.keysDown.join('+')) {
            if (this._auto_opening_skip) {
              this.$toasted.show('Авто пропуск опенинга выключен', {
                type: 'default',
                position: 'top-center'
              })
            } else {
              this.$toasted.show('Авто пропуск опенинга включен', {
                type: 'success',
                position: 'top-center'
              })
            }
            this._setAutoSkip(!this._auto_opening_skip)
          }
        }
      } else if (type === 'keyup') {
        const index = this.keysDown.indexOf(e.code);

        if (index !== -1) {
          this.keysDown.splice(index, 1);
        }
      }
    },
    ...mapActions('app/settings/player', {
      _setAutoSkip: 'setAutoSkip'
    }),
    handleKeyUp (e) {
      this.handleKeys('keyup', e)
    },
    handleKeyDown (e) {
      this.handleKeys('keydown', e)
    },
  },

  async mounted () {
    document.addEventListener('keyup', this.handleKeyUp)
    document.addEventListener('keydown', this.handleKeyDown)

    try {
      const epId = this.$__get(this.episode, 'id')
      const rId = this.$__get(this.release, 'id')

      const { episodes } = await invokeGetTitleV1New(rId)

      const serie = episodes.find(x => x.ordinal.toString() === epId.toString())

      if (serie) {
        if (serie.ending) this.skips.push({ start: serie.ending.start, end: serie.ending.stop })
        if (serie.opening) this.skips.push({ start: serie.opening.start, end: serie.opening.stop })
      }
    } catch (e) {
      console.log(e)
    }

    // Hide / Show controls
    this.showInterface()

    // Get video element
    this.video = document.getElementsByClassName('plyr')[0]

    // Add some event listeners
    // Set player click event
    // Toggle player state
    this.video.addEventListener('click', this.togglePlay)
    this.video.addEventListener('dblclick', this.toggleFullscreen)

  },

  beforeDestroy () {
    document.removeEventListener('keyup', this.handleKeyUp)
    document.removeEventListener('keydown', this.handleKeyDown)
    // Remove player listeners
    this.video.removeEventListener('click', this.togglePlay)
    this.video.removeEventListener('dblclick', this.toggleFullscreen)

  }

}
</script>

<style scoped lang="scss">

.interface {
  width: 100%;
  bottom: 0;
  z-index: 10;
  position: absolute;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.50) 50%, rgba(255, 255, 255, 0) 100%);
  user-select: none;

}

</style>
