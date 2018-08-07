<template>
  <div>
    <h2 class="header">Please select a data source:</h2>
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--3dp" v-for="datasource in datasources" :key="datasource.id">
        <datasource :datasource="datasource" :selected="isSelectedDatasource(datasource)" :base-url="baseUrl"></datasource>
      </div>
    </div>
  </div>
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

<style scoped>
  .header {
    margin-left: 15px;
    margin-right: 15px;
  }
</style>
