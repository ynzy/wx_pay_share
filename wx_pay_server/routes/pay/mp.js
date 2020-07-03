/**
 * 小程序开发
 */

let express = require('express');
let router = express.Router();
let request = require('request');
let { mp: config } = require('../../config');
let util = require('../../utils/util')
let dao = require('../common/db')
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

module.exports = router