<template>
  <div class="column">
    <mdc-layout-grid v-if="node">
      <mdc-layout-cell desktop=12 tablet=8 phone=4>
        <mdc-text typo='headline3'>{{ node.name }}</mdc-text>
        <div v-if="node.media['Image'] !== null">
          <carousel :perPageCustom="[[0, 1], [768, 2], [1024, 3]]" class="carousel">
            <slide v-for="image in node.media['Image']" :key="image.id" class="image">
              <a :href="getImage(image, true)" :data-caption="getCopyright(image)">
                <div :style="{ backgroundImage: 'url(\'' + getImage(image, false) + '\')' }"></div>
              </a>
              <span class="copyright" v-if="image.copyright" v-html="getCopyright(image)"></span>
            </slide>
          </carousel>
        </div>
        <mdc-list>
          <div v-for="av in node.attributeValues" :key="av.id">
            <mdc-text typo='headline6'>{{ av.attribute.name }}</mdc-text>
            <mdc-text typo='body1' v-html="av.value" />
          </div>
        </mdc-list> 
      </mdc-layout-cell>
      <mdc-layout-cell desktop=12 tablet=8 phone=4 v-if="node.similarNodes.length > 0">
        <mdc-text typo='headline4'>Similar items</mdc-text>
        <mdc-layout-inner-grid>
          <mdc-layout-cell v-for="similar in node.similarNodes" :key="similar.id">
            <node :node="similar" :showKeyName="true" :base-url="baseUrl" @click.native="onNodeClicked(similar)"></node>
          </mdc-layout-cell>
        </mdc-layout-inner-grid>
      </mdc-layout-cell>
    </mdc-layout-grid>
    <mdc-text typo='headline3' v-else>No data found.</mdc-text>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Carousel, Slide } from 'vue-carousel'
  import baguetteBox from 'baguettebox.js'
  import 'baguettebox.js/dist/baguetteBox.min.css'

  import Node from '@/components/Node'

  export default {
    data: function () {
      return {
        node: null
      }
    },
    components: {
      Node,
      Carousel,
      Slide
    },
    props: [ 'baseUrl' ],
    computed: {
      ...mapGetters([
        'datasource'
      ])
    },
    beforeRouteUpdate (to, from, next) {
      this.node = null
      next()
      this.update()
    },
    methods: {
      getCopyright: function (medium) {
        if (medium.copyright) {
          return '&#169; ' + medium.copyright
        } else {
          return ''
        }
      },
      getImage: function (medium, fullSize) {
        return this.baseUrl + 'media/' + medium.id + (fullSize ? '' : '?small=true')
      },
      getSimilarImage: function (similar) {
        if (similar.media['Image'].length > 0) {
          return this.baseUrl + 'media/' + similar.media['Image'][0].id + '?small=true'
        } else {
          return ''
        }
      },
      onNodeClicked: function (node) {
        this.$router.push('/detail/' + node.id)
      },
      update: function () {
        var vm = this
        // Request the data
        this.$jQuery.getJSON(this.baseUrl + 'node/' + this.$route.params.id, function (data) {
          if (data.length === 1) {
            vm.node = data[0]
            // Wait for the reactive magic to kick in, then create the carousel
            vm.$nextTick(function () {
              // Carousel
              baguetteBox.run('.carousel', {
                'captions': 'true',
                'filter': /.*/i
              })
            })
          } else {
            // TODO error
          }
        })
      }
    },
    mounted: function () {
      this.update()
    }
  }
</script>

<style scoped>
  .column {
    max-width: 1024px;
    margin: auto;
  }
  .image {
    position: relative;
    width: 100%;
  }
  .image div {
    background: center / cover;
    height: 300px;
    width: 100%;
  }
  .owl-stage {
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;

    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
  }
  .owl-item {
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    height: auto !important;
  }
  .image > .copyright {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 5px;
    background-color: rgba(0, 0, 0, .5);
    color: white;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }
</style>