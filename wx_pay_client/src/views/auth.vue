<!--  -->
<template>
  <div>没有授权</div>
</template>

<script>
import { wechatRedirect, wechatConfig, getLocation, getOpenId } from '@/api/auth'
import { getUrlParam } from '@/utils/util'
const url = localStorage.getItem('now_url')
export default {
  data() {
    return {}
  },
  methods: {
    checkUserAuth() {
      console.log(wechatRedirect(location.origin))
      window.location.href = 'http://localhost:3000' + wechatRedirect(location.origin)
      /* axios.get(
          `http://api.example.com/api/wechat/redirect?url=${wechatRedirect(location.origin)}`
        ).then(res=>{
          
        }) */
    },
    getOpenIdInfo(code) {
      // console.log(code)
      // window.location.href = `http://localhost:3000/api/wechat/getOpenId?code=${code}`
      getOpenId({ code })
        .then(res => {
          console.log(res)
          if (res.code == 0) {
            localStorage.setItem('openid', res.data.openId)
            window.location.replace(location.origin + '/#' + url)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted() {
    // console.log(this.$route)
    const code = getUrlParam('code') // 截取code
    console.log(code)
    if (!code) {
      this.checkUserAuth()
    } else {
      this.getOpenIdInfo(code)
    }
  },
  components: {}
}
</script>
<style lang="less" scoped>
/* @import url(); 引入css类 */
</style>
