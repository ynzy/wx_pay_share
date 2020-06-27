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
