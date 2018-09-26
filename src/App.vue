<template>
  <mdc-layout-app>
    <mdc-toolbar slot="toolbar" fixed>
      <mdc-toolbar-row>
        <mdc-toolbar-section align-start >
          <mdc-toolbar-menu-icon event="toggle-drawer"></mdc-toolbar-menu-icon>
          <mdc-toolbar-title><router-link to="/" class="title">Buntata</router-link></mdc-toolbar-title>
        </mdc-toolbar-section>
      </mdc-toolbar-row>
    </mdc-toolbar>
    <mdc-drawer slot="drawer" toggle-on="toggle-drawer" temporary>
      <mdc-drawer-header>
        <img src="./assets/logo.svg" id="logo">
      </mdc-drawer-header>
      <mdc-drawer-list>
          <mdc-drawer-item start-icon="home" to="/">Home</mdc-drawer-item>
          <mdc-drawer-item start-icon="view_list" to="/datasource">Datasources</mdc-drawer-item>
          <mdc-drawer-item start-icon="chrome_reader_mode" to="/catalogue">Catalogue</mdc-drawer-item>
          <mdc-drawer-item start-icon="info" to="/about">About</mdc-drawer-item>
      </mdc-drawer-list>
    </mdc-drawer>
    <main class="content" >
      <div id="app">
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
  </mdc-layout-app>
</template>

<script>
  require('mdi-vue/EarthIcon')
  require('mdi-vue/EmailIcon')
  require('mdi-vue/TwitterIcon')
  require('mdi-vue/GithubCircleIcon')

  global.jQuery = require('jquery')
  var $ = global.jQuery
  window.$ = $

  export default {
    name: 'app'
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
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
</style>
