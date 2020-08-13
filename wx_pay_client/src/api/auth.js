import request from '@/utils/http'
import { awaitWrap } from '@/utils/util'

/**
 * 获取微信配置
 * @param {*} href 路由地址 后台根据当前url地址进行签名
 */
export const wechatConfig = href => {
  return awaitWrap(
    request({
      url: `/api/wechat/jssdk?url=${href}`,
      method: 'get'
    })
  )
}

/**
 * 获取用户信息
 * @param {*} href
 * @returns
 */
export const getUserInfo = () => {
  return awaitWrap(
    request({
      url: `/api/wechat/getUserInfo`,
      method: 'get'
    })
  )
}

/**
 * 获取微信支付信息
 * @param {*} money 钱
 * @returns
 */
export const payWallet = ({ ...params }) => {
  return awaitWrap(
    request({
      url: `/api/wechat/pay/payWallet`,
      method: 'get',
      params
    })
  )
}

/**
 * 微信重定向
 * @param {*} url 重定向地址
 * encodeURIComponent('http://m.imooc.com/#/index')
 * http%3A%2F%2Fm.51purse.com%2F%23%2Findex
 * @returns
 */
export const wechatRedirect = url => {
  url = window.encodeURIComponent(url)
  return `/api/wechat/redirect?url=${url}&scope=snsapi_userinfo`
}

/**
 * 获取当前地理位置信息
 * @param {*} href
 * @returns
 */
export const getLocation = ({ ...params }) => {
  return awaitWrap(
    request({
      url: `/api/qqMap/getLocation`,
      method: 'get',
      params
    })
  )
}
/**
 * 重定向获取url
 * @param {*} url
 * @returns
 */
export const redirectUrl = url => {
  return request({
    url: `/api/wechat/redirect?url=${url}&scope=snsapi_userinfo`,
    method: 'get'
  })
}
/**
 * 重定向获取url
 * @param {*} code
 * @returns
 */
export const getOpenId = ({ ...params }) => {
  return request({
    url: `/api/wechat/getOpenId`,
    method: 'get',
    params
  })
}
