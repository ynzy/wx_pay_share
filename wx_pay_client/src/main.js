import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookie from 'vue-cookie'
import './assets/css/base.css'
import './assets/css/common.css'
// 引入本地存储
import { storage, sessionStorage } from '@/utils/storage'
import WechatPlugin from '@/utils/WechatPlugin'

Vue.prototype.$storage = storage
Vue.prototype.$sessionStorage = sessionStorage

Vue.use(VueCookie)
// 全局注册微信jsdk
Vue.use(WechatPlugin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
