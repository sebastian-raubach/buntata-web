<template>
  <div class="mdl-grid">
    <div class="mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
    <div class="mdl-cell mdl-cell--8-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
      <div class="middle" v-if="node">
        <h2 v-text="node.name"></h2>
        <div v-if="node.media['Image'] !== null">
          <div class="owl-carousel owl-theme">
            <a class="image owl-item" :href="getImage(image, true)" :data-caption="getCopyright(image)" v-for="image in node.media['Image']" :key="image.id">
              <div :style="{ backgroundImage: 'url(\'' + getImage(image, false) + '\')' }"></div>
              <span class="copyright" v-if="image.copyright" v-html="getCopyright(image)"></span>
            </a>
          </div>
        </div>
        <div class="mdl-list">
          <div v-for="av in node.attributeValues" :key="av.id">
            <h4 v-text="av.attribute.name"></h4>
            <span v-html="av.value"></span>
          </div>
        </div>
        <div v-if="node.similarNodes.length > 0">
          <h3>Similar diseases</h3>
          <div class="mdl-grid">
            <div v-for="similar in node.similarNodes" :key="similar.id" class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--3dp node" v-on:click="onNodeClicked(similar)">
              <div class="mdl-card__media" :style="{ backgroundImage: 'url(\'' + getSimilarImage(similar) + '\')' }">
              </div>
              <div class="mdl-card__title">
                <h5 class="mdl-card__title-text">{{ similar.name }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mdl-cell mdl-cell--3-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import 'owl.carousel/dist/assets/owl.carousel.css'
  import 'owl.carousel/dist/assets/owl.theme.default.css'
  import 'owl.carousel'
  import baguetteBox from 'baguettebox.js'
  import 'baguettebox.js/dist/baguetteBox.min.css'

  export default {
    data: function () {
      return {
        node: null
      }
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
              vm.$jQuery('.owl-carousel').owlCarousel({
                items: 3,
                onInitialized: function () {
                  baguetteBox.run('.owl-carousel', {
                    'captions': 'true',
                    'filter': /.*/i
                  })
                }
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
  .image {
    position: relative;
    width: 100%;
  }
  .image > div {
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
  /* Similar nodes */
  .node:hover {
    cursor: pointer;
  }
  .mdl-card__media {
    height: 128px;
    background: center / cover;
  }
  .node .mdl-card__title-text {
    font-size: 20px;
  }
  .mdl-card {
    min-height: auto;
  }
</style>