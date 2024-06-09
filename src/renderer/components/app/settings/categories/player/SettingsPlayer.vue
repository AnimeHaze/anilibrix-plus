<template>
  <div ref="settings">

    <div class="pa-4 caption grey--text">
      <div class="body-1">Настройки воспроизведения релизов</div>
      <div>
        В данном разделе вы можете настроить возможность смотреть релизы, используя торренты,
        а также другие настройки воспроизведения
      </div>
    </div>

    <!-- Torrents -->
    <v-card>
      <v-card-subtitle class="pb-0 font-weight-bold">Торренты</v-card-subtitle>
      <v-card-text class="mt-2 caption">
        <div class="pb-2">
          Вы можете подключить торренты, которые автоматически буду связаны с эпизодами релизов
          и доступны для просмотра.
        </div>
        <div>
          Торренты не требуют стороннего плеера или клиента и доступны онлайн,
          в меню выбора качества воспроизведения релиза.
        </div>
      </v-card-text>
      <v-list-item dense @click="_setTorrentsProcess(!_torrents_process)">
        <v-list-item-title>Воспроизводить торренты</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_torrents_process" @change="_setTorrentsProcess"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="caption">
        Использование торрентов требует большего времени подключения и парсинга,
        что может негативно сказаться на скорости загрузки данных по релизам,
        особенно — при использовании прокси-сервера
      </v-card-text>
    </v-card>

    <!-- Autoplay -->
    <v-card class="mt-2">
      <v-list-item dense @click="_setAutoplayNext(!_autoplay_next)">
        <v-list-item-title>Автовоспроизведение следующего эпизода</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_autoplay_next" @change="_setAutoplayNext"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="pt-2 caption">
        После окончания эпизода плеер автоматически начнет воспроизведение следующего эпизода в релизе,
        при его наличии
      </v-card-text>
    </v-card>


    <!-- Buffer -->
    <v-card class="mt-2">
      <v-card-text class="pb-2 caption">
        <div>Размер видео буфера</div>
        <div>Величина буфера подгрузки видео, по умолчанию 5 минут</div>
      </v-card-text>
      <v-card-text>
        <v-text-field
          outlined
          hide-details
          min="60"
          class="mb-2"
          type="number"
          label="Размер буфера в секундах"
          suffix="сек"
          :value="_video_buffer"
          @input="_setVideoBuffer(parseInt($event) > 0 ? parseInt($event) : 60)">
        </v-text-field>
      </v-card-text>
      <v-card-text class="pt-0 caption">
        <div>Указывает величину буфера, который плеер держит в памяти и предзагружает видео во время просмотра</div>
      </v-card-text>
    </v-card>


    <!-- Opening Skip Button -->
    <v-card class="mt-2">
      <v-list-item dense @click="_setAutoSkip(!_auto_opening_skip)">
        <v-list-item-title>Автоматический пропуск опенинга</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_auto_opening_skip" @change="_setAutoSkip"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="pt-2 caption">
        <div>
          При наличии меток пропуска опенинга, он будет автоматически пропускаться
        </div>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-text class="caption">Горячая клавиша включения и выключения авто пропуска</v-card-text>
      <v-card-text>
        <v-text-field
          outlined
          hide-details
          class="mb-2"
          type="text"
          label="Нажми тут сочетание клавиш"
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
        <v-list-item-title>Кнопка пропуска опенинга</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_opening_skip_button" @change="_setOpeningSkipButton"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="pt-2 caption">
        <div>
          В интерфейсе плеера появится дополнительная кнопка, которая перемотает плеер на указанное количество секунд
        </div>
        <div>Данная кнопка не гарантирует корректный пропуск опенинга</div>
      </v-card-text>
    </v-card>
    <v-divider/>

    <!-- Opening Skip Button -->
    <v-card class="mt-2">
      <v-list-item dense @click="_setRutube(!_rutube)">
        <v-list-item-title>Загрузка видео с Rutube</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_rutube" @change="_setRutube"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="pt-2 caption">
        <div>
          Позволяет смотреть релизы размещенные только на сервере Rutube
        </div>
        <div>Может немного увеличить время загрузки каталога релизов и избранного где присутствют RuTube релизы</div>
      </v-card-text>
    </v-card>
    <v-divider/>

    <v-card>
      <v-card-text class="caption">Горячая клавиша кнопки пропуска опенинга</v-card-text>
      <v-card-text>
        <v-text-field
          outlined
          hide-details
          class="mb-2"
          type="text"
          label="Нажми тут сочетание клавиш"
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
      <v-card-text class="pb-2 caption">Вы можете указать на сколько секунд пропускать опенинг</v-card-text>
      <v-card-text>
        <v-text-field
          outlined
          hide-details
          class="mb-2"
          type="number"
          label="Количество секунд для пропуска опенинга"
          suffix="сек"
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
      _auto_opening_skip_key: s => s.opening.autoSkipKey,
      _rutube: s => s.rutube
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
      _setAutoSkipKey: 'setAutoSkipKey',
      _setRutube: 'setRutube'
    }),
  }

}
</script>
