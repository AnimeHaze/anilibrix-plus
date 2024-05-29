<template>
  <v-layout fill-height align-center justify-center @keyup.enter="authorize">
    <v-row justify="center" align="center">

      <v-col cols="12" sm="3" align-self="center">
        <v-img class="image" contain :src="image"/>
      </v-col>

      <v-col cols="12" sm="6" align-self="center">
        <v-card flat color="transparent">
          <v-card-title>Авторизация</v-card-title>
          <v-card-text>
            <div>Укажите данные, с которыми вы зарегистрировались на сайте Анилибрии</div>
          </v-card-text>
          <!-- Login / Email -->
          <!-- Password -->
          <v-layout class="py-6 pt-2">
            <v-text-field
              v-model="login"
              outlined
              hide-details
              class="mr-1"
              color="grey"
              placeholder="Email или логин"
              prepend-inner-icon="mdi-account">
            </v-text-field>
            <v-text-field
              v-model="password"
              outlined
              hide-details
              class="ml-1"
              type="password"
              placeholder="Пароль"
              prepend-inner-icon="mdi-lock">
            </v-text-field>
          </v-layout>

          <!-- Actions -->
          <v-layout>
            <v-btn v-bind="{loading}" class="mr-1" :disabled="$v.$invalid" @click="authorize">Авторизация</v-btn>
            <v-btn v-bind="{loading}" text @click="toBack">Назад</v-btn>
          </v-layout>

          <v-divider class="my-6" />

          <v-layout justify-center>
            <v-btn :color="'blue darken-1'" @click="authorizeWithVK">Вход через VK</v-btn>
          </v-layout>

        </v-card>
      </v-col>

    </v-row>
  </v-layout>
</template>

<script>

// Images
import LibriaTyan03 from '@assets/images/libria-tyan/LibriaTyan03.svg'
import { ipcRenderer } from "electron";
// Utils
import { required } from 'vuelidate/lib/validators'
import { BackViewMixin } from '@mixins/views'
import { invokeSafeStorageEncrypt } from '@main/handlers/app/appHandlers'

export default {
  name: 'Account.Login.View',
  mixins: [BackViewMixin],
  data () {
    return {
      tab: 0,
      from: null,
      login: null,
      image: LibriaTyan03,
      loading: false,
      password: null,
    }
  },

  validations: {
    login: { required },
    password: { required },
  },
  mounted () {
    ipcRenderer.on('VK_CODE', async (event, session) => {
      try {
        this.loading = true
        await this.$store.dispatchPromise('app/account/setSession', session)

        // Get profile data
        await this.$store.dispatchPromise('app/account/getProfile')
        await this.toBack()

        // Get user favorites
        this.$store.dispatchPromise('favorites/getFavorites')
        this.loading = false
      } catch (e) {
        console.error(e)

        if (e.response.status === 401) {
          this.$toasted.error('Пользователь не зарегистрирован')
        }
        this.loading = false
      }
    })
  },
  beforeDestroy() {
    ipcRenderer.removeAllListeners('VK_CODE')
  },
  methods: {

    authorizeWithVK () {
      window.open(
        'https://id.vk.com/auth?return_auth_hash=677a695397f7de30e9&redirect_uri=https%3A%2F%2Fwww.anilibria.tv%2Fpublic%2Fvk.php&redirect_uri_hash=12e7b3a47bed04dc26&force_hash=&app_id=5315207&response_type=code&code_challenge=&code_challenge_method=&scope=0&state='
        ,'targetWindow',
        `toolbar=no,
                location=no,
                status=no,
                menubar=no,
                scrollbars=yes,
                resizable=yes,
                width=SomeSize,
                height=SomeSize`
      )
    },
    /**
     * Authorize
     *
     * @return {Promise<void>}
     */
    async authorize () {
      if (!this.$v.$invalid) {
        try {
          this.loading = true

          // Make login request with provided credentials
          // Save account session
          const payload = {
            login: this.login,
            password: this.password
          }
          const session = await this.$store.dispatchPromise('app/account/login', payload)
          await Promise.allSettled([
            await invokeSafeStorageEncrypt('user.login', this.login),
            await invokeSafeStorageEncrypt('user.password', this.password)
          ])
          await this.$store.dispatchPromise('app/account/setSession', session)

          // Get profile data
          await this.$store.dispatchPromise('app/account/getProfile')
          await this.toBack()

          // Get user favorites
          this.$store.dispatchPromise('favorites/getFavorites')

        } finally {
          this.loading = false
        }
      }
    }
  }

}
</script>
