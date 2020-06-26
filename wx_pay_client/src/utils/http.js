import axios from 'axios'
import { storage, sessionStorage } from '@/utils/storage'
// import { Message } from 'element-ui'
//引入nprogress
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

import router from '../router/index'

// NProgress.inc(0.2)
// NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 5000, // 设置超时时间
  headers: { 'Content-Type': 'application/json; charset=utf-8' }
})

// http请求拦截器
service.interceptors.request.use(
  config => {
    // NProgress.start()
    config.headers['Authorization'] = sessionStorage.get('token')
    config.contentType && (config.headers['Content-Type'] = config.contentType)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
//http 200 状态码下的异常map
const erorrMap = {
  0: '请求成功',
  200: '请求成功',
  201: '创建成功',
  204: '删除成功',
  400: '请求的地址不存在或者包含不支持的参数',
  401: '未授权',
  403: '被禁止访问',
  404: '请求的资源不存在',
  422: '[POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误',
  500: '内部错误'
}
// http响应拦截器
service.interceptors.response.use(
  res => {
    // NProgress.done()
    //可以根据后端的系统而相应的做调整
    // console.log(res.data)
    if (res.data.code == 0) {
      return res.data
    }
    return Promise.reject(res.data)
  },
  async error => {
    if (error.request) {
      if (error.request.status === 0) {
        //超时
      }
    } else if (error.response) {
      if (error.response.status === 400) {
        //请求参数有问题
        // Message.error(error)
      } else if (error.response.status === 404) {
        //未找到资源
        console.log('未找到资源')
      } else if (error.response.status === 401) {
        //请先登录
        console.log('请先登录')
      } else if (error.response.status === 500) {
        //服务器异常
        console.log('服务器异常')
      }
    }
    return Promise.reject(error)
  }
)

export default service
