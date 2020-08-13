import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index.vue'
import VueCookie from 'vue-cookie'
// import activity from '../views/activity.vue'
// import pay from '../views/pay.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '',
    redirect: '/index' // 设置默认打开的页面
  },
  {
    path: '/index',
    name: 'index',
    component: () => import(/* webpackChunkName: "about" */ '../views/index.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/activity',
    name: 'activity',
    component: () => import(/* webpackChunkName: "about" */ '../views/activity.vue'),
    meta: { title: '活动' }
  },
  {
    path: '/pay',
    name: 'pay',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/pay.vue'),
    meta: { title: '充值' }
  },
  {
    path: '/auth',
    name: 'auth',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/auth.vue'),
    meta: { title: '授权' }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // let openid = VueCookie.get('openId')
  let openid = localStorage.getItem('openid') //当前页url与参数放入缓存
  console.log(openid)
  // openid = true
  console.log(to)
  if (!openid) {
    if (to.path === '/auth') {
      next()
    } else {
      localStorage.setItem('now_url', to.fullPath) //当前页url与参数放入缓存
      next('/auth')
    }
  } else {
    next()
  }
  /* 
  let index = localStorage.getItem('openid')
  if (to.path == '/index') {
    if (index > 1) {
      next()
    } else {
      index++
      localStorage.setItem('index', index)
      next('/auth')
    }
  }
  next() */
})

export default router
