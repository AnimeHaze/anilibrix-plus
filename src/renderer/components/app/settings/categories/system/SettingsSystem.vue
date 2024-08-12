<template>
  <div ref="settings">

    <div class="pa-4 caption grey--text">
      <div class="body-1">Application settings</div>
      <div>
        In this section, you can configure automatic release updates, system notifications
and other application parameters
      </div>
    </div>

    <!-- Appbar inverse -->
    <template v-if="!this.isMac">
      <v-card class="mt-2">
        <v-list-item dense @click="_setAppbarRight(!_appbar_right)">
          <v-list-item-title>
            Move the control buttons to the right
          </v-list-item-title>

          <v-list-item-action class="mr-2">
            <v-switch :input-value="_appbar_right" @change="_setAppbarRight"/>
          </v-list-item-action>
        </v-list-item>

        <v-card-text class="pt-2">
          <div class="caption">
            Move window control buttons (minimize, close and maximize) to the right
          </div>
        </v-card-text>
      </v-card>
    </template>

    <!-- Appbar inverse -->
    <v-card class="mt-2">
      <v-list-item dense @click="_setFilterNotify(!_filter_notify)">
        <v-list-item-title>
          Filter notifications by favorites
        </v-list-item-title>

        <v-list-item-action class="mr-2">
          <v-switch :input-value="_filter_notify" @change="_setFilterNotify"/>
        </v-list-item-action>
      </v-list-item>

      <v-card-text class="pt-2">
        <div class="caption">
          Enables displaying notifications only for releases from favorites
        </div>
      </v-card-text>
    </v-card>

    <v-card class="mt-2">
      <v-list-item dense @click="_setIgnoreCerts(!_ignore_certs)">
        <v-list-item-title>Ignore certificate errors</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_ignore_certs" @change="_setIgnoreCerts"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="pt-2 caption">
        Ignoring Trusted Certificate Checking
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-text class="mt-2">
        <v-text-field
          outlined
          class="mb-2"
          :value="_proxy"
          @input="setProxyServer($event)"
          label="Proxy server"
          persistent-hint
        />

        <div class="caption">
          <div>
            Proxy for connecting to static and API server. HTTP and HTTPS supported
          </div>
          <div>
            <b>After changing the access point, it is recommended to restart the application</b>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- API Endpoint -->
    <v-card>
      <v-card-text class="mt-2">
        <v-combobox
          outlined
          :value="_api_endpoint"
          @input="_setAPIEndpoint($event ? $event : process.env.API_ENDPOINT_URL)"
          :items="['https://anilibria.tv/', 'https://wwnd.space/', 'https://anilibriaqt.anilib.top/', 'https://anilibrix.anilib.top/', 'https://anilibria.animehaze.me/']"
          label="API connection point"
          persistent-hint
        />

        <v-combobox
          outlined
          class="mb-2"
          :value="_static_endpoint"
          @input="_setAPIStaticEndpoint($event ? $event : process.env.STATIC_ENDPOINT_URL)"
          :items="['https://static-libria.weekstorm.one/', 'https://static.anilibria.tv/', 'https://static.wwnd.space/', 'https://anilibriaqt.anilib.top/', 'https://anilibrix.anilib.top/', 'https://anilibria.animehaze.me/']"
          label="Connection point to the static server"
          persistent-hint
        />

        <div class="caption">
          You can use the main domain if it is not blocked by your provider, or use
          additional domains

          You can enter your connection point to the API and the static server in the "API connection point" and "Static server connection point" fields

        <b>After changing the access point, it is recommended to restart the application</b>
        </div>
      </v-card-text>
    </v-card>

    <v-card class="mt-2">
      <v-list-item dense @click="_setDRPC(!_drpc_enabled)">
        <v-list-item-title>Discord Rich Presence</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_drpc_enabled" @change="_setDRPC"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="pt-2 caption">
        The app will display information about the anime being viewed in Discord Rich Presence
      </v-card-text>
    </v-card>
    <v-divider/>

    <!-- System Notifications -->
    <v-card>
      <v-list-item dense @click="_setSystemNotifications(!_notifications_system)">
        <v-list-item-title>Show system notifications</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_notifications_system" @change="_setSystemNotifications"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="pt-2">
        <div class="caption">
          “If the app detects an update while downloading the latest releases, 
          it will display a system notification about the new episode.
        </div>
      </v-card-text>
    </v-card>


    <!-- Auto update -->
    <v-card class="mt-2">
      <v-list-item dense @click="_setUpdates(!_updates_enabled)">
        <v-list-item-title>Automatic release update</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_updates_enabled" @change="_setUpdates"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="pt-2 caption">
        The app will update the latest releases in the background, even if it is minimized
      </v-card-text>
    </v-card>
    <v-divider/>

    <!-- Update Timeouts -->
    <v-card>
      <v-card-text class="pb-2">
        <div class="caption">
          You can specify how often the application will update releases in the background
        </div>
      </v-card-text>
      <v-card-text>
        <v-text-field
          outlined
          hide-details
          class="mb-2"
          type="number"
          label="Frequency of release updates"
          suffix="min"
          :value="_updates_timeout"
          @input="_setUpdatesTimeout($event ? parseInt($event) : 1)">
        </v-text-field>
      </v-card-text>
    </v-card>


    <!-- Ads -->
<!--    <v-card class="mt-2">-->
<!--      <v-list-item dense @click="_setAds(!_ads)">-->
<!--        <v-list-item-title>Показывать рекламу</v-list-item-title>-->
<!--        <v-list-item-action class="mr-2">-->
<!--          <v-switch :input-value="_ads" @change="_setAds"/>-->
<!--        </v-list-item-action>-->
<!--      </v-list-item>-->
<!--      <v-card-text class="pt-2 caption">-->
<!--        <div>Спасибо, что выбрали <b>Анилибрию!</b></div>-->
<!--        <div>-->
<!--          Мы понимаем, что реклама никому не нравится, но это бесплатный способ поддержать проект.-->
<!--          Отключение рекламы - абсолютно бесплатно, но, если вы хотите поддержать нас, то оставьте рекламу включенной.-->
<!--          Обещаем, что не будем сильно навязчивыми (✿◠‿◠)-->
<!--        </div>-->
<!--      </v-card-text>-->
<!--    </v-card>-->

    <!-- Ads Maximum -->
<!--    <v-card class="mt-2">
      <v-list-item dense @click="_setAdsMaximum(!_ads_maximum)">
        <v-list-item-title>Показывать рекламу перед каждым эпизодом</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_ads_maximum" @change="_setAdsMaximum"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="pt-2 caption">
        <div>Максимальная поддержка проекта!</div>
        <div>Реклама будет показываться перед каждым просмотром любого эпизода</div>
      </v-card-text>
    </v-card>-->

    <div v-show="_isAuthorized" class="pa-4 caption grey--text">
      <div class="body-1">Snapshots</div>
      <div>You can create backup copies of application data linked to your anilibria account</div>
    </div>

    <v-card v-show="_isAuthorized">
      <v-list dense>
        <template>
          <v-list-item @click="snapshots">
            <v-list-item-content>
              <v-list-item-title v-text="'List of snapshots'"/>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-card>

    <template v-if="isMounted">
      <component
        :is="Confirm"
        ref="confirm"
        v-on:openSnapshots="showSnapshotsList"/>

      <component
        :is="snapshotsList"
        ref="snapshotsList"></component>
    </template>
  </div>
</template>

<script>

import { mapActions, mapGetters, mapState } from 'vuex'
import Confirm from '@components/app/settings/categories/system/dialogs/confirm.vue'
import snapshotsList from '@components/app/settings/categories/system/dialogs/snapshotsList.vue'
import { AppPlatformMixin } from '@mixins/app'
import {debounce} from "lodash";
import {invokeUpdateProxy} from "@main/handlers/app/appHandlers";

export default {
  mixins: [AppPlatformMixin],
  data () {
    return {
      isMounted: false,
      Confirm,
      snapshotsList
    }
  },

  computed: {
    ...mapGetters('app/account', { _isAuthorized: 'isAuthorized' }),
    ...mapState('app/settings/system', {
      _ads: s => s.ads.enabled,
      _ads_maximum: s => s.ads.maximum,
      _updates_enabled: s => s.updates.enabled,
      _updates_timeout: s => s.updates.timeout,
      _api_endpoint: s => s.api.endpoint,
      _static_endpoint: s => s.api.static_endpoint,
      _notifications_system: s => s.notifications.system,
      _appbar_right: s => s.appbar_right,
      _filter_notify: s => s.filter_notify,
      _drpc_enabled: s => s.drpc_enabled,
      _proxy: s => s.proxy,
      _ignore_certs: s => s.ignore_certs
    }),
  },

  methods: {
    setProxyServer: function ($event) {
      this._setProxy($event)
      invokeUpdateProxy($event)
    },
    showSnapshotsList: function () {
      this.$refs.confirm.hideDialog()
      this.$refs.snapshotsList.showDialog()
      this.$refs.snapshotsList.fetchSnapshots()
    },
    snapshots: function () {
      this.$refs.confirm.showDialog()
    },
    ...mapActions('app/settings/system', {
      _setAds: 'setAds',
      _setUpdates: 'setUpdates',
      _setAdsMaximum: 'setAdsMaximum',
      _setUpdatesTimeout: 'setUpdatesTimeout',
      _setSystemNotifications: 'setSystemNotifications',
      _setAPIEndpoint: 'setAPIEndpoint',
      _setAPIStaticEndpoint: 'setAPIStaticEndpoint',
      _setAppbarRight: 'setAppbarRight',
      _setFilterNotify: 'setFilterNotify',
      _setDRPC: 'setDRPC',
      _setProxy: 'setProxy',
      _setIgnoreCerts: 'setIgnoreCerts'
    })
  },

  mounted () {
    this.isMounted = true
  }
}
</script>
