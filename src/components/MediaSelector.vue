<template>
  <mdc-layout-grid class="media-selector-overflow">
    <mdc-layout-cell desktop=3 v-for="medium in media" :key="medium.id">
      <mdc-card class="media"  @click.native="onMediaSelected(medium)">
        <mdc-card-primary-action>
          <!-- Image -->
          <mdc-card-media :src="getImage(medium)"></mdc-card-media>
          <!-- Heading -->
          <mdc-card-header class="media-header" :title="medium.name"></mdc-card-header>
        </mdc-card-primary-action>
      </mdc-card>
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data: function () {
      return {
        media: []
      }
    },
    props: [ 'baseUrl' ],
    computed: {
      ...mapGetters([
        'datasource'
      ])
    },
    methods: {
      getImage: function (medium) {
        return this.baseUrl + 'media/' + medium.id + '?small=true'
      },
      onMediaSelected: function (medium) {
        this.$emit('media-selected', medium)
      }
    },
    mounted: function () {
      var vm = this
      // Request the data
      this.getJSON(this.baseUrl + 'media/?datasourceId=' + this.datasource.id, function (data) {
        vm.media = data
      })
    }
  }
</script>

<style>
  .media-selector-overflow {
    max-height: 40vh;
    overflow-y: auto;
  }

  .media:hover {
    cursor: pointer;
  }

  .media-header {
    padding: 8px !important;
  }

  .media .media-header > h1 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12pt;
    padding-top: 0;
  }
</style>
