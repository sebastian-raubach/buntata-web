import Vue from 'vue'
import Router from 'vue-router'

import About from '@/components/About'
import Catalogue from '@/components/Catalogue'
import DatasourceGrid from '@/components/DatasourceGrid'
import NodeDetails from '@/components/NodeDetails'
import NodeGrid from '@/components/NodeGrid'

Vue.use(Router)

var baseUrl

if (process.env.NODE_ENV === 'development') {
  baseUrl = 'http://localhost:8080/buntata/v1.1/'
} else {
  baseUrl = 'https://ics.hutton.ac.uk/buntata/v1.1/'
}

export default new Router({
  routes: [
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
    },
    {
      path: '/',
      name: 'nodegrid',
      component: NodeGrid,
      props: { baseUrl: baseUrl }
    },
    {
      path: '/:parent_id',
      name: 'nodegrid-with-parent',
      component: NodeGrid,
      props: { baseUrl: baseUrl }
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    window.$('html').scrollTop(0)
    return null
  }
})
