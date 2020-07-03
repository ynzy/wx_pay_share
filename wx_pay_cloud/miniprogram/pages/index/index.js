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
    this.getOpenId()
  },
  getOpenId() {
    // 小程序调用云函数
    wx.cloud.callFunction({
      name: 'getOpenId',
      data: {
        name:'jack'
      },
      success: res=>{
        console.log('云函数getOpenId调用成功');
        console.log(res);
      },
      fail: err =>{
        console.log('云函数调用失败');
        console.log(err);
      }
    })
  },
  getUserInfo(e){
    // 1. 获取用户信息
    let user = e.detail.userInfo
    // 2. 调取小程序云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {
        user
      }
    }).then(res=>{
      console.log(res);
      
      let userId = res.result.userId
      store.setItem('userId',userId)
      this.setData({
        userId
      })
    }).catch(err=>{
      console.log(err);
      
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
