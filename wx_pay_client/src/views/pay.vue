<template>
  <div class="recharge">
    <div class="recharge-box">
      <h2 class="title">充值金额</h2>
      <div class="input-box">
        <input class="input" type="number" placeholder="请输入充值金额" v-model="money">
      </div>
      <div class="item-num">
        <span class="num">1分</span>
        <span class="num">2毛</span>
      </div>
      <div class="item-num">
        <span class="num">1元</span>
        <span class="num">5元</span>
      </div>
      <button class="btn btn-primary btn-recharge">充值</button>
      <p class="tip">点击充值即表示已阅读并同意<a class="protocol" href="javascript:;">充值协议</a></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pay',
  data(){
    return {}
  },
  methods:{
    
  }
}
</script>
<style>
  .recharge{
    background:#ffffff;
  }
  .recharge-box{
    padding:0 .3rem;
  }
  .recharge-box .title{
    font-size:.34rem;
    color:#333333;
    margin-top:.69rem;
  }
  .recharge-box .input-box{
    text-align:center;
    margin-top:.5rem;
    margin-bottom:.3rem;
  }
  .recharge-box .input-box .input{
    display: block;
    width:6.9rem;
    height:1rem;
    border:1px solid #D7D7D7;
    border-radius:5px;
    font-size:.3rem;
    color:#333333;
    text-align:center;
  }
  .item-num{
    display:flex;
    justify-content: space-between;
    margin-bottom: .31rem;
  }
  .item-num .num{
    height: 1.3rem;
    background-color: #F1F3F5;
    color: #333333;
    font-size: .32rem;
    width: 3.35rem;
    text-align: center;
    line-height: 1.3rem;
    border-radius:.08rem;
  }
  .item-num .num.checked{
    background-color: #FFEBE8;
    color:#FF3418;
  }
  .recharge-box .btn-recharge{
    /*此处3.9改成3，保证一屏可以看到，因为距离太大了*/
    display:block;
    margin:3rem auto .48rem;
    color:#FFFFFF;
    font-weight:400;
    box-shadow:0px 10px 18px 0px rgba(255,106,106,0.57);
  }
  .recharge-box .tip{
    font-size:.28rem;
    color:#999999;
    text-align:center;
  }
  .recharge-box .tip .protocol{
    color:#FF3418;
  }
</style>