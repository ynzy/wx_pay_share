/**
 * 微信支付通用封装
 */
const request = require('request')
const createHash = require('create-hash')
const xml = require('xml2js')
const util = require('../../utils/util')
const { mch: config } = require('../../config')

module.exports = {
  /**
   * 微信统一下单
   * @param {*} appid 应用id
   * @param {*} attach 附加数据
   * @param {*} body 主题内容
   * @param {*} mch_id 商户号
   * @param {*} out_trade_no 商户订单号
   * @param {*} nonce_str 随机数
   * @param {*} openid openid
   * @param {*} total_fee 支付金额(分)
   * @param {*} notify_url 回调地址
   * @param {*} spbill_create_ip: ip 地址ip
   */
  order: function ({ appid, attach, body, openid, total_fee, notify_url, ip }) {
    return new Promise((resolve, reject) => {
      let _that = this;
      let nonce_str = util.createNonceStr()
      let out_trade_no = util.getTradeId('mp')
      let mch_id = config.mch_id
      // 支付前需要先获取支付签名
      let sign = this.getPrePaySign({ appid, attach, body, mch_id, nonce_str, out_trade_no, openid, total_fee, notify_url, ip })
      // 通过参数和签名组装xml数据，用以调用统一下单接口
      let sendData = this.wxSendData({ appid, attach, body, mch_id, nonce_str, out_trade_no, openid, total_fee, notify_url, ip, sign })
      console.log(sendData);
      // 请求微信服务器统一下单接口
      let url = `https://api.mch.weixin.qq.com/pay/unifiedorder`
      request({
        url,
        method: 'POST',
        body: sendData
      }, function (err, response, body) {
        if (err || response.statusCode != 200) {
          // 请求错误
          console.log(err);
          resolve(util.handleFail(err))
          return
        }
        // 请求成功
        // 将xml文件转化为js
        xml.parseString(body.toString('utf-8'), function (error, res) {
          if (error) {
            console.log('解析xml失败');
            console.log(error);
            return
          }
          let data = res.xml
          if (data.return_code == 'success' && data.result_code == 'success') {
            // 获取预支付的ID
            let prepay_id = data.prepay_id
          }
        })
      })
    })
  },
  /**
   * 生成预支付签名
   * 
   * @param {*} appid 应用id
   * @param {*} attach 附加数据
   * @param {*} body 主题内容
   * @param {*} mch_id 商户号
   * @param {*} out_trade_no 商户订单号
   * @param {*} nonce_str 随机数
   * @param {*} openid openid
   * @param {*} total_fee 支付金额(分)
   * @param {*} notify_url 回调地址
   * @param {*} spbill_create_ip: ip 地址ip
   * @param {*} trade_type 交易类型 'JSAPI'
   */
  getPrePaySign: function ({ appid, attach, body, mch_id, nonce_str, out_trade_no, openid, total_fee, notify_url, ip }) {
    let params = { appid, attach, body, mch_id, nonce_str, out_trade_no, notify_url, openid, spbill_create_ip: ip, total_fee, trade_type: 'JSAPI' }
    // stringSignTemp=stringA+"&key=192006250b4c09247ec02edce69f6a2d" //注：key为商户平台设置的密钥key
    let str = util.raw(params) + '&key=' + config.key
    // 进行 md5 加密,生成签名 最好加一个hex参数
    let sign = createHash('md5').update(str).digest('hex')
    return sign.toUpperCase()
  },
  /**
   * 签名成功之后，根据参数拼接组装XML格式的数据，调用下单接口
   */
  wxSendData: function ({ appid, attach, body, mch_id, nonce_str, out_trade_no, openid, total_fee, notify_url, ip, sign }) {
    return `<xml>
      <appid><![CDATA[${appid}]]></appid>
      <attach><![CDATA[${attach}]]></attach>
      <body><![CDATA[${body}]]></body>
      <mch_id><![CDATA[${mch_id}]]></mch_id>
      <nonce_str><![CDATA[${nonce_str}]]></nonce_str>
      <notify_url><![CDATA[${notify_url}]]></notify_url>
      <openid><![CDATA[${openid}]]></openid>
      <out_trade_no><![CDATA[${out_trade_no}]]></out_trade_no>
      <spbill_create_ip><![CDATA[${ip}]]></spbill_create_ip>
      <total_fee><![CDATA[${total_fee}]]></total_fee>
      <trade_type><![CDATA[JSAPI]]></trade_type>
      <sign><![CDATA[${sign}]]></sign>
    </xml>`
  }
}