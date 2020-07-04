/**
 * 小程序开发
 */

let express = require('express');
let router = express.Router();
let request = require('request');
let { mp: config } = require('../../config');
let util = require('../../utils/util')
let dao = require('../common/db');
const { order } = require('../common/wxpay');
/**
 * 获取session接口
 * @param {*} code 小程序登陆code
 */
router.get('/getSession', function (req, res) {
  let code = req.query.code
  // 获取code失败
  if (!code) {
    res.json(util.handleFail('code不能为空', 10001));
    return
  }
  // 获取code成功
  let sessionUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${config.appId}&secret=${config.appSecret}&js_code=${code}&grant_type=authorization_code`;
  request(sessionUrl, function (err, response, body) {
    let result = util.handleResponse(err, response, body);
    // console.log(result);
    // 返回openid给前端
    res.json(result);
  })
})
/**
 * 授权登录
 * @param userInfo 用户信息+openid
 */
router.get('/login', async function (req, res) {
  let userInfo = JSON.parse(req.query.userInfo) // 字符串转对象
  // console.log(userInfo);
  // 获取用户信息失败
  if (!userInfo) {
    res.json(util.handleFail('用户信息不能为空', 10002))
    return
  }
  // 获取成功
  // 查询当前用户是否已经注册
  let userRes = await dao.query({ openid: userInfo.openid }, 'users_mp')
  console.log(userRes);
  // 查询数据库失败
  if (userRes.code != 0) {
    res.json(userRes)
    return
  }
  // 有此用户信息
  if (userRes.data.length > 0) {
    res.json(util.handleSuccess({
      userId: userRes.data[0]._id
    }))
    return
  }
  // 没有此用户信息，添加到数据库中
  let insertData = await dao.insert(userInfo, 'users_mp')
  // 添加失败
  if (insertData.code != 0) {
    res.json(insertData)
    return
  }
  // 添加成功
  res.json(util.handleSuccess({
    userId: insertData.data.insertedId
  }))
})

/**
 * 支付回调通知
 */
router.get('/pay/callback', function (req, res) {
  res.json(util.handleSuccess())
})

/**
 * 小程序支付
 * @param {*} openId
 */
router.get('/pay/payWallet', function (req, res) {
  let appid = config.appId //小程序id
  let openid = req.query.openId; // 用户的openid
  let attach = '支付附加数据' // 附加数据
  let body = '小程序支付'  // 主体内容
  let total_fee = req.query.money // 支付金额（分）
  let ontify_url = 'http://localhost:3000/api/map/pay/callback' // 微信回调接口
  let ip = '123.57.2.144' // 终端ip
  let orderRes = order({ appid, attach, body, openid, total_fee, ontify_url, ip }).then(result => {
    res.json(util.handleSuccess(result))
  }).catch((result) => {
    res.json(util.handleFail(result))
  })
  // res.json(util.handleSuccess())
})
module.exports = router