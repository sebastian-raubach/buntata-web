<template>
  <mdc-card v-if="datasource">
    <mdc-card-media :style="{ backgroundImage: 'url(\'' + getIcon(datasource.id) + '\')' }"></mdc-card-media>
    <div class="mdc-card-fab">
      <mdc-fab @click="onDatasourceSelected()" :icon="getStatus()"></mdc-fab>
    </div>
    <mdc-card-header :title="datasource.name" />
    <mdc-card-text v-if="datasource.description"><b>{{ $t('datasourceDescription') }}</b>: {{ datasource.description }}</mdc-card-text>
    <mdc-card-text v-if="datasource.dataProvider"><b>{{ $t('datasourceProvider') }}</b>: {{ datasource.dataProvider }}</mdc-card-text>
    <mdc-card-text v-if="datasource.versionNumber"><b>{{ $t('datasourceVersion') }}</b>: {{ datasource.versionNumber }}</mdc-card-text>
    <mdc-card-text v-if="datasource.contact"><b>{{ $t('datasourceContact') }}</b>: <a :href="'mailto:' + datasource.contact">{{ datasource.contact }}</a></mdc-card-text>
    <mdc-card-text v-if="datasource.updatedOn"><b>{{ $t('datasourceUpdatedOn') }}</b>: {{ datasource.updatedOn | toDate }}</mdc-card-text>

    <mdc-button raised v-if="token" @click="dialogOpen = true"><i class="material-icons mdc-button__icon">delete</i> Delete</mdc-button>

    <mdc-dialog v-model="dialogOpen" :title="$t('dialogDeleteDatasourceTitle')" :accept="$t('buttonYes')" :cancel="$t('buttonNo')" @accept="onDeleteClicked()">
      {{ $t('dialogDeleteDatasourceText', {ds: datasource.name}) }}
    </mdc-dialog>
  </mdc-card>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data: function () {
      return {
        dialogOpen: false
      }
    },
    props: [
      'baseUrl',
      'selected',
      'datasource'
    ],
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    methods: {
      // Get the status icon for each of the datasources
      getStatus: function () {
        // If both aren't null, compare their id
        if (this.selected) {
          return 'check'
        } else {
          return 'add'
        }
      },
      // Get the icon
      getIcon: function (id) {
        return this.baseUrl + 'datasource/' + id + '/icon'
      },
      // When datasource is selected, store it, then redirect
      onDatasourceSelected: function () {
        this.$store.dispatch('ON_DATASOURCE_CHANGED', this.datasource)
        this.$router.push('/')
      },
      onDeleteClicked: function () {
        var ds = this.datasource
        var vm = this
        this.authAjax(this.baseUrl + 'datasource/' + this.datasource.id, 'DELETE', null, 'json', function (success) {
          // There's no event we can listen to to wait for the dialog to close, wo we'll need to use a timeout
          setTimeout(function () {
            vm.$emit('datasource-deleted', ds)
          }, 250)
        }, function () {
          alert(vm.$t('errorDatasourceDelete'))
        })
      }
    },
    filters: {
      // Format to localized date
      toDate: function (value) {
        var date = new Date(value)
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
      }
    }
  }
</script>

<style scoped>
  .mdc-card__media {
    height: 256px;
    background: center / cover;
  }
  .mdc-card-fab {
    position: relative;
    overflow: visible;
  }
  .mdc-fab {
    position: absolute;
    right: 15px;
    top: -28px;
  }
</style>
