import 'core-js'
import ES6Promise from 'es6-promise'
import '@/utils/polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant, { Lazyload } from 'vant'
import { Image } from '@/components/nvan'
import 'vant/lib/index.css'
import '@/css/reset.scss'
import Vuex from 'vuex'
import store from './store/index.js'
import HeadNav from '@/components/common/HeadNav'
ES6Promise.polyfill()
// 引入路由配置文件
Vue.config.productionTip = false

Vue.use(Vant)
Vue.use(Lazyload)
Vue.use(Image)
Vue.use(Vuex)
Vue.component(HeadNav.name, HeadNav)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
router.beforeEach((to, from, next) => {
  if (to.path) {
    if (window._hmt) {
      window._hmt.push(['_trackPageview', '/#' + to.fullPath])
    }
  }
  next()
})
