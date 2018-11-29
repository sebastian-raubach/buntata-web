import Vue from 'vue'
import Router from 'vue-router'

import About from '@/components/About'
import Catalogue from '@/components/Catalogue'
import DatasourceGrid from '@/components/DatasourceGrid'
import NodeDetails from '@/components/NodeDetails'
import NodeGrid from '@/components/NodeGrid'

Vue.use(Router)

// Handle page navigation
export default new Router({
  routes: [
    {
      path: '/datasource',
      name: 'datasource',
      component: DatasourceGrid,
      props: { baseUrl: null }
    },
    {
      path: '/catalogue',
      name: 'catalogue',
      component: Catalogue,
      props: { baseUrl: null }
    },
    {
      path: '/detail/:id',
      name: 'nodedetails',
      component: NodeDetails,
      props: { baseUrl: null }
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      props: { baseUrl: null }
    },
    {
      path: '/',
      name: 'nodegrid',
      component: NodeGrid,
      props: { baseUrl: null }
    },
    {
      path: '/:parent_id',
      name: 'nodegrid-with-parent',
      component: NodeGrid,
      props: { baseUrl: null }
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    // Scroll to the top
    window.$('html').scrollTop(0)
    return null
  }
})
