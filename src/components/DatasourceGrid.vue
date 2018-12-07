<template>
  <mdc-layout-grid>
    <!-- Heading -->
    <mdc-layout-cell desktop=12 tablet=8>
      <mdc-text typo='headline3'>{{ $t('datasourceGridTitle') }}</mdc-text>
    </mdc-layout-cell>

    <!-- Current data sources -->
    <mdc-layout-cell desktop=3 v-for="datasource in datasources" :key="datasource.id">
      <datasource :datasource="datasource" :selected="isSelectedDatasource(datasource)" :base-url="baseUrl" v-on:datasource-deleted="onDatasourceDeleted(datasource)"></datasource>
    </mdc-layout-cell>

    <!-- A card to add new data sources -->
    <mdc-layout-cell desktop=3 v-if="token">
      <AddCard @click.native="dialogOpen = true" />
    </mdc-layout-cell>

    <!-- Dialog to add a new data source -->
    <mdc-dialog v-model="dialogOpen" accent :title="$t('dialogDatasourceAddTitle')" :accept="$t('buttonAdd')" :cancel="$t('buttonCancel')" @accept="addDatasource" @validate="validateDatasource">
      <mdc-textfield v-model="newDatasource.name" fullwidth :label="$t('labelName')" required />
      <mdc-textfield v-model="newDatasource.description" fullwidth :label="$t('labelDescription')" />
      <mdc-textfield v-model="newDatasource.dataProvider" fullwidth :label="$t('labelDataProvider')" required />
      <mdc-textfield v-model="newDatasource.contact" fullwidth :label="$t('labelContact')" required />

      <h4 v-text="$t('labelIcon')"></h4>
      <img class="logo-preview" v-if="newDatasource.imageUrl.length > 0" :src="newDatasource.imageUrl" />
      <input type="file" @change="onFileChange($event.target.name, $event.target.files)" accept=".png,.jpg,.jpeg" />
    </mdc-dialog>
  </mdc-layout-grid>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Datasource from '@/components/Datasource'
  import AddCard from '@/components/AddCard'

  export default {
    data: function () {
      return {
        // All datasources
        datasources: [],
        // Currently active datasource
        selectedDatasource: null,
        dialogOpen: false,
        newDatasource: {
          id: null,
          name: '',
          description: '',
          dataProvider: '',
          contact: '',
          logo: '',
          imageUrl: ''
        }
      }
    },
    components: {
      Datasource,
      AddCard
    },
    computed: {
      ...mapGetters([
        'datasource',
        'token'
      ])
    },
    props: [ 'baseUrl' ],
    methods: {
      validateDatasource: function ({ accept }) {
        if (this.newDatasource.name.length > 0 && this.newDatasource.dataProvider.length > 0 && this.newDatasource.contact.length > 0) {
          accept()
        } else {
          alert(this.$t('errorFillAllFields'))
        }
      },
      onFileChange (fieldName, files) {
        if (files && files.length > 0) {
          this.newDatasource.logo = files[0]
          this.newDatasource.imageUrl = URL.createObjectURL(files[0])
        } else {
          this.newDatasource.logo = ''
          this.newDatasource.imageUrl = ''
        }
      },
      addDatasource: function () {
        var vm = this

        // Create the new datasource first
        this.authAjax(this.baseUrl + 'datasource', 'POST', this.newDatasource, 'json', function (data) {
          // If there is an image, upload that as well, use the newly created ID
          if (vm.newDatasource.imageUrl.length > 0) {
            const formData = new FormData()
            formData.append('image', vm.newDatasource.logo)

            // Send the request to create the image
            vm.authAjaxForm(vm.baseUrl + 'datasource/' + data + '/icon', 'PUT', formData, function (result) {
              // Once this comes back, update the display
              vm.getData()
            }, function (error) {
              console.log(error)
            })
          } else {
            // If there is no image to upload, update the display
            vm.getData()
          }
        }, function (error) {
          console.log(error)
        })
      },
      // Check if this is the active datasource
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
      },
      onDatasourceDeleted: function (datasource) {
        if (this.selectedDatasource && (this.selectedDatasource.id === datasource.id)) {
          this.$store.dispatch('ON_DATASOURCE_CHANGED', null)
        }

        this.getData()
      },
      getData: function () {
        // Load the data from the server
        var vm = this
        this.getJSON(this.baseUrl + 'datasource', function (data) {
          vm.datasources = data
        })
        this.selectedDatasource = this.datasource
      },
      // Go to the next level
      onNodeClicked: function (node) {
        this.$router.push('/' + node.id)
      },
      addDataSource: function (datasource) {
      }
    },
    mounted: function () {
      this.getData()
    }
  }
</script>

<style scoped>
  .logo-preview {
    max-width: 320px;
    height: auto;
    display: block;
    padding: 10px 0;
  }
</style>