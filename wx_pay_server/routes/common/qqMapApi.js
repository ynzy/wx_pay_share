/**
 * 腾讯公共API统一封装
 */
const request = require('request')
const { qqMap: config } = require('../../config')
const util = require('../../utils/util')

/**
 * 实现从其它地图供应商坐标系或标准GPS坐标系，批量转换到腾讯地图坐标系。
 * https://lbs.qq.com/service/webService/webServiceGuide/webServiceTranslate
 * @param location 经纬度字符串 纬度，经度
 * @param type 输入的locations的坐标类型
 */
exports.getLocationTranslate = function (location, type) {
	let translate_url = `https://apis.map.qq.com/ws/coord/v1/translate?locations=${location}&key=${config.key}&type=${type}`
	return new Promise((resolve, reject) => {
		request.get(translate_url, function (err, response, body) {
			let result = util.handleResponse(err, response, body)
			resolve(result)
		})
	})
}

/**
 * 根据经纬度获取地理位置信息
 * https://lbs.qq.com/service/webService/webServiceGuide/webServiceGcoder
 * @param location 经纬度字符串 纬度，经度
 */
exports.getLocation = function (location) {
	let location_url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${location}&key=${config.key}`
	return new Promise((resolve, reject) => {
		request.get(location_url, function (err, response, body) {
			let result = util.handleResponse(err, response, body)
			resolve(result)
		})
	})
}

/**
 * 根据描述位置获取位置信息
 * https://lbs.qq.com/service/webService/webServiceGuide/webServiceGcoder
 * @param address 位置信息
 */
exports.getAddress = function (address) {
	let address_url = `https://apis.map.qq.com/ws/geocoder/v1/?address=${address}&key=${config.key}`
	return new Promise((resolve, reject) => {
		request.get(address_url, function (err, response, body) {
			let result = util.handleResponse(err, response, body)
			resolve(result)
		})
	})
}
