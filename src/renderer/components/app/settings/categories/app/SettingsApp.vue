<template>
  <v-card>
    <v-list dense>
      <template v-for="(item, k) in settings">
        <v-divider v-if="k > 0" :key="`d:${k}`"/>
        <v-list-item :key="k" @click="item.action">
          <v-list-item-content>
            <v-list-item-title v-text="item.title" :class="item.classes"/>
          </v-list-item-content>
          <v-list-item-action class="text-right">
            <v-list-item-subtitle v-text="item.value"/>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>

<script>

import { meta, repository } from '@package'
import { shell } from 'electron'

export default {
  computed: {

    /**
     * Get settings items
     *
     * @return array
     */
    settings () {
      return [
        {
          title: 'Анилибрия',
          value: meta.links.anilibria,
          action: () => require('@electron/remote').shell.openExternal(meta.links.anilibria),
        },
        {
          title: 'Поддержать проект',
          value: 'Яндекс.Деньги, QIWI, PayPal',
          action: () => require('@electron/remote').shell.openExternal(meta.links.donate)
        },
        {
          title: 'Telegram-канал не официальных релизов',
          action: () => require('@electron/remote').shell.openExternal(meta.links.unofficial)
        },
        {
          title: 'Telegram-канал',
          value: '@anilibrix',
          action: () => require('@electron/remote').shell.openExternal(meta.links.telegram)
        },
        {
          title: 'Исходный код',
          value: '/anilibrix',
          action: () => require('@electron/remote').shell.openExternal(repository.url)
        },
      ]
    },
  }
}

</script>
