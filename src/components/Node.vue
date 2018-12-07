<template>
  <mdc-card class="node">
    <mdc-card-primary-action>
      <!-- Image -->
      <mdc-card-media :src="getImage()"></mdc-card-media>
      <!-- Heading -->
      <mdc-card-header class="node-header" v-if="datasource.showKeyName || showKeyName" :title="node.name" v-bind:style="{ 'background-color': backgroundColor, 'color': foregroundColor}"></mdc-card-header>
      
      <!-- Actions for admins -->
      <mdc-card-actions v-bind:style="{ 'background-color': backgroundColor, 'color': foregroundColor}" v-if="token" >
        <mdc-card-action-icons>
          <mdc-card-action-icon icon="edit" @click.native="onNodeClicked"/>
          <mdc-card-action-icon icon="delete" @click.native="onDeleteClicked"/>
        </mdc-card-action-icons>
      </mdc-card-actions>
    </mdc-card-primary-action>
  </mdc-card>
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
      },
      onNodeClicked (e) {
        e.stopPropagation()
        this.$router.push('/detail/' + this.node.id)
      },
      onDeleteClicked (e) {
        e.stopPropagation()
        this.$emit('node-deleted', this.node)
      }
    },
    computed: {
      ...mapGetters([
        'datasource',
        'token'
      ])
    },
    mounted: function () {
      var vm = this
      if (this.datasource.showKeyName || this.showKeyName) {
        // If the name is show, color it based on the image colours
        this.$nextTick(function () {
          Vibrant.from(this.getImage())
            .getPalette(function (err, palette) {
              if (!err && palette && palette.Vibrant) {
                vm.backgroundColor = palette.Vibrant.getHex()
                var avg = (palette.Vibrant.r + palette.Vibrant.g + palette.Vibrant.b) / 3
                vm.foregroundColor = avg < 128 ? 'white' : 'black'
              }
            })
        })
      }
    }
  }
</script>

<style>
  .node:hover {
    cursor: pointer;
  }

  .node .node-header > h1 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>