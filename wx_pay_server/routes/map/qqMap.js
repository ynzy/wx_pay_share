/**
 * 腾讯地图开发
 */
let express = require('express')
const { getLocation, getLocationTranslate, getAddress } = require('../common/qqMapApi')
let router = express.Router()

router.get('/getLocation', async function (req, res) {
	// console.log(req.query)
	//中文需要转译
	let addressRes = await getAddress('%E6%B2%B3%E5%8C%97%E7%9C%81%E4%BF%9D%E5%AE%9A%E5%B8%82%E7%AB%9E%E7%A7%80%E5%8C%BA%E4%B8%9C%E9%A3%8E%E4%B8%AD%E8%B7%AF9%E5%8F%B7')
	console.log('物理地址获取的位置信息：', addressRes.data.result.location)

	let { latitude, longitude } = req.query
	let location = `${latitude},${longitude}`
	let translateRes = await getLocationTranslate(location, 1)
	console.log(translateRes.data.locations)
	let { lng, lat } = translateRes.data.locations[0]
	location = `${lat},${lng}`
	let result = await getLocation(location)
	// console.log(result)
	res.json(result)
})

module.exports = router
