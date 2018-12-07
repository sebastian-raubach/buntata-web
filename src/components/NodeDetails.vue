<template>
  <div class="details-column">
    <mdc-layout-grid v-if="node">
      <mdc-layout-cell desktop=12 tablet=8 phone=4>
        <!-- Heading -->
        <mdc-text typo='headline3' contenteditable="token" style="display: inline-block" v-text="node.name" @blur="updateNodeBind"></mdc-text>

        <!-- Edit heading buttons -->
        <mdc-chip-set v-if="token" style="display: inline-block">
          <mdc-chip leadingIcon="check" @click="updateNode()">{{ $t("buttonSave") }}</mdc-chip>
        </mdc-chip-set>

        <!-- Image section -->
        <div v-if="node.media['Image'] !== null">
          <carousel :perPageCustom="[[0, 1], [768, 2], [1024, 3]]" class="carousel">
            <slide v-for="image in node.media['Image']" :key="image.id" class="details-image mdc-ripple-surface">
              <a :href="getImage(image, true)" :data-caption="getCopyright(image)">
                <div class="details-image-inner" :style="{ backgroundImage: 'url(\'' + getImage(image, false) + '\')' }"></div>
              </a>
              <mdc-chip-set v-if="token" class="buttons">
                <mdc-chip leadingIcon="delete" class="no-text" @click="deleteImage(image)"></mdc-chip>
              </mdc-chip-set>
              <span class="copyright" v-if="image.copyright" v-html="getCopyright(image)"></span>
            </slide>
          </carousel>
        </div>

        <!-- Add image -->
        <mdc-button v-if="token" class="add-button" raised @click="imageDialogOpen = true">{{ $t("buttonAddImage") }}</mdc-button>

        <!-- Attribute list -->
        <mdc-list>
          <div v-for="av in node.attributeValues" :key="av.id">
            <mdc-text typo='headline6'>{{ av.attribute.name }}</mdc-text>
            <mdc-text typo='body1' :contenteditable="token" v-html="av.value" @blur="updateAttributeBind($event, av)"/>
            <!-- Edit attribute buttons -->
            <mdc-chip-set v-if="token">
              <mdc-chip leadingIcon="check" @click="updateAttribute(av)">{{ $t("buttonSave") }}</mdc-chip>
              <mdc-chip leadingIcon="delete" @click="deleteAttribute(av)">{{ $t("buttonDelete") }}</mdc-chip>
            </mdc-chip-set>
          </div>
          <!-- Add attribute button -->
          <mdc-button class="add-button" v-if="token" raised @click="attributeDialogOpen = true">{{ $t("buttonAddAttribute") }}</mdc-button>
        </mdc-list> 
      </mdc-layout-cell>
      <!-- Similar nodes -->
      <mdc-layout-cell desktop=12 tablet=8 phone=4 v-if="node.similarNodes.length > 0 || token">
        <mdc-text typo='headline4'>{{ $t('nodeDetailsSimilarNodesTitle') }}</mdc-text>
        <mdc-layout-inner-grid>
          <mdc-layout-cell v-for="similar in node.similarNodes" :key="similar.id">
            <node :node="similar" :showKeyName="true" :base-url="baseUrl" @click.native="onNodeClicked(similar)" v-on:node-deleted="onSimilarityDeleted(similar)"></node>
          </mdc-layout-cell>
          <!-- Add similar node -->
          <mdc-layout-cell>
            <AddCard v-if="token" @click.native="similarDialogOpen = true"/>
          </mdc-layout-cell>
        </mdc-layout-inner-grid>
      </mdc-layout-cell>

      <!-- Add image dialog -->
      <mdc-dialog v-model="imageDialogOpen" accent :title="$t('dialogImageAddTitle')" :accept="$t('buttonAdd')" :cancel="$t('buttonCancel')" @accept="addImage" @validate="validateImage">
        <h4 v-text="$t('labelImage')"></h4>
        <p v-text="$t('labelUploadNewImage')"></p>
        <img class="image-preview" v-if="newImage.imageUrl.length > 0" :src="newImage.imageUrl" />
        <input type="file" @change="onFileChange($event.target.name, $event.target.files)" accept=".png,.jpg,.jpeg" />
        <p v-text="$t('labelSelectExistingImage')"></p>
        <MediaSelector :baseUrl="baseUrl" v-on:media-selected="(medium) => onMediumSelected(medium)"/>
      </mdc-dialog>
      <!-- Add attribute dialog -->
      <mdc-dialog v-model="attributeDialogOpen" accent :title="$t('dialogAttributeAddTitle')" :accept="$t('buttonAdd')" :cancel="$t('buttonCancel')" @accept="addAttribute" @validate="validateAttribute">
        <mdc-textfield v-model="newAttributeValue.attribute.name" fullwidth :label="$t('labelName')" required />
        <mdc-textfield v-model="newAttributeValue.value" fullwidth :label="$t('labelValue')" required />
      </mdc-dialog>
      <!-- Add similar node dialog -->
      <mdc-dialog v-model="similarDialogOpen" accent title="Add similar node" @accept="addSimilarNodes">
        <vSelect :options="similarNodes" label="name" :filterable="false" multiple v-model="newSimilarNodes" @search="onSearchSimilar">
          <template slot="no-options">
            {{ $t("hintSearchSimilarNodes") }}
          </template>
          <template slot="option" slot-scope="option">
            {{ option.name }}
          </template>
          <template slot="selected-option" slot-scope="option">
            {{ option.name }}
          </template>
        </vSelect>
      </mdc-dialog>
    </mdc-layout-grid>

    <!-- No data found heading -->
    <mdc-text typo='headline3' v-else>{{ $t('genericNoDataFound') }}</mdc-text>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Carousel, Slide } from 'vue-carousel'
  import baguetteBox from 'baguettebox.js'
  import 'baguettebox.js/dist/baguetteBox.min.css'
  import debounce from 'lodash.debounce'

  import AddCard from '@/components/AddCard'
  import MediaSelector from '@/components/MediaSelector'
  import Node from '@/components/Node'
  import vSelect from 'vue-select'

  export default {
    data: function () {
      return {
        node: null,
        attributeDialogOpen: false,
        similarDialogOpen: false,
        imageDialogOpen: false,
        similarNodes: [],
        newSimilarNodes: [],
        newAttributeValue: {
          nodeId: null,
          attributeId: null,
          value: '',
          attribute: {
            name: ''
          }
        },
        newImage: {
          id: null,
          nodeId: null,
          image: '',
          imageUrl: ''
        }
      }
    },
    components: {
      Node,
      MediaSelector,
      AddCard,
      Carousel,
      Slide,
      vSelect
    },
    props: [ 'baseUrl' ],
    computed: {
      ...mapGetters([
        'datasource',
        'token'
      ])
    },
    beforeRouteUpdate (to, from, next) {
      this.node = null
      next()
      this.update()
    },
    methods: {
      // Get the copyright information
      getCopyright: function (medium) {
        if (medium.copyright) {
          return '&#169; ' + medium.copyright
        } else {
          return ''
        }
      },
      // When the file input changes, store details
      onFileChange (fieldName, files) {
        if (files && files.length > 0) {
          this.newImage.image = files[0]
          this.newImage.imageUrl = URL.createObjectURL(files[0])
        } else {
          this.newImage.image = ''
          this.newImage.imageUrl = ''
        }
      },
      onMediumSelected (medium) {
        var vm = this

        var nodeMedia = {
          nodeId: this.node.id,
          mediaId: medium.id
        }

        // Send the request to create the image
        vm.authAjax(vm.baseUrl + 'node/' + this.node.id + '/media', 'PUT', nodeMedia, 'json', function (result) {
          // Once this comes back, update the display
          vm.imageDialogOpen = false
          vm.update()
        })
      },
      // Initiate similar node search
      onSearchSimilar (search, loading) {
        loading(true)
        this.search(loading, search, this)
      },
      // Execute the actual search. Use debounce to stagger input
      search: debounce((loading, search, vm) => {
        vm.getJSON(vm.baseUrl + 'node/?datasourceId=' + vm.datasource.id + '&searchTerm=' + escape(search), function (result) {
          // Set the result, but remove this node itself if it's part of the result
          vm.similarNodes = result.filter(function (r) {
            return r.id !== vm.node.id
          })
          loading(false)
        }, function (error) {
          loading(false)
          console.log(error)
        })
      }, 350),
      // Delete a similar node
      onSimilarityDeleted: function (sim) {
        var vm = this
        var toDelete = {
          id: null,
          nodeAId: this.node.id,
          nodeBId: sim.id
        }
        this.authAjax(this.baseUrl + 'similarity', 'DELETE', toDelete, 'json', function (success) {
          vm.update()
        }, function (error) {
          console.log(error)
        })
      },
      // Add a new image
      addImage: function () {
        var vm = this

        if (vm.newImage.imageUrl.length > 0) {
          const formData = new FormData()
          formData.append('image', vm.newImage.image)

          // Send the request to create the image
          vm.authAjaxForm(vm.baseUrl + 'node/' + this.node.id + '/media', 'PUT', formData, function (result) {
            // Once this comes back, update the display
            vm.update()
          })
        }
      },
      // Check if image field is set
      validateImage: function ({ accept }) {
        if (this.newImage.imageUrl.length > 0) {
          accept()
        } else {
          alert(this.$t('errorFillAllFields'))
        }
      },
      // Add a new similar node
      addSimilarNodes: function () {
        if (this.newSimilarNodes.length > 0) {
          var vm = this
          var payload = this.newSimilarNodes.map(function (s) {
            return {
              id: null,
              nodeAId: vm.node.id,
              nodeBId: s.id
            }
          })
          this.authAjax(this.baseUrl + 'similarity/', 'POST', payload, 'json', function (result) {
            vm.update()
          }, function (error) {
            console.log(error)
          })

          this.similarNodes = []
          this.newSimilarNodes = []
        }
      },
      // Check if all attribute fields are set
      validateAttribute: function ({ accept }) {
        if (this.newAttributeValue.attribute.name.length > 0 && this.newAttributeValue.value.length > 0) {
          accept()
        } else {
          alert(this.$t('errorFillAllFields'))
        }
      },
      // Update the name of the node
      updateNode: function () {
        var vm = this
        this.authAjax(this.baseUrl + 'node/' + this.node.id, 'PUT', this.node, 'json', function (result) {
          vm.update()
        })
      },
      // Bind contenteditable change to field
      updateNodeBind (event) {
        this.node.name = event.target.innerText
      },
      // Bind contenteditable change to field
      updateAttributeBind (event, av) {
        av.value = event.target.innerHTML
      },
      // Update the attribute
      updateAttribute: function (av) {
        var vm = this
        this.authAjax(this.baseUrl + 'attributevalue/' + av.id, 'PUT', av, 'json', function (result) {
          vm.update()
        })
      },
      // Delete an image
      deleteImage: function (image) {
        var vm = this

        var nodeMedia = {
          nodeId: this.node.id,
          mediaId: image.id
        }

        this.authAjax(this.baseUrl + 'node/' + this.node.id + '/media', 'DELETE', nodeMedia, 'json', function (result) {
          vm.update()
        })
      },
      // Delete an attribute
      deleteAttribute: function (av) {
        var vm = this
        this.authAjax(this.baseUrl + 'attributevalue/' + av.id, 'DELETE', null, 'json', function (result) {
          vm.update()
        })
      },
      // Add a new attribute
      addAttribute: function () {
        var vm = this
        this.newAttributeValue.nodeId = this.node.id
        this.authAjax(this.baseUrl + 'attributevalue', 'POST', this.newAttributeValue, 'json', function (result) {
          vm.update()
        })
        this.newAttributeValue = {
          nodeId: null,
          attributeId: null,
          value: '',
          attribute: {
            name: ''
          }
        }
      },
      // Get the image
      getImage: function (medium, fullSize) {
        return this.baseUrl + 'media/' + medium.id + (fullSize ? '' : '?small=true')
      },
      // Get image of the similar nodes
      getSimilarImage: function (similar) {
        if (similar.media['Image'].length > 0) {
          return this.baseUrl + 'media/' + similar.media['Image'][0].id + '?small=true'
        } else {
          return ''
        }
      },
      // Redirect on node click
      onNodeClicked: function (node) {
        this.$router.push('/detail/' + node.id)
      },
      // Update store if the datasource is different from the active one
      onDatasourceSelected: function () {
        var vm = this
        if (this.datasource.id !== this.node.datasourceId) {
          this.getJSON(this.baseUrl + 'datasource/' + this.node.datasourceId, function (data) {
            vm.$store.dispatch('ON_DATASOURCE_CHANGED', data[0])
          })
        }
      },
      // Updates the whole page
      update: function () {
        var vm = this
        // Request the data
        this.getJSON(this.baseUrl + 'node/' + this.$route.params.id, function (data) {
          if (data.length === 1) {
            vm.node = data[0]
            vm.onDatasourceSelected()
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

<style>
  .details-column {
    max-width: 1024px;
    margin: auto;
  }
  .details-image {
    position: relative;
    width: 100%;
  }
  .details-image a {
    text-decoration: none;
  }
  .details-image .details-image-inner {
    background: center / cover;
    height: 300px;
    width: 100%;
  }
  .details-image > .buttons {
    position: absolute;
    top: 0;
    right: 0;
  }
  .details-image > .copyright {
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
  .add-button {
    margin-top: 20px;
  }
  .no-text i {
    margin: 0;
  }
  .image-preview {
    max-width: 320px;
    height: auto;
    display: block;
    padding: 10px 0;
  }
</style>