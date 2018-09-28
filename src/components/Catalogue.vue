<template>
  <mdc-layout-grid>
    <mdc-layout-cell desktop=12 tablet=8>
      <mdc-text typo='headline3'>Please select a node:</mdc-text>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=3 v-for="node in nodes" :key="node.id">
      <Node :node="node" :showKeyName="true" :base-url="baseUrl" @click.native="onNodeClicked(node)"></Node>
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Node from '@/components/Node'

  export default {
    data: function () {
      return {
        // All the leaf nodes
        nodes: null
      }
    },
    components: {
      Node
    },
    props: [ 'baseUrl' ],
    computed: {
      ...mapGetters([
        'datasource'
      ])
    },
    methods: {
      // Go to the next level
      onNodeClicked: function (node) {
        this.$router.push('/detail/' + node.id)
      },
      update: function () {
        // Load the data from the server
        if (this.datasource !== null) {
          var vm = this
          var url = this.baseUrl + 'datasource/' + this.datasource.id + '/nodes/?type=leaf'

          // Request the data
          this.getJSON(url, function (data) {
            // Sort them based on their name
            data.sort(function (a, b) {
              if (a.name < b.name) {
                return -1
              } else if (a.name > b.name) {
                return 1
              } else {
                return 0
              }
            })
            vm.nodes = data
          })
        }
      }
    },
    mounted: function () {
      // Redirect to datasource select screen if no datasource has been selected
      if (!this.datasource) {
        this.$router.push('/datasource')
      } else {
        this.update()
      }
    }
  }
</script>