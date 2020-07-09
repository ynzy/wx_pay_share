<template>
  <div class="recharge">
    <div class="recharge-box">
      <h2 class="title">充值金额</h2>
      <div class="input-box">
        <input class="input" type="number" placeholder="请输入充值金额" v-model="money" />
      </div>
      <div class="item-num">
        <span class="num" :class="index == 1 ? 'checked' : ''" @click="choose(1)">1分</span>
        <span class="num" :class="index == 20 ? 'checked' : 'default'" @click="choose(20)"
          >2毛</span
        >
      </div>
      <div class="item-num">
        <span class="num" :class="index == 100 ? 'checked' : 'default'" @click="choose(100)"
          >1元</span
        >
        <span class="num" :class="index == 500 ? 'checked' : 'default'" @click="choose(500)"
          >5元</span
        >
      </div>
      <button class="btn btn-primary btn-recharge" @click="pay">充值</button>
      <p class="tip">
        点击充值即表示已阅读并同意<a class="protocol" href="javascript:;">充值协议</a>
      </p>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { payWallet } from '../api/auth'
export default {
  name: 'pay',
  data() {
    return {
      index: 1,
      money: ''
    }
  },
  methods: {
    choose(index) {
      this.index = index
    },
    async pay() {
      let _this = this
      if (this.money && !/^\d*$/g.test(this.money)) {
        alert('输入非法金额')
        return
      }
      /*  this.$http.get(API.payWallet,{
        params:{
          money:this.money*100 || this.index
        }
      }).then((response) => {
        let result = response.data;
        if(result.code == 0){
          let res = result.data;
          
        }
      }); */
      let params = {
        money: this.money * 100 || this.index
      }
      let [err, res] = await payWallet(params)
      if (err) {
        console.log(err)
        return
      }
      let payInfo = res.data
      // 支付
      wx.chooseWXPay({
        timestamp: payInfo.timeStamp,
        nonceStr: payInfo.nonceStr,
        package: payInfo.package,
        signType: payInfo.signType,
        paySign: payInfo.paySign,
        success: function(res) {
          if (res.errMsg == 'chooseWXPay:ok') {
            _this.$route.push('/index')
          } else if (res.errMsg == 'chooseWXPay:fail') {
            alert('支付取消')
          }
        }.bind(this),
        cancel: function() {
          alert('支付取消')
        }.bind(this),
        fail: function(res) {
          alert(res.message || '支付失败')
        }.bind(this)
      })
    }
  }
}
</script>
<style>
.recharge {
  background: #ffffff;
}
.recharge-box {
  padding: 0 0.3rem;
}
.recharge-box .title {
  font-size: 0.34rem;
  color: #333333;
  margin-top: 0.69rem;
}
.recharge-box .input-box {
  text-align: center;
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
}
.recharge-box .input-box .input {
  display: block;
  width: 6.9rem;
  height: 1rem;
  border: 1px solid #d7d7d7;
  border-radius: 5px;
  font-size: 0.3rem;
  color: #333333;
  text-align: center;
}
.item-num {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.31rem;
}
.item-num .num {
  height: 1.3rem;
  background-color: #f1f3f5;
  color: #333333;
  font-size: 0.32rem;
  width: 3.35rem;
  text-align: center;
  line-height: 1.3rem;
  border-radius: 0.08rem;
}
.item-num .num.checked {
  background-color: #ffebe8;
  color: #ff3418;
}
.recharge-box .btn-recharge {
  /*此处3.9改成3，保证一屏可以看到，因为距离太大了*/
  display: block;
  margin: 3rem auto 0.48rem;
  color: #ffffff;
  font-weight: 400;
  box-shadow: 0px 10px 18px 0px rgba(255, 106, 106, 0.57);
}
.recharge-box .tip {
  font-size: 0.28rem;
  color: #999999;
  text-align: center;
}
.recharge-box .tip .protocol {
  color: #ff3418;
}
</style>
