<template>
  <div v-if="datasource">
    <div class="mdl-card__media" :style="{ backgroundImage: 'url(\'' + getIcon(datasource.id) + '\')' }"></div>
    <div class="mdl-card__title">
      <h4 class="mdl-card__title-text">{{ datasource.name }}</h4>
      <button class="mdl-button mdl-button--fab mdl-button--colored mdl-shadow--6dp" @click="onDatasourceSelected()"><i class="material-icons">{{ getStatus() }}</i></button>
    </div>
    <div class="mdl-card__supporting-text">
      <p v-if="datasource.description"><b>Description</b>: {{ datasource.description }}</p>
      <p v-if="datasource.dataProvider"><b>Provider</b>: {{ datasource.dataProvider }}</p>
      <p v-if="datasource.versionNumber"><b>Version</b>: {{ datasource.versionNumber }}</p>
      <p v-if="datasource.contact"><b>Contact</b>: <a :href="'mailto:' + datasource.contact">{{ datasource.contact }}</a></p>
      <p v-if="datasource.updatedOn"><b>Updated on</b>: {{ datasource.updatedOn | toDate }}</p>
    </div>
  </div>
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
  .mdl-card__media {
    height: 256px;
    background: center / cover;
  }
  .mdl-card__title {
    position: relative;
    overflow: visible;
  }
  .mdl-button--fab {
    position: absolute;
    right: 15px;
    top: -28px;
  }
</style>
