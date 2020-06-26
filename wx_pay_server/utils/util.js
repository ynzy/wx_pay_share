module.exports = {
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
