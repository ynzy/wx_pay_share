<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    // 检查用户是否授权过
    checkUserAuth() {
      let openId = this.$cookie.get('openId')
      if (!openId) {
        window.location.href = API.wechatRedirect
      }
    }
  },
  mounted() {
    this.checkUserAuth()
  },
  components: {}
}
</script>
<style lang="less" scoped>
/* @import url(); 引入css类 */
</style>
