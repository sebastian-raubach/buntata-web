<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title"><router-link to="/" class="title">Buntata</router-link></span>
        <div class="android-header-spacer mdl-layout-spacer"></div>
        <!-- <form v-show="['nodegrid'].indexOf($route.name) > -1" v-on:submit.prevent="onSearchClicked()">
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
            <label class="mdl-button mdl-js-button mdl-button--icon" for="search">
              <i class="material-icons">search</i>
            </label>
            <div class="mdl-textfield__expandable-holder">
              <input :value="searchTerm" class="mdl-textfield__input" type="text" id="search" ref="searchTerm">
              <label class="mdl-textfield__label" for="sample-expandable">Expandable Input</label>
            </div>
          </div>
        </form> -->
      </div>
    </header>
    <div class="mdl-layout__drawer">
      <div id="drawer-header">
        <img src="./assets/logo.svg" id="logo">
        <p>Buntata</p>
      </div>
      <nav class="mdl-navigation">
        <router-link class="mdl-navigation__link" to="/" @click.native="hideMenu"><mdi-home-icon/> Home</router-link>
        <router-link class="mdl-navigation__link" to="/datasource" @click.native="hideMenu"><mdi-server-icon/> Datasources</router-link>
        <router-link class="mdl-navigation__link" to="/catalogue" @click.native="hideMenu"><mdi-book-open-icon/> Catalogue</router-link>
        <router-link class="mdl-navigation__link" to="/about" @click.native="hideMenu"><mdi-information-icon/> About</router-link>
      </nav>
    </div>
    <main class="mdl-layout__content">
      <div class="page-content">
        <router-view :key="$route.path"></router-view>
      </div>
      <footer class="mdl-mini-footer footer">
        <div class="mdl-mini-footer__left-section">
          <div class="mdl-logo">
            &copy; {{ new Date().getFullYear() }}
          </div>
          <ul class="mdl-mini-footer__link-list">
            <li><a href="http://www.hutton.ac.uk"><img class="logo" :src="require(`@/assets/img/jhi-white.svg`)"></a></li>
            <li><a href="https://ics.hutton.ac.uk"><img class="logo" :src="require(`@/assets/img/ics-sdg-white.svg`)"></a></li>
          </ul>
        </div>
        <div class="mdl-mini-footer__right-section">
          <button class="mdl-mini-footer__social-btn social website" v-on:click="open('https://ics.hutton.ac.uk/get-buntata')"><mdi-earth-icon/></button>
          <button class="mdl-mini-footer__social-btn social email" v-on:click="open('mailto:cropgeeksapps@hutton.ac.uk')"><mdi-email-icon/></button>
          <button class="mdl-mini-footer__social-btn social twitter" v-on:click="open('https://twitter.com/BuntataApp', true)"><mdi-twitter-icon/></button>
        </div>
      </footer>
    </main>
    
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  require('material-design-lite')
  require('mdi-vue/TwitterIcon')
  require('mdi-vue/EmailIcon')
  require('mdi-vue/EarthIcon')
  require('mdi-vue/HomeIcon')
  require('mdi-vue/InformationIcon')
  require('mdi-vue/BookOpenIcon')
  require('mdi-vue/ServerIcon')

  global.jQuery = require('jquery')
  var $ = global.jQuery
  window.$ = $

  export default {
    name: 'app',
    methods: {
      hideMenu: function () {
        document.getElementsByClassName('mdl-layout__drawer')[0].classList.remove('is-visible')
        document.getElementsByClassName('mdl-layout__obfuscator')[0].classList.remove('is-visible')
      },
      onSearchClicked: function () {
        this.$store.dispatch('ON_SEARCH_TERM_CHANGED', this.$refs.searchTerm.value)
      },
      open: function (url, newTab) {
        if (newTab) {
          window.open(url, '_blank')
        } else {
          window.location = url
        }
      }
    },
    computed: {
      ...mapGetters([
        'searchTerm'
      ])
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

  #logo {
    padding: 35px;
    width: 240px;
    height: 240px;
    box-sizing: border-box;
    
  }
  #drawer-header {
    background-color: #444;
  }
  #drawer-header p {
    padding: 15px 35px;
    padding-top: 0;
    color: white;
    font-size: 24px;
  }
  .mdl-layout__drawer {
    border-right: 0 !important;
  }
  .page-content {
    min-height: calc(100vh - 64px);
  }
  .footer {
    padding: 12px 24px !important;
  }
  .mdl-mini-footer__right-section {
    padding: 4px 0;
  }
  .mdl-mini-footer__social-btn.social {
    height: 42px;
    width: 42px;
  }
  .social:hover {
    transition: background-color 200ms ease-in-out;
    cursor: pointer;
  }
  .twitter:hover {
    background-color: #1DA1F2;
  }
  .email:hover {
    background-color: #c71610;
  }
  .website:hover {
    background-color: #4caf50;
  }
  .logo {
    height: 50px;
    width: auto;
    margin: auto;
  }
  .mdl-mini-footer .mdl-logo {
    line-height: 50px !important;
  }
  .title {
    color: inherit;
    text-decoration: none;
    font-weight: inherit;
  }
</style>
