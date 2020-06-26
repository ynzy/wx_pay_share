/**
 * 微信开发
 */
let express = require('express')
let router = express.Router()
let cache = require('memory-cache')
let { wx: config } = require('./config')
let common = require('./../common/index.js')
let util = require('../../utils/util')

router.get('/test', function (req, res) {
	res.json({
		code: 0,
		data: 'test',
		message: ''
	})
})

/**
 * 用户授权重定向
 * @query url
 * @query scope
 * @return
 */
router.get('/redirect', function (req, res, next) {
	let redirectUrl = req.query.url // 最终重定向的地址->跳转回前端的页面
	let scope = req.query.scope // 作用域
	// console.log(redirectUrl)
	let callback = `${redirectUrl}/api/wechat/getOpenId` // 授权回调地址，用来获取openId
	cache.put('redirectUrl', redirectUrl) // 通过cache 缓存重定向地址
	let authorizeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appId}&redirect_uri=${callback}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`
	// console.log(authorizeUrl)
	res.redirect(authorizeUrl) //服务端重定向
})

/**
 * 根据code获取用户的OpenId
 * @query code 用户授权之后获取到的code
 */
router.get('/getOpenId', async function (req, res) {
	let code = req.query.code
	// console.log('请求code成功')
	// console.log('code:' + code)
	if (!code) {
		res.json(util.handleFail('当前未获取到授权的code码'))
		return
	}
	let result = await common.getAccessToken(code)
	if (result.code != 0) {
		console.log(result)
		// 请求失败
		res.json(result)
		return
	}
	let data = result.data
	let expire_time = 1000 * 60 * 60 * 2 // 过期时间 2个小时
	// 将openId，taccess_token存储到缓存里
	cache.put('access_token', data.access_token, expire_time)
	cache.put('openId', data.openid, expire_time)
	// console.log(data.openid)
	// 请求成功，将openid存储到cookie
	res.cookie('openId', data.openid, { maxAge: expire_time })
	let redirectUrl = cache.get('redirectUrl') //获取缓存中的重定向地址
	res.redirect(redirectUrl)
})

/**
 * 获取用户信息
 */
router.get('/getUserInfo', async function (req, res) {
	let access_token = cache.get('access_token')
	let openId = cache.get('openId')
	let result = await common.getUserInfo(access_token, openId)
	res.json(result)
})

module.exports = router
