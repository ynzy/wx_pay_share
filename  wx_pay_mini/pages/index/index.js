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
    // 判断用户是否登录
    if (!this.data.userId) {
      // this.getSession();
    }
  },
  // 获取登录的code
  getSession() {
    wx.login({
      success: (res) => {
        if (res.code) {
          app.get(Api.getSession, {
            code: res.code
          }).then((res) => {
            store.setItem('openId', res.openid);
          }).catch((res) => {
            console.log('error:' + res.message)
          })
        }
      }
    })
  },
  getUserInfo(e) {
    let userInfo = e.detail.userInfo;
    userInfo.openid = store.getItem('openId');
    app.get(Api.login, {
      userInfo
    }).then((res) => {
      store.setItem('userId', res.userId);
      this.setData({
        userId: res.userId
      })
    })
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
