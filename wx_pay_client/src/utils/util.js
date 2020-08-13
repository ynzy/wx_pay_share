/**
 * 处理await成功失败信息
 * @param {*} promise
 */
export const awaitWrap = promise => {
  return promise.then(data => [null, data]).catch(err => [err, null])
}

/**
 * 处理空的参数
 * @param obj
 * @returns
 */
export const cleanParams = function(obj) {
  return Object.keys(obj).map(key => (obj[key] = ''))
}

/**
 * 获取浏览器地址栏参数值
 * @param {*} name 参数名
 * @returns
 */
export const getUrlParam = function(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURIComponent(r[2])
}
// 获取url参数
export const getUrlParame = function(parameName) {
  /// 获取地址栏指定参数的值
  /// <param name="parameName">参数名</param>
  // 获取url中跟在问号后面的部分
  var parames = window.location.search
  // 检测参数是否存在
  if (parames.indexOf(parameName) > -1) {
    var parameValue = ''
    parameValue = parames.substring(parames.indexOf(parameName), parames.length)
    // 检测后面是否还有参数
    if (parameValue.indexOf('&') > -1) {
      // 去除后面多余的参数, 得到最终 parameName=parameValue 形式的值
      parameValue = parameValue.substring(0, parameValue.indexOf('&'))
      // 去掉参数名, 得到最终纯值字符串
      parameValue = parameValue.replace(parameName + '=', '')
      return parameValue
    }
    return ''
  }
}
