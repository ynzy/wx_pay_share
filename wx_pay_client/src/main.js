import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/css/base.css'
import './assets/css/common.css'
// 引入本地存储
import { storage, sessionStorage } from '@/utils/storage'
Vue.prototype.$storage = storage
Vue.prototype.$sessionStorage = sessionStorage

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
