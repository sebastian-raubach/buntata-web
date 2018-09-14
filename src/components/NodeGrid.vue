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

    <mdc-fab v-if="nodeId" icon="home" fixed @click="$router.push('/')"></mdc-fab>
  </mdc-layout-grid>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Node from '@/components/Node'

  export default {
    data: function () {
      return {
        nodes: null,
        nodesUnfiltered: [],
        nodeId: null
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

          this.nodeId = this.$route.params.parent_id

          // If there is no parent, show the root nodes, else get children of the parent
          if (!this.nodeId) {
            url = this.baseUrl + 'datasource/' + this.datasource.id + '/nodes/?type=root'
          } else {
            url = this.baseUrl + 'node/?nodeParentId=' + this.nodeId
          }

          // Request the data
          this.$jQuery.getJSON(url, function (data) {
            if (data.length === 1) {
              vm.$router.replace('/detail/' + data[0].id)
            } else if (data.length === 0) {
              vm.$router.replace('/detail/' + this.nodeId)
            } else {
              // Sort them based on their name
              if (vm.nodeId) {
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
        this.$jQuery.getJSON(this.baseUrl + 'datasource/' + this.datasource.id, function (data) {
          vm.$store.dispatch('ON_DATASOURCE_CHANGED', data[0])
          vm.update()
        })
      }
    }
  }
</script>