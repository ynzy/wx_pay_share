<template>
  <div class="activity">
    <img class="header" src="../assets/image/header.png" />
    <div class="content">
      <div class="item-info">
        <h2 class="item-title">活动说明</h2>
        <ul class="item-ul">
          <li class="item-li">1、欢迎来到慕课支付专项课程</li>
          <li class="item-li">2、本课程专门针对大家对微信SDK使用的痛点进行讲解</li>
          <li class="item-li">3、从公众号创建，微信支付申请到代码编写手把手教大家使用相关API功能</li>
          <li class="item-li">4、课程最大的难点在于开发流程的理解和签名算法的生成</li>
          <li class="item-li">5、此课程通过几个页面将支付和分享相关业务串联起来让大家彻底熟悉微信支付功能</li>
        </ul>
      </div>
      <p class="tip">在法律范围允许范围内，本课程最终版权归慕课所有</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'activity'
}
</script>
<style>
.activity {
  background-color: #ffc93a;
}
.content {
  padding: 0 0.4rem 0.72rem;
}
.item-info {
  padding: 0.73rem 0.39rem 1.64rem;
  background-color: #ffffff;
  box-shadow: 0px 8px 48px 6px rgba(252, 195, 56, 0.44);
  border-radius: 10px;
}
.item-info .item-title {
  background: url("../assets/image/tip.png") no-repeat;
  background-size: 50%;
  background-position: center;
  text-align: center;
  font-size: 0.3rem;
  color: #3f1e00;
  margin-bottom: 0.56rem;
}
.item-info .item-ul {
  list-style: none;
  font-size: 0.3rem;
  color: #9e9999;
}
.item-info .item-ul .item-li {
  font-size: 0.28rem;
  font-weight: normal;
  color: #333333;
  line-height: 0.48rem;
}
.content .tip {
  margin-top: 0.88rem;
  text-align: center;
  font-size: 0.24rem;
  color: #6d5312;
}
</style>