//index.js
//获取应用实例
const app = getApp()
let store = require('./../../utils/store.js')
let Api = app.Api;
let router = app.router;
Page({
  data: {
    userId: store.getItem('userId')
  },
  onLoad: function () {

  },
  recharge() {
    router.push('pay');
  },
  activity() {
    router.push('activity');
  },
  onShareAppMessage() {
    return {
      title: '欢迎体验慕课支付',
      path: '/pages/index/index',
      imageUrl: '/assets/images/share_mp_logo.png'
    }
  }
})
