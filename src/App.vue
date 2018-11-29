<template>
  <mdc-layout-app>
    <mdc-toolbar slot="toolbar" fixed>
      <mdc-toolbar-row>
        <mdc-toolbar-section align-start >
          <mdc-toolbar-menu-icon event="toggle-drawer"></mdc-toolbar-menu-icon>
          <mdc-toolbar-title><router-link to="/" class="title">Buntata</router-link></mdc-toolbar-title>
        </mdc-toolbar-section>
        <mdc-toolbar-section align-end>
          <mdc-toolbar-icon icon="person" @click="dialogOpen=true"></mdc-toolbar-icon>
          <mdc-toolbar-icon icon="language" @click="languageMenuOpen=true"></mdc-toolbar-icon>
          <mdc-menu v-model="languageMenuOpen" @select="onSelect">
            <mdc-menu-item v-for="language in languages" :key="language.locale"><flag :squared="false" :iso="language.flag" class="flag-icon" />{{ language.name }}</mdc-menu-item>
          </mdc-menu>
        </mdc-toolbar-section>
      </mdc-toolbar-row>
    </mdc-toolbar>
    <mdc-drawer slot="drawer" toggle-on="toggle-drawer" temporary>
      <mdc-drawer-header>
        <img src="./assets/logo.svg" id="logo">
      </mdc-drawer-header>
      <mdc-drawer-list>
          <mdc-drawer-item start-icon="home" to="/">{{ $t('menuHome') }}</mdc-drawer-item>
          <mdc-drawer-item start-icon="view_list" to="/datasource">{{ $t('menuDatasources') }}</mdc-drawer-item>
          <mdc-drawer-item start-icon="chrome_reader_mode" to="/catalogue">{{ $t('menuCatalogue') }}</mdc-drawer-item>
          <mdc-drawer-item start-icon="info" to="/about">{{ $t('menuAbout') }}</mdc-drawer-item>
      </mdc-drawer-list>
    </mdc-drawer>
    <main class="content" >
      <div id="app">
        <div id="ie-banner" class="mdc-elevation mdc-elevation--z1"><mdi-alert-icon/><span v-html="$t('warningIE')" /><mdi-alert-icon/></div>
        <router-view :key="$route.path"/>
      </div>
    </main>
    <mdc-layout-grid class="footer">
      <mdc-layout-cell desktop=7 tablet=8>
        <mdc-body class="copyright">&copy; {{ new Date().getFullYear() }}</mdc-body>
        <span class="nowrap">
          <a href="http://www.hutton.ac.uk"><img class="logo" :src="require(`@/assets/img/jhi-white.svg`)"></a>
          <a href="https://ics.hutton.ac.uk"><img class="logo" :src="require(`@/assets/img/ics-sdg-white.svg`)"></a>
        </span>
      </mdc-layout-cell>
      <mdc-layout-cell desktop=5 tablet=8>
        <mdc-button class="social-button twitter" v-on:click="openUrl('https://twitter.com/BuntataApp', true)"><mdi-twitter-icon /></mdc-button>
        <mdc-button class="social-button email" v-on:click="openUrl('mailto:cropgeeksapps@hutton.ac.uk')"><mdi-email-icon /></mdc-button>
        <mdc-button class="social-button github" v-on:click="openUrl('https://github.com/buntata/buntata-web', true)"><mdi-github-circle-icon /></mdc-button>
        <mdc-button class="social-button website" v-on:click="openUrl('https://ics.hutton.ac.uk/get-buntata', true)"><mdi-earth-icon /></mdc-button>
      </mdc-layout-cell>
    </mdc-layout-grid>

    <mdc-dialog v-model="dialogOpen" accent :title="$t('dialogLoginTitle')" :accept="$t('buttonLogin')" :cancel="$t('buttonCancel')" @accept="onLogin" @validate="validateLogin">
      <mdc-textfield v-model="login.username" fullwidth label="Username" />
      <mdc-textfield v-model="login.password" fullwidth type="password" label="Password" />
    </mdc-dialog>
  </mdc-layout-app>
</template>

<script>
  import { mapGetters } from 'vuex'
  require('mdi-vue/EarthIcon')
  require('mdi-vue/EmailIcon')
  require('mdi-vue/TwitterIcon')
  require('mdi-vue/GithubCircleIcon')
  require('mdi-vue/AlertIcon')

  global.jQuery = require('jquery')
  var $ = global.jQuery
  window.$ = $

  export default {
    name: 'app',
    data: function () {
      return {
        languageMenuOpen: false,
        dialogOpen: false,
        login: {
          username: null,
          password: null
        },
        languages: [{
          locale: 'en_GB',
          flag: 'gb',
          name: 'British English'
        }, {
          locale: 'de_DE',
          flag: 'de',
          name: 'Deutsch - Deutschland'
        }]
      }
    },
    props: [ 'baseUrl' ],
    computed: {
      ...mapGetters([
        'locale'
      ])
    },
    methods: {
      onSelect: function (locale) {
        this.$i18n.locale = this.languages[locale.index].locale
        this.$store.dispatch('ON_LOCALE_CHANGED', this.languages[locale.index].locale)
      },
      onLogin: function () {
        this.login.username = null
        this.login.password = null
      },
      validateLogin: function ({ accept }) {
        var vm = this

        var user = {
          username: this.login.username,
          password: this.login.password
        }

        // Then send the request
        this.authAjax(this.baseUrl + 'token', 'POST', user, 'json', function (result) {
          // If it's successful, finally store them
          vm.$store.dispatch('ON_TOKEN_CHANGED', result)
          // Then accept the dialog
          accept()
        }, function () {
          // If they're wrong, remove
          vm.$store.dispatch('ON_TOKEN_CHANGED', null)
        })
      }
    },
    mounted: function () {
      if (this.locale) {
        var vm = this
        this.$i18n.locale = this.languages.map(function (l) {
          return l.locale
        })
        .filter(function (l) {
          return vm.locale === l
        })
      }

      var ua = navigator.userAgent
      var isIe = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1

      if (isIe === true) {
        $('#ie-banner').show()
      } else {
        $('#ie-banner').remove()
      }

      // Check if the token is still valid
      var t = this.$store.getters.token
      if (t && ((new Date().getTime() - new Date(t.createdOn).getTime()) > t.lifetime)) {
        t = null
        this.$store.dispatch('ON_TOKEN_CHANGED', t)
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  #ie-banner {
    min-height: 40px;
    background-color: #e74c3c;
    line-height: 40px;
    font-weight: 500;
    font-size: 1.25rem;
    color: white;
    padding: 10px;
    text-align: center;
  }
  #ie-banner > * {
    vertical-align: middle;
  }
  #ie-banner > svg {
    fill: white;
    margin: 0 15px;
  }
  #ie-banner > a {
    color: white;
  }
  #ie-banner > a:hover {
    color: lightgray;
  }

  .nowrap {
    white-space: nowrap;
  }

  .logo {
    height: 56px;
    width: auto;
    margin: auto;
    padding-left: 16px;
    max-width: 45%;
  }

  .content {
    min-height: calc(100vh - 64px);
  }

  .footer {
    min-height: 80px;
    background-color: #424242;
    padding: 16px;
    color: white;
    fill: white;
  }

  .footer .copyright {
    display: inline-block;
  }

  .footer * {
    line-height: 56px;
    vertical-align: middle;
    margin: 0;
  }

  .footer .social-button {
    width: 56px;
    height: 56px;
    float: right;
  }

  .footer .social-button svg {
    transition: fill .1s ease-in-out;
  }

  .footer .social-button.twitter:hover svg {
    fill: #1da1f2;
  }

  .footer .social-button.email:hover svg {
    fill: #c71610;
  }

  .footer .social-button.website:hover svg {
    fill: #4caf50;
  }

  .footer .social-button.github:hover svg {
    fill: #6e5494;
  }

  #logo {
    padding: 35px;
    width: 285px;
    height: 285px;
    max-width: 100%;
    max-height: 100%;
    box-sizing: border-box;
  }

  .mdc-drawer-header {
    height: 320px;
    background-color: #444;
  }

  .title {
    color: inherit;
    text-decoration: none;
    font-weight: inherit;
  }

  .flag-icon {
    margin-right: 10px;
  }
</style>
