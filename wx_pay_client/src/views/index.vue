<template>
  <div class="index">
    <img class="header" src="../assets/image/header.png" />
    <div class="user_info" v-if="userInfo">
      <div class="avator_img">
        <img :src="userInfo.headimgurl" alt="" />
      </div>
      <div class="nickname">{{ userInfo.nickname }}</div>
    </div>
    <div class="btn-group">
      <button class="btn">分享</button>
      <button class="btn btn-primary btn-pay">体验</button>
      <button class="btn">活动详情</button>
    </div>
    <!--<div class="share">
      <img src="./../assets/images/share_guide.png" alt="">
      <img src="./../assets/images/share.png" alt="">
    </div>-->
  </div>
</template>

<script>
import { getUserInfo } from '@/api/auth'
export default {
  name: 'index',
  data() {
    return {
      userInfo: {},
      showShare: false
    }
  },
  methods: {
    async getUser() {
      let [err, res] = await getUserInfo()
      if (err) {
        console.log(err)
        return
      }
      // console.log(res)
      this.userInfo = res.data
    }
  },
  mounted() {
    if (this.$cookie.get('openId')) {
      this.getUser()
    }
    console.log(this.$wx)
  }
}
</script>
<style lang="less">
.index {
  background-color: #ffc93a;
  height: 100vh;
}

.btn-group {
  padding-top: 0.34rem;
  text-align: center;
}
.btn-group .btn-pay {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.share {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
}
.share img {
  width: 100%;
}
.user_info {
  position: absolute;
  top: 10px;
  right: 20px;
  // transform: translate(-50%, 0);
  // width: 100%;
  height: 80px;
}
.avator_img {
  width: 40px;
  height: 40px;
  img {
    width: 100%;
    height: 100%;
  }
}
.nickname {
  margin-top: 10px;
  text-align: center;
  font-size: 15px;
}
</style>
