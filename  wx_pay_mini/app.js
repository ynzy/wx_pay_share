/**
 * 小程序的入口
 */
const Api = require('./http/api')
const request = require('./http/request.js')
let config = require('./env/index.js')
const router = require('./utils/router.js')
let env = 'Prod'
App.version = '1.0.0' // 开发版本 后期做埋点统计，后台打印日志看目前处于哪个版本
App.config = config[env]  // 根据环境变量获取对应的配置信息
App.config.env = env
App.config.mockApi = config.mockApi
App({
  config: config[env],
  Api, //全局注册api，供全局使用
  router,
  // 全局注册请求方法，
  get: request.fetch,
  post: (url, data, option) => {
    option.method = 'post'
    return request.fetch(url, data, option)
  },
  globalData: {

    userInfo: null
  },
  onLaunch: function () {

  }

})