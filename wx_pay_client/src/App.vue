<template>
  <div id="app">
    <router-view />
    <div id="container" style="width:100%; height:600px"></div>
  </div>
</template>

<script>
import { wechatRedirect, wechatConfig, getLocation } from '@/api/auth'
import { jsApiList } from '@/utils/jsApiList'
import wx from 'weixin-js-sdk'
import { initShareInfo } from '@/utils/wx'
import maps from 'qqmap'
export default {
  data() {
    return {
      //腾讯地图
      map: null,
      getAddress: null,
      getAddCode: null,
      addressKeyword: '',
      shopInfo: {}
    }
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
        this.getWechatConfig()
      }
    },
    // 获取微信配置信息
    async getWechatConfig() {
      let [err, res] = await wechatConfig(location.href.split('#')[0])
      if (err) {
        console.log('configErr:', err)
        // return this.$message.error(err.message || '获取微信配置失败')
      }
      // console.log(res)
      let data = res.data
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: jsApiList // 必填，需要使用的JS接口列表
      })
      wx.ready(() => {
        initShareInfo(wx)
        // this.openLocation()
      })
      // this.$message.success(res.message || '获取成功')
      wx.error(function(err) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log(err)
      })
    },
    openLocation() {
      // this.qqMapGeolocation()
      wx.getLocation({
        type: 'wgs84', // 默认为'wgs84'的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: res => {
          console.log(res)
          var latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
          var longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
          var speed = res.speed // 速度，以米/每秒计
          var accuracy = res.accuracy // 位置精度
          console.log(`jssdk经纬度：纬度-${latitude},经度-${longitude},误差范围-${accuracy}`)

          /* wx.openLocation({
            latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
            longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
            name: '', // 位置名
            address: '', // 地址详情说明
            scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
          }) */
          // { lng: 115.48525, lat: 38.87317 }
          // latitude = '38.878486'
          // longitude = '115.465087'
          // this.getCuttentLoaction(latitude, longitude)
          // this.qqMapConvertor(latitude, longitude)
          // this.init(latitude, longitude)
        }
      })
    },
    qqMapConvertor(lat, lng) {
      // translate(points:LatLng | Point | Array.<LatLng> | Array.<Point>, type:Number, callback:Function)
      qq.maps.convertor.translate(new qq.maps.LatLng(lat, lng), 1, function(res) {
        console.log(res)
        //取出经纬度并且赋值
        let latlng = res[0]
        var map = new qq.maps.Map(document.getElementById('container'), {
          center: latlng,
          zoom: 13
        })
        //设置marker标记
        var marker = new qq.maps.Marker({
          map: map,
          position: latlng
        })
        //这个是点击弹框的基本设置
        var infoWin = new qq.maps.InfoWindow({
          map: map
        })
      })
    },
    qqMapGeolocation() {
      let that = this
      var geolocation = new qq.maps.Geolocation(
        '3NOBZ-YNLK6-AZHS5-EWI5D-OXS26-OWF4A',
        '达达-移动端'
      )
      geolocation.getIpLocation(showPosition, showErr)
      // geolocation.getLocation(showPosition, showErr) //或者用getLocation精确度比较高
      function showPosition(position) {
        console.log('腾讯地图获取当前位置')
        console.log(position)
        // this.latitude = position.lat
        // this.longitude = position.lng
        // this.city = position.city
        // this.setMap()
        // position.lat = '338.87317'
        // position.lng = '115.48525'
        // { lng: 115.48525, lat: 38.87317 }
        // that.init(position.lat, position.lng)
        // that.getCuttentLoaction(position.lat, position.lng)
      }
      function showErr() {
        console.log('定位失败')
        this.qqMapGeolocation() //定位失败再请求定位，测试使用
      }
    },
    //初始化地图
    init(latitude, longitude) {
      var that = this
      maps.init('3NOBZ-YNLK6-AZHS5-EWI5D-OXS26-OWF4A', () => {
        var myLatlng = new qq.maps.LatLng(latitude, longitude)
        console.log(myLatlng)

        var myOptions = {
          zoom: 16,
          center: myLatlng,
          mapTypeId: qq.maps.MapTypeId.ROADMAP
        }
        that.map = new qq.maps.Map(document.getElementById('container'), myOptions)
        console.log(that.map)

        //给定位的位置添加图片标注
        var marker = new qq.maps.Marker({
          position: myLatlng,
          map: that.map
        })
        //给定位的位置添加文本标注
        var marker = new qq.maps.Label({
          position: myLatlng,
          map: that.map,
          content: `误差范围${this.accuracy}`
        })
        /* //获取点击后的地址
        qq.maps.event.addListener(that.map, 'click', function(event) {
          // 获取点击后的地图坐标
          that.shopInfo.lng = event.latLng.getLng()
          that.shopInfo.lat = event.latLng.getLat()
          that.getAddressCode()
        })

        //调用地址显示地图位置并设置地址
        that.getAddress = new qq.maps.Geocoder({
          complete: function(result) {
            that.map.setCenter(result.detail.location)
            console.log(result)

            console.log(result.detail.location)
            that.shopInfo.lng = result.detail.location.lng
            that.shopInfo.lat = result.detail.location.lat
            var marker = new qq.maps.Marker({
              map: that.map,
              position: result.detail.location
            })
          }
        })
        console.log(that.getAddress)

        //通过坐标来显示地图地址
        that.getAddCode = new qq.maps.Geocoder({
          complete: function(result) {
            that.addressKeyword = result.detail.address
          }
        })
        console.log(that.getAddCodes) */
      })
    },
    //通过地址获得位置
    getAddressKeyword() {
      //通过getLocation();方法获取位置信息值
      this.getAddress.getLocation(this.addressKeyword)
      // 调用自带的接口
    },
    // 通过坐标获得地址
    getAddressCode() {
      try {
        var lat = parseFloat(this.shopInfo.lat)
        var lng = parseFloat(this.shopInfo.lng)
        var latLng = new qq.maps.LatLng(lat, lng)
        console.log(latLng)

        //调用获取位置方法
        this.getAddCode.getAddress(latLng)
      } catch (error) {
        console.log(error)
      }
    },
    // 获取 当前位置
    async getCuttentLoaction(latitude, longitude) {
      let [err, res] = await getLocation({ latitude, longitude })
      if (err) {
        console.log(err)
        return
      }
      // console.log(res)
      let location = res.data.result.location
      let address = res.data.result.address
      console.log(`转换后的经纬度：纬度-${location.lat},经度-${location.lng}`)
      console.log(address)
      // this.init(location.lat, location.lng)
      this.init(38.87317, 115.48525)
    },
    // 距离计算
    getDistance(latitude, longitude) {
      var e = new qq.maps.LatLng(latitude, longitude) //括号里是 目标打卡点的纬度经度
      var f = new qq.maps.LatLng(latitude, longitude) //用户当前位置的纬度经度；
      var distance = parseInt(qq.maps.geometry.spherical.computeDistanceBetween(e, f)) //此时此刻 计算出的 distance，即为两点间的直线距离
      if (distance <= 50) {
        alert('打卡成功了')
      } else if (distance > 50) {
        alert('距离打卡点超过五十米，打卡失败')
      } else {
        alert('出错了')
      }
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
