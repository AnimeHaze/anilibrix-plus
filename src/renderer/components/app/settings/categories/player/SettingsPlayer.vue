<template>
  <div ref="settings">

    <div class="pa-4 caption grey--text">
      <div class="body-1">Release playback settings</div>
      <div>
        In this section you can configure the ability to watch releases using torrents, 
        as well as other playback settings
      </div>
    </div>

    <!-- Torrents -->
    <v-card>
      <v-card-subtitle class="pb-0 font-weight-bold">Torrents</v-card-subtitle>
      <v-card-text class="mt-2 caption">
        <div class="pb-2">
          You can connect torrents,
          which will automatically be linked to episodes of releases and available for viewing.
        </div>
        <div>
          Torrents do not require a third-party player or client and are available online, 
          in the release playback quality selection menu.
        </div>
      </v-card-text>
      <v-list-item dense @click="_setTorrentsProcess(!_torrents_process)">
        <v-list-item-title>Torrent Process</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_torrents_process" @change="_setTorrentsProcess"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="caption">
        Using torrents requires more connection and parsing time,
        which can negatively affect the speed of downloading data on releases,
        especially when using a proxy server
      </v-card-text>
    </v-card>

    <!-- Autoplay -->
    <v-card class="mt-2">
      <v-list-item dense @click="_setAutoplayNext(!_autoplay_next)">
        <v-list-item-title>Autoplay next episode</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_autoplay_next" @change="_setAutoplayNext"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="pt-2 caption">
        After the episode ends, the player will automatically start playing the next episode in the release, 
        if available
      </v-card-text>
    </v-card>


    <!-- Buffer -->
    <v-card class="mt-2">
      <v-card-text class="pb-2 caption">
        <div>Video buffer size</div>
        <div>Video loading buffer size, default 5 minutes</div>
      </v-card-text>
      <v-card-text>
        <v-text-field
          outlined
          hide-details
          min="60"
          class="mb-2"
          type="number"
          label="Buffer size in seconds"
          suffix="sec"
          :value="_video_buffer"
          @input="_setVideoBuffer(parseInt($event) > 0 ? parseInt($event) : 60)">
        </v-text-field>
      </v-card-text>
      <v-card-text class="pt-0 caption">
        <div>Specifies the size of the buffer that the player keeps in memory and preloads the video during viewing.</div>
      </v-card-text>
    </v-card>


    <!-- Opening Skip Button -->
    <v-card class="mt-2">
      <v-list-item dense @click="_setAutoSkip(!_auto_opening_skip)">
        <v-list-item-title>Automatically skip opening</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_auto_opening_skip" @change="_setAutoSkip"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="pt-2 caption">
        <div>
          If there are skip marks for the opening, it will be skipped automatically
        </div>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-text class="caption">Hotkey to turn on and off auto skip</v-card-text>
      <v-card-text>
        <v-text-field
          outlined
          hide-details
          class="mb-2"
          type="text"
          label="Press the key combination here"
          clearable
          :value="_auto_opening_skip_key"
          @click:clear="_setAutoSkipKey('')"
          @keyup.prevent="bindAutoSkip('keyup', $event)"
          @keydown.prevent="bindAutoSkip('keydown', $event)">
        </v-text-field>
      </v-card-text>
    </v-card>
    <v-divider/>

    <v-divider/>

    <!-- Opening Skip Button -->
    <v-card class="mt-2">
      <v-list-item dense @click="_setOpeningSkipButton(!_opening_skip_button)">
        <v-list-item-title>Skip Opening Button</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_opening_skip_button" @change="_setOpeningSkipButton"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="pt-2 caption">
        <div>
          An additional button will appear in the player interface that will forward the player by the specified number of seconds
        </div>
        <div>This button does not guarantee that the opening will be skipped correctly.</div>
      </v-card-text>
    </v-card>
    <v-divider/>

    <v-card>
      <v-card-text class="caption">Hotkey for skip opening button</v-card-text>
      <v-card-text>
        <v-text-field
          outlined
          hide-details
          class="mb-2"
          type="text"
          label="Press the key combination here"
          clearable
          :value="_opening_skip_button_key"
          @click:clear="_setOpeningSkipButtonKey('')"
          @keyup.prevent="bindSkip('keyup', $event)"
          @keydown.prevent="bindSkip('keydown', $event)">
        </v-text-field>
      </v-card-text>
    </v-card>
    <v-divider/>

    <!-- Opening Skip Time -->
    <v-card>
      <v-card-text class="pb-2 caption">You can specify how many seconds to skip the opening</v-card-text>
      <v-card-text>
        <v-text-field
          outlined
          hide-details
          class="mb-2"
          type="number"
          label="Number of seconds to skip the opening"
          suffix="sec"
          :value="_opening_skip_time"
          @input="_setOpeningSkipTime($event ? parseInt($event) : 0)">
        </v-text-field>
      </v-card-text>
    </v-card>

  </div>
</template>

<script>

import { mapActions, mapState } from 'vuex'


export default {
  computed: {
    ...mapState('app/settings/player', {
      _video_buffer: s => s.video.buffer,
      _autoplay_next: s => s.autoplayNext,
      _torrents_process: s => s.torrents.process,
      _opening_skip_time: s => s.opening.skip_time,
      _opening_skip_button: s => s.opening.skip_button,
      _opening_skip_button_key: s => s.opening.skip_button_key,
      _auto_opening_skip: s => s.opening.autoSkip,
      _auto_opening_skip_key: s => s.opening.autoSkipKey
    })
  },
  data () {
    return {
      keysDown: []
    }
  },
  methods: {
    bindAutoSkip (type, e) {
      if (type === 'keydown') {
        if (this.keysDown.indexOf(e.code) === -1) {
          this.keysDown.push(e.code);
        }

        if (this.keysDown.length && !['ControlLeft'].includes(this.keysDown.toString())) {
          this._setAutoSkipKey(this.keysDown.join('+'))
        }
      } else if (type === 'keyup') {
        const index = this.keysDown.indexOf(e.code);

        if (index !== -1) {
          this.keysDown.splice(index, 1);
        }
      }
    },
    bindSkip (type, e) {
      if (type === 'keydown') {
        if (this.keysDown.indexOf(e.code) === -1) {
          this.keysDown.push(e.code);
        }

        if (this.keysDown.length && !['ControlLeft'].includes(this.keysDown.toString())) {
          this._setOpeningSkipButtonKey(this.keysDown.join('+'))
        }
      } else if (type === 'keyup') {
        const index = this.keysDown.indexOf(e.code);

        if (index !== -1) {
          this.keysDown.splice(index, 1);
        }
      }
    },
    ...mapActions('app/settings/player', {
      _setAutoSkip: 'setAutoSkip',
      _setVideoBuffer: 'setVideoBuffer',
      _setAutoplayNext: 'setAutoplayNext',
      _setTorrentsProcess: 'setTorrentsProcess',
      _setOpeningSkipTime: 'setOpeningSkipTime',
      _setOpeningSkipButton: 'setOpeningSkipButton',
      _setOpeningSkipButtonKey: 'setOpeningSkipButtonKey',
      _setAutoSkipKey: 'setAutoSkipKey'
    }),
  }

}
</script>
