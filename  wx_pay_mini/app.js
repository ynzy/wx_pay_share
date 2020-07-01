/**
 * 小程序的入口
 */
const api = require('./http/api') 
const request = require('./http/request')
let config = request('./env/index.js')
let env = 'Prod'
App.version = '1.0.0' //
App({
  globalData: {
    api: api, //全局注册api，供全局使用
    // 全局注册请求方法，
    // get: request.fetch,
    // post: () => { },

    userInfo: null
  },
  onLaunch: function () {
    
  }
  
})