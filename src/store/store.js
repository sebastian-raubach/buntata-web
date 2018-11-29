import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    datasource: null,
    locale: null,
    searchTerm: null,
    token: null
  },
  getters: {
    datasource: state => state.datasource,
    locale: state => state.locale,
    searchTerm: state => state.searchTerm,
    token: state => state.token
  },
  actions: {
    ON_DATASOURCE_CHANGED: function ({ commit }, datasource) {
      commit('ON_DATASOURCE_CHANGED_MUTATION', datasource)
    },
    ON_LOCALE_CHANGED: function ({ commit }, locale) {
      commit('ON_LOCALE_CHANGED_MUTATION', locale)
    },
    ON_SEARCH_TERM_CHANGED: function ({ commit }, searchTerm) {
      commit('ON_SEARCH_TERM_CHANGED_MUTATION', searchTerm)
    },
    ON_TOKEN_CHANGED: function ({ commit }, token) {
      commit('ON_TOKEN_CHANGED_MUTATION', token)
    }
  },
  mutations: {
    ON_DATASOURCE_CHANGED_MUTATION: function (state, newDatasource) {
      state.datasource = newDatasource
    },
    ON_LOCALE_CHANGED_MUTATION: function (state, newLocale) {
      state.locale = newLocale
    },
    ON_SEARCH_TERM_CHANGED_MUTATION: function (state, newSearchTerm) {
      state.searchTerm = newSearchTerm
    },
    ON_TOKEN_CHANGED_MUTATION: function (state, newToken) {
      state.token = newToken
    }
  },
  plugins: [
    createPersistedState()
  ]
})

export default store
