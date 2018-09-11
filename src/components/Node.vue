<template>
  <div class="node vertical">
    <div class="mdl-card__media" :style="{ backgroundImage: 'url(\'' + getImage() + '\')' }">
    </div>
    <div v-if="datasource.showKeyName || showKeyName" class="mdl-card__title" v-bind:style="{ 'background-color': backgroundColor, 'color': foregroundColor}">
      <h4 class="mdl-card__title-text">{{ node.name }}</h4>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as Vibrant from 'node-vibrant'

  export default {
    data: function () {
      return {
        backgroundColor: 'none',
        foregroundColor: 'black'
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
    },
    mounted: function () {
      var vm = this
      Vibrant.from(this.getImage())
        .getPalette(function (err, palette) {
          if (err) {
            console.log(err.stack)
          }

          vm.backgroundColor = palette.Vibrant.getHex()
          var avg = (palette.Vibrant.r + palette.Vibrant.g + palette.Vibrant.b) / 3
          vm.foregroundColor = avg < 128 ? 'white' : 'black'
        })
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
  .mdl-card__title-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
