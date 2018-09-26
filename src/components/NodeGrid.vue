<template>
  <mdc-layout-grid>
    <mdc-layout-cell desktop=12 tablet=8>
      <mdc-text typo='headline3' v-if="datasource">{{ datasource.name }}</mdc-text>
      <mdc-text typo='headline3' v-else>>No data source selected</mdc-text>
      <mdc-text typo='headline6'>Select the item that you want to investigate.</mdc-text>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=3 v-for="node in nodes" :key="node.id">
      <node :node="node" :showKeyName="false" :base-url="baseUrl" @click.native="onNodeClicked(node)"></node>
    </mdc-layout-cell>

    <mdc-fab v-if="parentId" icon="home" fixed @click="$router.push('/')"></mdc-fab>
  </mdc-layout-grid>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Node from '@/components/Node'

  export default {
    data: function () {
      return {
        // Currently visible nodes. Potentially filtered to match search.
        nodes: null,
        // All nodes, i.e. unfiltered
        nodesUnfiltered: [],
        // Id of the parent node
        parentId: null
      }
    },
    components: {
      Node
    },
    props: [ 'baseUrl' ],
    computed: {
      ...mapGetters([
        'datasource',
        'searchTerm'
      ])
    },
    watch: {
      // Listen to search events
      searchTerm: function (newSearchTerm, oldSearchTerm) {
        this.search(newSearchTerm)
      }
    },
    methods: {
      // Search for a specific term. TODO: search children as well
      search: function (searchTerm) {
        if (searchTerm === '') {
          this.nodes = this.nodesUnfiltered
        } else {
          this.nodes = this.nodesUnfiltered.filter(function (node) {
            return node.description.includes(searchTerm)
          })
        }
      },
      // Go to the next level
      onNodeClicked: function (node) {
        this.$router.push('/' + node.id)
      },
      update: function () {
        // Load the data from the server
        if (this.datasource !== null) {
          var vm = this
          var url

          // Get parent id from the URL
          this.parentId = this.$route.params.parent_id

          // If there is no parent, show the root nodes, else get children of the parent
          if (!this.parentId) {
            url = this.baseUrl + 'datasource/' + this.datasource.id + '/nodes/?type=root'
          } else {
            url = this.baseUrl + 'node/?nodeParentId=' + this.parentId
          }

          // Request the data
          this.getJSON(url, function (data) {
            if (data.length === 1 && !vm.datasource.showSingleChild) {
              // If there's only one child and we're not supposed to show it, redirect straight away
              vm.$router.replace('/detail/' + data[0].id)
            } else if (data.length === 0) {
              // Else if there are no children, redirect to this node's details page
              vm.$router.replace('/detail/' + vm.parentId)
            } else {
              // Sort them based on their name
              if (vm.parentId) {
                data.sort(function (a, b) {
                  if (a.name < b.name) {
                    return -1
                  } else if (a.name > b.name) {
                    return 1
                  } else {
                    return 0
                  }
                })
              }
              vm.nodes = data
              vm.nodesUnfiltered = data
            }
          })
        }
      }
    },
    mounted: function () {
      // Redirect to datasource select screen if no datasource has been selected
      if (!this.datasource) {
        this.$router.push('/datasource')
      } else {
        var vm = this
        this.getJSON(this.baseUrl + 'datasource/' + this.datasource.id, function (data) {
          if (vm.datasource.id !== data[0].id) {
            vm.$store.dispatch('ON_DATASOURCE_CHANGED', data[0])
          }
          vm.update()
        })
      }
    }
  }
</script>