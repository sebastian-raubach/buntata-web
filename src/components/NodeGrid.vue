<template>
  <mdc-layout-grid>
    <!-- Headings -->
    <mdc-layout-cell desktop=12 tablet=8>
      <mdc-text typo='headline3' v-if="datasource">{{ datasource.name }}</mdc-text>
      <mdc-text typo='headline3' v-else>>{{ $t('warningNoDatasourceSelected') }}</mdc-text>
      <mdc-text typo='headline6'>{{ $t('nodeGridTitle') }}</mdc-text>
    </mdc-layout-cell>

    <!-- The actual grid cells (nodes) -->
    <mdc-layout-cell desktop=3 v-for="node in nodes" :key="node.id">
      <Node :node="node" :showKeyName="false" :base-url="baseUrl" @click.native="onNodeClicked(node)"></Node>
    </mdc-layout-cell>

    <!-- Add a button to open the new node dialog -->
    <mdc-layout-cell desktop=3 v-if="token">
      <AddCard @click.native="dialogOpen = true" />
    </mdc-layout-cell>

    <!-- Add a dialog to allow adding new nodes -->
    <mdc-dialog v-model="dialogOpen" accent :title="$t('dialogNodeAddTitle')" :accept="$t('buttonAdd')" :cancel="$t('buttonCancel')" @accept="addNode" @validate="validateNode">
      <mdc-textfield v-model="newNode.name" fullwidth :label="$t('labelName')" required />
      <mdc-textfield v-model="newNode.description" fullwidth :label="$t('labelDescription')" />

      <h4 :v-text="$t('labelImage')"></h4>
      <img class="image-preview" v-if="newNode.imageUrl.length > 0" :src="newNode.imageUrl" />
      <input type="file" @change="onFileChange($event.target.name, $event.target.files)" accept=".png,.jpg,.jpeg" />
    </mdc-dialog>

    <!-- The FAB to go up one level -->
    <mdc-fab v-if="parentId" icon="home" fixed @click="$router.push('/')"></mdc-fab>
  </mdc-layout-grid>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Node from '@/components/Node'
  import AddCard from '@/components/AddCard'

  export default {
    data: function () {
      return {
        // Currently visible nodes. Potentially filtered to match search.
        nodes: null,
        // All nodes, i.e. unfiltered
        nodesUnfiltered: [],
        // Id of the parent node
        parentId: null,
        dialogOpen: false,
        newNode: {
          id: null,
          datasourceId: '',
          name: '',
          description: '',
          image: '',
          imageUrl: ''
        }
      }
    },
    components: {
      Node,
      AddCard
    },
    props: [ 'baseUrl' ],
    computed: {
      ...mapGetters([
        'datasource',
        'searchTerm',
        'token'
      ])
    },
    watch: {
      // Listen to search events
      searchTerm: function (newSearchTerm, oldSearchTerm) {
        this.search(newSearchTerm)
      }
    },
    methods: {
      // Search for a specific term. TODO: search children as well
      search: function (searchTerm) {
        if (searchTerm === '') {
          this.nodes = this.nodesUnfiltered
        } else {
          this.nodes = this.nodesUnfiltered.filter(function (node) {
            return node.description.includes(searchTerm)
          })
        }
      },
      onFileChange (fieldName, files) {
        if (files && files.length > 0) {
          this.newNode.image = files[0]
          this.newNode.imageUrl = URL.createObjectURL(files[0])
        } else {
          this.newNode.image = ''
          this.newNode.imageUrl = ''
        }
      },
      // Go to the next level
      onNodeClicked: function (node) {
        this.$router.push('/' + node.id)
      },
      addNode: function () {
        var vm = this

        this.newNode.datasourceId = this.datasource.id
        // Create the new datasource first
        this.authAjax(this.baseUrl + 'node', 'POST', this.newNode, 'json', function (data) {
          // If there is an image, upload that as well, use the newly created ID
          if (vm.newNode.imageUrl.length > 0) {
            const formData = new FormData()
            formData.append('image', vm.newNode.image)

            // Send the request to create the image
            vm.authAjaxForm(vm.baseUrl + 'node/' + data + '/media', 'PUT', formData, function (result) {
              // Once this comes back, update the display
              vm.createRelationship(data)
            }, function (error) {
              console.log(error)
            })
          } else {
            // If there is no image to upload, update the display
            vm.createRelationship(data)
          }
        }, function (error) {
          console.log(error)
        })
      },
      createRelationship: function (childId) {
        if (this.parentId) {
          var vm = this
          var rel = {
            parent: this.parentId,
            child: childId
          }
          this.authAjax(this.baseUrl + 'relationship/', 'POST', rel, 'json', function (result) {
            vm.update()
          }, function (error) {
            console.log(error)
          })
        } else {
          this.update()
        }
      },
      validateNode: function ({ accept }) {
        if (this.newNode.name.length > 0 && this.newNode.description.length > 0 && this.newNode.imageUrl.length > 0) {
          accept()
        } else {
          alert(this.$t('errorFillAllFields'))
        }
      },
      update: function () {
        // Load the data from the server
        if (this.datasource !== null) {
          var vm = this
          var url

          // Get parent id from the URL
          this.parentId = this.$route.params.parent_id

          // If there is no parent, show the root nodes, else get children of the parent
          if (!this.parentId) {
            url = this.baseUrl + 'datasource/' + this.datasource.id + '/nodes/?type=root'
          } else {
            url = this.baseUrl + 'node/?nodeParentId=' + this.parentId
          }

          // Request the data
          this.getJSON(url, function (data) {
            if (data.length === 1 && !vm.datasource.showSingleChild && !vm.token) {
              // If there's only one child and we're not supposed to show it, redirect straight away
              vm.$router.replace('/detail/' + data[0].id)
            } else if (data.length === 0 && !vm.token) {
              // Else if there are no children, redirect to this node's details page
              vm.$router.replace('/detail/' + vm.parentId)
            } else {
              // Sort them based on their name
              if (vm.parentId) {
                data.sort(function (a, b) {
                  if (a.name < b.name) {
                    return -1
                  } else if (a.name > b.name) {
                    return 1
                  } else {
                    return 0
                  }
                })
              }
              vm.nodes = data
              vm.nodesUnfiltered = data
            }
          })
        }
      }
    },
    mounted: function () {
      // Redirect to datasource select screen if no datasource has been selected
      if (!this.datasource) {
        this.$router.push('/datasource')
      } else {
        var vm = this
        this.getJSON(this.baseUrl + 'datasource/' + this.datasource.id, function (data) {
          if (vm.datasource.id !== data[0].id) {
            vm.$store.dispatch('ON_DATASOURCE_CHANGED', data[0])
          }
          vm.update()
        })
      }
    }
  }
</script>

<style scoped>
  .image-preview {
    max-width: 320px;
    height: auto;
    display: block;
    padding: 10px 0;
  }
</style>