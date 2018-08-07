<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">Buntata</span>
        <div class="android-header-spacer mdl-layout-spacer"></div>
        <form v-show="['nodegrid'].indexOf($route.name) > -1" v-on:submit.prevent="onSearchClicked()">
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
            <label class="mdl-button mdl-js-button mdl-button--icon" for="search">
              <i class="material-icons">search</i>
            </label>
            <div class="mdl-textfield__expandable-holder">
              <input :value="searchTerm" class="mdl-textfield__input" type="text" id="search" ref="searchTerm">
              <label class="mdl-textfield__label" for="sample-expandable">Expandable Input</label>
            </div>
          </div>
        </form>
      </div>
    </header>
    <div class="mdl-layout__drawer">
      <div id="drawer-header">
        <img src="./assets/logo.svg" id="logo">
        <p>Buntata</p>
      </div>
      <nav class="mdl-navigation">
        <router-link class="mdl-navigation__link" to="/" @click.native="hideMenu">Home</router-link>
        <router-link class="mdl-navigation__link" to="/datasource" @click.native="hideMenu">Datasources</router-link>
        <router-link class="mdl-navigation__link" to="/catalogue" @click.native="hideMenu">Catalogue</router-link>
        <router-link class="mdl-navigation__link" to="/about" @click.native="hideMenu">About</router-link>
      </nav>
    </div>
    <main class="mdl-layout__content">
      <div class="page-content">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  require('material-design-lite')

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
</style>
