import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const routeModule = require.context('./', true, /\.js$/)
const allRoute = routeModule
  .keys()
  .filter(route => route !== './index.js')
  .map(route => {
    let tmp = routeModule(route).default
    return tmp
  })
  .flat(Infinity)
const routes = [
  {
    path: '/',
    component: resolve => require(['@/views/home/home'], resolve),
    meta: {
      pageTitle: '主页',
      keepAlive: true // 此组件需要被缓存
    }
  },
  {
    path: '/redpage',
    component: resolve => require(['@/views/home/redpage'], resolve)
  },
  {
    path: '/banner',
    component: resolve => require(['@/views/home/banner'], resolve)
  },
  {
    path: '/hot',
    component: resolve => require(['@/views/home/hot'], resolve)
  },
  {
    path: '/payment',
    component: resolve => require(['@/views/payment/payment'], resolve)
  },
  {
    path: '/alipay_tips',
    component: resolve => require(['@/views/payment/alipayTips'], resolve)
  },
  {
    path: '/applyText',
    component: resolve => require(['@/views/payment/applyText'], resolve)
  },
  {
    path: '*',
    name: '404',
    component: resolve => require(['@/views/error/404'], resolve)
  },
  ...allRoute
]
const router = new Router({
  mode: 'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  let opts
  if (to.meta.requireAuth && !localStorage.getItem('token')) {
    opts = {
      path: '/login',
      query: { redirect: to.fullPath }

    }
  }
  next(opts)
})
router.onError(error=>{
  console.log("11111",error)
})
export default router
