/**
 * 工具函数
 */
let createHash = require('create-hash');
module.exports = {
  // 生成随机数
  createNonceStr() {
    // 此处将0-1的随机数转换为36进制
    return Math.random().toString(36).substr(2, 15)
  },
  // 生成时间戳
  createTimeStamp() {
    return parseInt(new Date().getTime() / 1000) + ''
  },
  // Object转换为JSON并排序
  raw(args) {
    // key按字母排序
    let keys = Object.keys(args).sort();
    let obj = {};
    // 获取排序后的对象
    keys.forEach(function (key) {
      obj[key] = args[key]
    })
    // 将对象转换为&分割的参数
    let val = ''
    for (let k in obj) {
      val += '&' + k + '=' + obj[k]
    }
    return val.substr(1);
  },
  // 生成交易Id
  getTradeId() {
    var date = new Date().getTime().toString()
    var text = ""
    var possible = "0123456789"
    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return 'ImoocMpCloud' + date + text;
  },
  // 根据对象生成签名
  getSign(params, key) {
    var string = this.raw(params);
    string = string + '&key=' + key
    var sign = createHash('md5').update(string).digest('hex')
    return sign.toUpperCase();
  },
  // 对请求结果统一处理
  handleResponse(err, response, body) {
    if (!err && response.statusCode === 200) {
      let data = JSON.parse(body);
      return this.handleSuc(data);
    } else {
      return this.handleFail(err, 1009);
    }
  },
  // 请求成功封装
  handleSuc(data = '') {
    console.log(JSON.stringify(data))
    return {
      code: 0,
      data,
      message: ''
    }
  },
  // 请求失败封装
  handleFail(message = '', code = 1006) {
    console.log(message);
    return {
      code,
      data: '',
      message
    }
  }
}