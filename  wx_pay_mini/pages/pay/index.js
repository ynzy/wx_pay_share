const app = getApp();
const Api = app.Api;
const Store = require('./../../utils/store.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1
  },
  getMoney(e) {
    let amount = e.detail.value;
    this.setData({
      index: amount * 100
    })
  },
  choose(e) {
    let data = e.currentTarget.dataset;
    this.setData({
      index: data.amount,
    });
  },
  pay() {
    app.get(Api.payWallet, {
      openId: Store.getItem('openId'),
      money: this.data.index
    }).then((res) => {
      console.log(res);
      // 支付
      wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType,
        paySign: res.paySign,
        success: function (errmsg) {
          if (errmsg == 'requestPayment:ok') {
            wx.showToast({
              title: '支付成功',
              icon: 'success'
            });
          }
        },
        fail: function (res) {
          if (res.errMsg == 'requestPayment:fail cancel') {
            wx.showToast({
              title: '支付取消',
              icon: 'none'
            });
          } else {
            wx.showToast({
              title: res.errmsg,
              icon: 'none'
            });
          }
        }
      })
    });
  }
})