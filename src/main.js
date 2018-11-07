// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'es6-promise/auto'

import Vue from 'vue'
import VueMDCAdapter from 'vue-mdc-adapter'
import './theme.scss'
import App from './App'
import router from './router'
import store from './store/store'
import VueAnalytics from 'vue-analytics'
import Mixin from './Mixin.js'
import { i18n } from './plugins/i18n.js'
import FlagIcon from 'vue-flag-icon'

Vue.use(FlagIcon)

// Make sure jQuery is available
Vue.use({
  install: function (Vue, options) {
    Vue.prototype.$jQuery = require('jquery')
  }
})

Vue.config.productionTip = false

Vue.use(VueMDCAdapter)

// Check if production environment
const isProd = process.env.NODE_ENV === 'production'

// Add Google Analytics
Vue.use(VueAnalytics, {
  id: 'UA-49362218-9',
  router,
  autoTracking: {
    exceptions: true
  },
  debug: {
    enabled: !isProd,
    sendHitTask: isProd
  }
})

Vue.mixin(Mixin)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  i18n: i18n,
  store: store,
  template: '<App/>',
  components: { App }
})
