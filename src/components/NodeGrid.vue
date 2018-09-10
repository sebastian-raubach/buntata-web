<template>
  <div>
    <div class="header-container">
      <button v-if="nodeParentIds.length > 0" class="mdl-button mdl-button--fab mdl-button--colored mdl-shadow--6dp" @click="back()"><i class="material-icons">arrow_back</i></button>
      <h2 class="header" v-if="datasource">{{ datasource.name }}</h2>
      <h2 class="header" v-else>No data source selected</h2>
      <h4 v-if="searchTerm">Searching for: '{{ searchTerm }}'</h4>
      <h5>Select the item that you want to investigate.</h5>
    </div>
    <ul class="mdl-grid nodes">
      <a class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-shadow--3dp" v-if="nodes" v-for="node in nodes" :key="node.id">
        <node :node="node" :base-url="baseUrl" @click.native="onNodeClicked(node)"></node>
      </a>
    </ul>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Node from '@/components/Node'

  export default {
    data: function () {
      return {
        nodes: null,
        nodesUnfiltered: [],
        nodeParentIds: []
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
      // On back press, pop last visited item from stack
      back: function () {
        this.nodeParentIds.pop()
        this.update()
      },
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
        this.nodeParentIds.push(node.id)
        this.update()
      },
      update: function () {
        // Load the data from the server
        if (this.datasource !== null) {
          var vm = this
          var url

          var nodeId = this.nodeParentIds[this.nodeParentIds.length - 1]

          // If there is no parent, show the root nodes, else get children of the parent
          if (this.nodeParentIds.length === 0) {
            url = this.baseUrl + 'datasource/' + this.datasource.id + '/nodes/?type=root'
          } else {
            url = this.baseUrl + 'node/?nodeParentId=' + nodeId
          }

          // Request the data
          this.$jQuery.getJSON(url, function (data) {
            if (data.length === 1) {
              vm.$router.push('/detail/' + data[0].id)
            } else if (data.length === 0) {
              vm.$router.push('/detail/' + nodeId)
            } else {
              // Sort them based on their name
              if (vm.nodeParentIds.length > 0) {
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
          console.log(data[0])
          vm.$store.dispatch('ON_DATASOURCE_CHANGED', data[0])
          vm.update()
        })
      }
    }
  }
</script>

<style scoped>
  .header-container {
    margin-left: 15px;
    margin-right: 15px;
  }
  .header-container > button {
    margin-right: 15px;
  }
  .header {
    display: inline-block;
    vertical-align: middle;
  }
  .nodes .icon {
    width: 48px;
  }
  .nodes .name {
    padding: 15px;
    width: 100%;
  }
</style>
