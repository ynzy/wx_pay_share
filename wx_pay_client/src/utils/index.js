/**
 * @author zhangyong
 * @description 公共函数定义
 */
export default {
  /**
   * 获取浏览器地址栏参数值
   * @param {*} name 参数名
   * @returns
   */
  getUrlParam(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) return decodeURIComponent(r[2])
  },
  initShareInfo(wx) {
    let shareInfo = {
      title: '慕课支付分享专项课程', // 分享标题
      desc: '欢迎学习慕课支付分享专项课程', // 分享描述
      link: 'http://m.51purse.com/#/index', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: '' // 分享图标
    }
    wx.onMenuShareAppMessage(shareInfo)
    wx.onMenuShareTimeline(shareInfo)
    wx.onMenuShareQQ(shareInfo)
    wx.onMenuShareQZone(shareInfo)
    // wx.updateAppMessageShareData(shareInfo);
    // wx.updateTimelineShareData(shareInfo);
  }
}
