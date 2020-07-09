// 云函数入口文件
let cloud = require('wx-server-sdk')

cloud.init()

//微信小程序支付封装,暂支持md5加密，不支持sha1
/**
***create order by jianchep 2016/11/22     
 **/
let config = require('./config.js')
let request = require("request");
let util = require('./util');
let xml = require('xml2js');
// 支付前先获取预支付签名sign
let getPrePaySign = function (appId, attach, body, mchId, nonceStr, notifyUrl, openId, tradeId, ip, totalFee) {
  var params = {
    appid: appId,
    attach: attach,
    body: body,
    mch_id: mchId,
    nonce_str: nonceStr,
    notify_url: notifyUrl,
    openid: openId,
    out_trade_no: tradeId,
    spbill_create_ip: ip,
    total_fee: totalFee,
    trade_type: 'JSAPI'
  }
  return util.getSign(params, config.key);
};
// 签名成功后，将数据拼接成功xml格式一起发送给微信下单接口
let wxSendData = function (appId, attach, body, mchId, nonceStr, notifyUrl, openId, tradeId, ip, totalFee, sign) {
  let sendData = '<xml>' +
    '<appid><![CDATA[' + appId + ']]></appid>' +
    '<attach><![CDATA[' + attach + ']]></attach>' +
    '<body><![CDATA[' + body + ']]></body>' +
    '<mch_id><![CDATA[' + mchId + ']]></mch_id>' +
    '<nonce_str><![CDATA[' + nonceStr + ']]></nonce_str>' +
    '<notify_url><![CDATA[' + notifyUrl + ']]></notify_url>' +
    '<openid><![CDATA[' + openId + ']]></openid>' +
    '<out_trade_no><![CDATA[' + tradeId + ']]></out_trade_no>' +
    '<spbill_create_ip><![CDATA[' + ip + ']]></spbill_create_ip>' +
    '<total_fee><![CDATA[' + totalFee + ']]></total_fee>' +
    '<trade_type><![CDATA[JSAPI]]></trade_type>' +
    '<sign><![CDATA[' + sign + ']]></sign>' +
    '</xml>'
  return sendData
};
// 用生成的预支付ID再次签名，拼接对应的前端需要的字段
let getPayParams = function (appId, prepayId) {
  let nonceStr = util.createNonceStr();
  let timeStamp = util.createTimeStamp();
  let package = 'prepay_id=' + prepayId;
  let params = {
    appId: appId,
    nonceStr: nonceStr,
    package: package,
    signType: 'MD5',
    timeStamp: timeStamp
  }
  let paySign = util.getSign(params, config.key);
  // 前端需要的所有数据, 都从这里返回过去
  params.paySign = paySign;
  return params;
}
exports.main = function (event, context) {
  const wxContext = cloud.getWXContext()
  console.log('event:' + JSON.stringify(event));
  let {appId, attach, body, mchId, notifyUrl, ip} = config;
  let openId = wxContext.OPENID;
  let totalFee = event.totalFee;
  let nonceStr = util.createNonceStr();
  let tradeId = util.getTradeId();
  // 支付前需要先获取签名
  let sign = getPrePaySign(appId, attach, body, mchId, nonceStr, notifyUrl, openId, tradeId, ip, totalFee);
  // 将签名一起组装成post数据，通过xml的格式发送给微信
  let sendData = wxSendData(appId, attach, body, mchId, nonceStr, notifyUrl, openId, tradeId, ip, totalFee, sign);
  console.log("sendData:::" + sendData);
  return new Promise((resolve,reject)=>{
    let url = "https://api.mch.weixin.qq.com/pay/unifiedorder";
    request({
      url: url,
      method: 'POST',
      body: sendData
    }, function (err, response, body) {
      // 先将返回数据转换成json，否则handle方法会报错
      if (!err && response.statusCode === 200) {
        xml.parseString(body.toString('utf-8'), (error, res) => {
          // 获取xml根对象
          let data = res.xml;
          if (data.return_code[0] == 'SUCCESS' && data.result_code[0] == 'SUCCESS') {
            // 获取预支付ID
            var prepay_id = data.prepay_id[0];
            // 从新签名，获取前端支付SDK所需要的字段
            let payResult = getPayParams(appId, prepay_id);
            resolve(payResult);
          } else {
            let msg = data.return_msg || data.err_code_des;
            reject(msg);
          }
        });
      } else {
        reject(err);
      }
    })
  })
}