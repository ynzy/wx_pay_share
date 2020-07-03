

let store = require('../utils/store')
let system = store.getSystemInfo()
// 客户端信息
const clientInfo = {
  'clientType': 'mp', // 客户端类型
  'appnm': 'imoocpay', //项目名
  'model': system.model, // 设备型号
  'os': system.system, // 操作系统及版本
  'screen': system.screenWidth + '*' + system.screenHeight, // 屏幕尺寸
  'version': App.version, // 小程序版本
  'channel': 'miniprogram' // 渠道
}
const errMsg = '服务异常，请稍后重试'
module.exports = {
  fetch: (url, data = {}, option = {}) => {
    let { loading = true, toast = true, isMock = false, method = 'get' } = option
    return new Promise((resolve, reject) => {
      loading && wx.showLoading({
        title: '加载中...',
        mask: true,
      });
      let env = isMock ? App.config.mockApi : App.config.baseApi;
      wx.request({
        url: env + url,
        data,
        header: {
          'content-type': 'application/json',
          'clientInfo': JSON.stringify(clientInfo)
        },
        method,
        dataType: 'json',
        responseType: 'text',
        success: (result) => {
          let res = result.data // {code:0,data:'',message:''}

          if (res.code == 0) {
            loading && wx.hideLoading();
            resolve(res.data)
          } else {
            // console.log(res);
            // 如果有toast提示会直接结束loading
            toast ? wx.showToast({
              title: res.message.message[0] || res.message,
              icon: 'none',
              mask: true
            }) : wx.hideLoading();
            loading && wx.hideLoading();
            reject(res)
          }
        },
        fail: (e = { code: -1, msg: errMsg, errMsg }) => {
          let msg = e.errMsg
          if (msg == 'request:fail timeout') {
            msg = '服务请求超时，请稍后处理';
          }
          wx.showToast({
            title: msg,
            icon: 'none'
          })
          reject(e)
        },
        complete: () => {

        }
      });
    })
  }
}