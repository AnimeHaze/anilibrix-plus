<template>
  <div>

    <!-- Seen -->
    <v-card class="mb-2">
      <v-list-item class="py-2" @click="_setSettingsShowSeen(!_show_seen)">
        <v-list-item-content>
          <v-list-item-title>Viewed releases</v-list-item-title>
          <v-list-item-subtitle>You can show or hide already viewed releases</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-switch :input-value="_show_seen" @click="_setSettingsShowSeen"/>
        </v-list-item-action>
      </v-list-item>
    </v-card>

    <!-- Completed -->
    <v-card class="mb-2">
      <v-list-item class="py-2" @click="_setSettingsShowCompleted(!_show_completed)">
        <v-list-item-content>
          <v-list-item-title>Just finished</v-list-item-title>
          <v-list-item-subtitle>You can show or hide unfinished releases</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-switch :input-value="_show_completed" @click="_setSettingsShowCompleted"/>
        </v-list-item-action>
      </v-list-item>
    </v-card>


    <!-- Sort -->
    <v-card class="mb-2">
      <v-list-item class="py-2">
        <v-list-item-content>
          <v-list-item-title>Sort</v-list-item-title>
          <v-list-item-subtitle>You can customize the way releases are sorted</v-list-item-subtitle>
          <v-select
            outlined
            hide-details
            class="mt-4"
            item-text="title"
            item-value="value"
            placeholder="Sorting"
            :items="sort"
            :value="_sort"
            @input="_setSettingsSort">
          </v-select>
        </v-list-item-content>
      </v-list-item>
    </v-card>


    <!-- Group -->
    <v-card>
      <v-list-item class="py-2">
        <v-list-item-content>
          <v-list-item-title>Grouping</v-list-item-title>
          <v-list-item-subtitle>You can customize the way releases are grouped</v-list-item-subtitle>
          <v-select
            outlined
            hide-details
            class="mt-4"
            item-text="title"
            item-value="value"
            placeholder="Grouping"
            :items="group"
            :value="_group"
            @input="_setSettingsGroup">
          </v-select>
        </v-list-item-content>
      </v-list-item>
    </v-card>

  </div>
</template>

<script>

import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      sort: [
        {
          title: 'By name',
          value: 'title'
        },
        {
          title: 'By popularity',
          value: 'rating'
        },
        {
          title: 'By date added to favorites',
          value: 'original'
        },
        {
          title: 'By release update date',
          value: 'updates'
        }
      ],
      group: [
        {
          title: 'No grouping',
          value: 'original'
        },
        {
          title: 'By years',
          value: 'years'
        },
      ]
    }
  },

  computed: {
    ...mapState('favorites', {
      _sort: s => s.settings.sort,
      _group: s => s.settings.group,
      _show_seen: s => s.settings.show_seen,
      _show_completed: s => s.settings.show_completed,
    })
  },

  methods: {

    ...mapActions('favorites', {
      _setSettingsSort: 'setSettingsSort',
      _setSettingsGroup: 'setSettingsGroup',
      _setSettingsShowSeen: 'setSettingsShowSeen',
      _setSettingsShowCompleted: 'setSettingsShowCompleted',
    })

  }

}
</script>
