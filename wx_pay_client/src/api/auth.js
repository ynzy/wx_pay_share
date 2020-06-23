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
 * @param {*} href
 * @returns
 */
export const payWallet = () => {
  return awaitWrap(
    request({
      url: `/api/wechat/pay/payWallet`,
      method: 'get'
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
  url = window.encodeURIComponent('http://m.imooc.com')
  return `/api/wechat/redirect?url=${url}&scope=snsapi_userinfo`
}
