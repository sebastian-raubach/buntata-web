<template>
  <mdc-layout-grid>
    <mdc-layout-cell desktop=12 tablet=8>
      <mdc-text typo='headline3'>Please select a data source:</mdc-text>
    </mdc-layout-cell>
    <mdc-layout-cell desktop=3 v-for="datasource in datasources" :key="datasource.id">
      <datasource :datasource="datasource" :selected="isSelectedDatasource(datasource)" :base-url="baseUrl"></datasource>
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Datasource from '@/components/Datasource'

  export default {
    data: function () {
      return {
        datasources: [],
        selectedDatasource: null
      }
    },
    components: {
      Datasource
    },
    computed: {
      ...mapGetters([
        'datasource'
      ])
    },
    props: [ 'baseUrl' ],
    methods: {
      isSelectedDatasource: function (datasource) {
        return datasource !== null && this.selectedDatasource !== null && datasource.id === this.selectedDatasource.id
      },
      // Get the status icon for each of the datasources
      getStatus: function (datasource) {
        // If both aren't null, compare their id
        if (datasource !== null && this.selectedDatasource !== null && datasource.id === this.selectedDatasource.id) {
          return 'check'
        } else {
          return 'add'
        }
      }
    },
    mounted: function () {
      // Load the data from the server
      var vm = this
      this.$jQuery.getJSON(this.baseUrl + 'datasource', function (data) {
        vm.datasources = data
      })
      this.selectedDatasource = this.datasource
    }
  }
</script>