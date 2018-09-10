import Vue from 'vue'
import Router from 'vue-router'
import Catalogue from '@/components/Catalogue'
import DatasourceGrid from '@/components/DatasourceGrid'
import NodeGrid from '@/components/NodeGrid'
import NodeDetails from '@/components/NodeDetails'
import About from '@/components/About'

Vue.use(Router)

// const baseUrl = 'https://ics.hutton.ac.uk/buntata/v1.1/'
const baseUrl = 'http://localhost:8080/buntata/v1.1/'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'nodegrid',
      component: NodeGrid,
      props: { baseUrl: baseUrl }
    },
    {
      path: '/datasource',
      name: 'datasource',
      component: DatasourceGrid,
      props: { baseUrl: baseUrl }
    },
    {
      path: '/catalogue',
      name: 'catalogue',
      component: Catalogue,
      props: { baseUrl: baseUrl }
    },
    {
      path: '/detail/:id',
      name: 'nodedetails',
      component: NodeDetails,
      props: { baseUrl: baseUrl }
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      props: { baseUrl: baseUrl }
    }
  ]
})
