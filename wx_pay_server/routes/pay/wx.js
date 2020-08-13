/**
 * H5微信开发
 */
let express = require('express')
let createHash = require('create-hash')
let router = express.Router()
let cache = require('memory-cache')
let { wx: config } = require('../../config.js')
let common = require('./../common/index.js')
let util = require('../../utils/util')
let dao = require('../common/db')
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
	// console.log(req)
	let redirectUrl = req.query.url // 最终重定向的地址->跳转回前端的页面
	let scope = req.query.scope // 作用域
	// console.log('重定向地址', redirectUrl)
	// let callback = `${redirectUrl}/api/wechat/getOpenId` // 授权回调地址，用来获取openId
	let callback = `${redirectUrl}` // 授权回调地址，用来获取openId
	// let callback = `http%3A%2F%2Fapi.example.com/api/wechat/getOpenId` // 授权回调地址，用来获取openId
	cache.put('redirectUrl', redirectUrl) // 通过cache 缓存重定向地址
	let authorizeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appId}&redirect_uri=${callback}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`
	console.log(authorizeUrl)
	res.redirect(authorizeUrl) //服务端重定向
})

/**
 * 根据code获取用户的OpenId
 * @query code 用户授权之后获取到的code
 */
router.get('/getOpenId', async function (req, res) {
	let code = req.query.code
	console.log('请求code成功')
	console.log('code:' + code)
	if (!code) {
		res.json(util.handleFail('当前未获取到授权的code码'))
		return
	}
	let result = await common.getAccessToken(code)
	if (result.code != 0) {
		console.log(result)
		// 请求失败
		res.json('授权失败accessToken：', result)
		return
	}
	let data = result.data
<<<<<<< HEAD
	// let expire_time = 1000 * 60 * 60 * 2 // 过期时间 2个小时
	let expire_time = 1000 * 60
=======
	let openId = data.openid
	let expire_time = 1000 * 60 * 60 * 2 // 过期时间 2个小时
>>>>>>> 5d4dc7481b9a97e51d25a12a1a6a4dd1472316ce
	// 将openId，taccess_token存储到缓存里
	cache.put('access_token', data.access_token, expire_time)
	cache.put('openId', openId, expire_time)
	// console.log(openId)
	// 请求成功，将openid存储到cookie
	res.cookie('openId', openId, { maxAge: expire_time })

	// 根据openId判断用户是否有注册
	let userRes = await dao.query({ 'openid': openId }, 'users')
	console.log(userRes);
	// 查询失败
	if (userRes.code !== 0) {
		res.json(userRes)
		return
	}
	// 没有此用户
	if (!userRes.data.length) {
		console.log('没有此用户');
		let userData = await common.getUserInfo(data.access_token, openId)
		let insertData = await dao.insert(userData.data, 'users')
		if (insertData.code != 0) {
			// 操作失败
			console.log(insertData);
			return
		}
	}
	// console.log('有此用户');
	// 有此用户
	let redirectUrl = cache.get('redirectUrl') //获取缓存中的重定向地址
	console.log('重定向地址', redirectUrl)

	// res.redirect(`${redirectUrl}?openid=${data.openid}`)
	res.json({
		code: 0,
		data: { openId: data.openid },
		message: ''
	})
})

/**
 * 获取用户信息
 */
router.get('/getUserInfo', async function (req, res) {
	let access_token = cache.get('access_token')
	let openId = cache.get('openId')
	let result = await common.getUserInfo(access_token, openId)
	console.log(result)

	res.json(result)
})

/**
 * 获取jssdk配置
 */
router.get('/jssdk', async function (req, res) {
	let url = req.query.url
	// 获取普通access_token
	let result = await common.getToken()
	if (result.code != 0) {
		console.log(result)
		res.json(result)
		return
	}
	// 有效期7200秒，开发者必须在自己的服务全局缓存access_token
	let token = result.data.access_token
	cache.put('token', token)
	// 获取ticket临时票据
	let ticketRes = await common.getTicket(token)
	if (ticketRes.code != 0) {
		console.log(ticketRes)
		return
	}
	let ticket = ticketRes.data.ticket
	// 签名算法需要的值
	let params = {
		noncestr: util.createNonceStr(),
		jsapi_ticket: ticket,
		timestamp: util.creatTimeStamp(),
		url
	}
	console.log(params)

	// 排序转成字符串
	let str = util.raw(params)
	// 进行sha1加密,生成签名 最好加一个hex参数
	let sign = createHash('sha1').update(str).digest('hex')
	res.json(
		util.handleSuccess({
			appId: config.appId, // 必填，公众号的唯一标识
			timestamp: params.timestamp, // 必填，生成签名的时间戳
			nonceStr: params.noncestr, // 必填，生成签名的随机串
			signature: sign, // 必填，签名
			jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'chooseWXPay'] // 必填，需要使用的JS接口列表
		})
	)
})

module.exports = router
