/**
 * @author
 * @description 微信接口统一封装处理
 */
let request = require('request')
let config = require('./../pay/config')
let util = require('../../utils/util')
config = config.wx

/**
 * 获取accessToken
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
 * @param code 授权code码
 */
exports.getAccessToken = function (code) {
	let access_token_url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.appId}&secret=${config.appSecret}&code=${code}&grant_type=authorization_code`
	return new Promise((resolve, reject) => {
		request.get(access_token_url, function (err, response, body) {
			let result = util.handleResponse(err, response, body)
			// console.log(result)
			resolve(result)
			// 这里都使用resolve是因为封装了处理请求，最后都是返回成功了信息，只是code码不一样
			/* if (result.code != 0) {
					// 请求失败
					resolve(result)
					return
				}
				resolve(
					util.handleSuccess({
						openId: result.openid
					})
				) */
		})
	})
}

/**
 * 拉取用户信息(需scope为 snsapi_userinfo)
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html#3
 * @param access_token
 * @param openId
 */
exports.getUserInfo = function (access_token, openId) {
	let userInfo_url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openId}&lang=zh_CN`
	return new Promise((resolve, reject) => {
		request.get(userInfo_url, function (err, response, body) {
			let result = util.handleResponse(err, response, body)
			// console.log(result)
			resolve(result)
		})
	})
}
