import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    datasource: null,
    searchTerm: null
  },
  getters: {
    datasource: state => state.datasource,
    searchTerm: state => state.searchTerm
  },
  actions: {
    ON_DATASOURCE_CHANGED: function ({ commit }, datasource) {
      commit('ON_DATASOURCE_CHANGED_MUTATION', datasource)
    },
    ON_SEARCH_TERM_CHANGED: function ({ commit }, searchTerm) {
      commit('ON_SEARCH_TERM_CHANGED_MUTATION', searchTerm)
    }
  },
  mutations: {
    ON_DATASOURCE_CHANGED_MUTATION: function (state, newDatasource) {
      state.datasource = newDatasource
    },
    ON_SEARCH_TERM_CHANGED_MUTATION: function (state, newSearchTerm) {
      state.searchTerm = newSearchTerm
    }
  },
  plugins: [
    createPersistedState()
  ]
})

export default store
