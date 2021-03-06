const createHash = require('create-hash')
module.exports = {
	/**
	 * 生成随机字符串
	 */
	createNonceStr() {
		// 生成随机数转化成36进制,截取2-15位
		return Math.random().toString(36).substr(2, 15)
	},
	/**
	 * 生成随机时间戳
	 */
	creatTimeStamp() {
		return parseInt(new Date().getTime() / 1000) + ''
	},
	/**
	 * 生成签名
	 */
	getSign(params, key) {
		let str = this.raw(params) + '&key=' + key
		// 进行 md5 加密,生成签名 最好加一个hex参数
		let sign = createHash('md5').update(str).digest('hex')
		return sign.toUpperCase()
	},
	/**
	 * 生成系统的交易订单号
	 * @param type wx：微信  mp：小程序
	 */
	getTradeId(type = 'wx') {
		let date = new Date().getTime().toString()
		let text = '';
		let possible = '0123456789'
		// 生成5位随机数
		for (let i = 0; i < 5; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length))
		}
		return type == ('wx' ? 'Wx' : 'Mp') + date + text
	},
	/**
	 * Object 转换成json 并排序
	 */
	raw(args) {
		// 对对象中的key值进行排序
		let keys = Object.keys(args).sort()
		let obj = {}
		// 遍历key值赋值给新的对象
		keys.forEach(key => {
			obj[key] = args[key]
		})
		// 将对象转换为&分割的参数  {a:1,b:2} => a=1&b=2
		var val = ''
		for (let k in obj) {
			val += `&${k}=${obj[k]}` // &a=1&b=2
		}
		// 从字符串1的位置截取，去掉最开始的&符号
		return val.substring(1)
	},
	/**
	 * 处理微信请求返回信息统一处理
	 * @param {*} err
	 * @param {*} response
	 * @param {*} body
	 */
	handleResponse(err, response, body) {
		if (err || response.statusCode != '200') {
			// 微信服务器请求失败
			this.handleFail(err, 10009)
			return
		}
		// console.log('body:', body)
		let data = JSON.parse(body)
		if (data && data.errcode) {
			// 请求失败
			console.log(`请求微信服务失败：errcode:${data.errcode},errmsg:${data.errmsg}`)
			this.handleFail(data.errmsg, data.errcode)
			return
		}
		// 请求成功
		return this.handleSuccess(data)
	},
	/**
	 * 处理成功的信息
	 *
	 * @param {string} [data='']
	 * @returns
	 */
	handleSuccess(data = '') {
		return {
			code: 0,
			data,
			message: '成功'
		}
	},
	/**
	 * 处理失败的信息
	 *
	 * @param {string} [message='']
	 * @param {number} [code=10001]
	 * 10009 微信服务器请求失败
	 * 10001 处理错误
	 * @returns
	 */
	handleFail(message = '', code = 10001) {
		return {
			code,
			data: '',
			message
		}
	}
}
