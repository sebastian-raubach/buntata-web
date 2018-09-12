import Vue from 'vue'
import Router from 'vue-router'
import Catalogue from '@/components/Catalogue'
import DatasourceGrid from '@/components/DatasourceGrid'
import NodeGrid from '@/components/NodeGrid'
import NodeDetails from '@/components/NodeDetails'
import About from '@/components/About'

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
    console.log(from, to)
    window.$('.mdl-layout__content').scrollTop(0)
    return null
  }
})
