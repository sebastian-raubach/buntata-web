<template>
  <div class="node vertical">
    <div class="mdl-card__media" :style="{ backgroundImage: 'url(\'' + getImage() + '\')' }">
    </div>
    <div v-if="datasource.showKeyName || showKeyName" class="mdl-card__title">
      <h4 class="mdl-card__title-text">{{ node.name }}</h4>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data: function () {
      return {
      }
    },
    props: [ 'baseUrl', 'node', 'showKeyName' ],
    methods: {
      // Get the icon
      getImage: function () {
        if (this.node.media['Image'].length > 0) {
          return this.baseUrl + 'media/' + this.node.media['Image'][0].id + '?small=true'
        } else {
          return ''
        }
      }
    },
    computed: {
      ...mapGetters([
        'datasource'
      ])
    }
  }
</script>

<style scoped>
  .node:hover {
    cursor: pointer;
  }
  .mdl-card__media {
    background: center / cover;
    height: 100px
  }
  .node.vertical .mdl-card__media {
    height: 256px;
  }
</style>
