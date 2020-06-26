<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { wechatRedirect, wechatConfig } from '@/api/auth'
import wx from 'weixin-js-sdk'
import { initShareInfo } from '@/utils/wx'
export default {
  data() {
    return {}
  },
  methods: {
    // 检查用户是否授权过
    checkUserAuth() {
      let openId = this.$cookie.get('openId')
      if (!openId) {
        console.log(wechatRedirect(location.origin))
        // 请求后台接口进行授权回调
        window.location.href = wechatRedirect(location.origin)
        return
        // 前台模拟微信授权回调
        /* let appid = 'wx9790364d20b47d95'
        let url = window.encodeURIComponent('http://m.imooc.com')
        let url = window.encodeURIComponent('http://c1a8950d2703.ngrok.io')
        let scope = 'snsapi_userinfo'
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${url}&response_type=code&scope=${scope}&state=STATE#wechat_redirect` */
      } else {
        // this.getWechatConfig()
      }
    },
    // 获取微信配置信息
    async getWechatConfig() {
      let [err, res] = await wechatConfig(location.href.split('#')[0])
      if (err) {
        console.log(err)
        // return this.$message.error(err.message || '获取微信配置失败')
      }
      console.log(res)
      return
      let data = res.data
      wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: data.jsApiList // 必填，需要使用的JS接口列表
      })
      wx.ready(() => {
        // initShareInfo(wx)
      })
      // this.$message.success(res.message || '获取成功')
    }
  },
  mounted() {
    this.checkUserAuth()
    // var url = window.encodeURIComponent('http://m.imooc.com')
  },
  components: {}
}
</script>
<style lang="less" scoped>
/* @import url(); 引入css类 */
</style>
