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
