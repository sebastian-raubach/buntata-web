<template>
  <mdc-card v-if="datasource">
    <mdc-card-media :style="{ backgroundImage: 'url(\'' + getIcon(datasource.id) + '\')' }"></mdc-card-media>
    <div class="mdc-card-fab">
      <mdc-fab @click="onDatasourceSelected()" :icon="getStatus()"></mdc-fab>
    </div>
    <mdc-card-header :title="datasource.name" />
    <mdc-card-text v-if="datasource.description"><b>Description</b>: {{ datasource.description }}</mdc-card-text>
    <mdc-card-text v-if="datasource.dataProvider"><b>Provider</b>: {{ datasource.dataProvider }}</mdc-card-text>
    <mdc-card-text v-if="datasource.versionNumber"><b>Version</b>: {{ datasource.versionNumber }}</mdc-card-text>
    <mdc-card-text v-if="datasource.contact"><b>Contact</b>: <a :href="'mailto:' + datasource.contact">{{ datasource.description }}</a></mdc-card-text>
    <mdc-card-text v-if="datasource.updatedOn"><b>Updated on</b>: {{ datasource.updatedOn | toDate }}</mdc-card-text>
  </mdc-card>
</template>

<script>
  export default {
    data: function () {
      return {
      }
    },
    props: [ 'baseUrl', 'selected', 'datasource' ],
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
