<template>
  <div class="index">
    <img class="header" src="../assets/image/header.png" />
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
export default {
  name: 'index',
  data() {
    return {
      showShare: false
    }
  },
  methods: {}
}
</script>
<style>
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
</style>
