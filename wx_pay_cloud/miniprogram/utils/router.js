/**
 * 通用的路由跳转文件
 */

const routerPath = {
  'index': "/pages/index/index",
  'pay': "/pages/pay/index",
  'activity': "/pages/activity/index"
}

module.exports = {
  /**
   * 页面跳转
   * push('index')
   * push({
   *  path: '/index',
   *  query: {
   *    userId:123
   *  }
   * })
   * @param {*} path 
   * @param {*} option 
   * query  传递参数
   * openType  跳转类型
   * duration 持续时间
   * backNum openType='back'时使用，返回上级页面（多级）
   */
  push(path, option = {}) {
    // 通过 push('index') 这种方式跳转
    if (typeof path == 'string') {
      option.path = path
    } else {
      option = path
    }
    let url = routerPath[option.path]
    // 传递参数 跳转类型 持续时间
    let { query = {}, openType, duration,backNum } = option
    let params = this.parse(query)
    url += `?${params}`
    duration ? setTimeout(() => {
      this.to(openType,url,backNum)
    }, duration) : this.to(openType,url,backNum)

  },
  /**
   * 路由跳转
   *
   * @param {*} openType  跳转类型
   * redirect,reLaunch,switchTab,back,navigateTo
   * @param {*} url 路由地址
   * @param {Number} backNum openType='back'时使用，返回上级页面（多级）
   */
  to(openType, url,backNum) {
    let obj = { url }
    switch (openType) {
      case 'redirect':
        wx.redirectTo(obj);
        break;
      case 'reLaunch':
        wx.reLaunch(obj);
        break;
      case 'switchTab':
        wx.switchTab(obj);
        break;
      case 'back':
        wx.navigateBack({
          delta: backNum || 1
        });
        break;
      default:
        wx.navigateTo(obj);
        break;
    }
  },
  /**
   * 对象转换为 & 符连接
   * @param {Object} data
   * @returns
   */
  parse(data) {
    let arr = []
    // let data = {a:1,b:2,c:3}  a=1&b=2&c=3
    for (const key in data) {
      arr.push(`${key}=${data[key]}`)
    }
    return arr.join('&')
  }
}