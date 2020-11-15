import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'


// 导入NproGress 包对应的js和css
import NproGress from 'nprogress'

import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// 通过axios请求拦截器添加token，保证拥有获取数据的权限。
// axios请求拦截
// 在request 拦截器中 展示进度条条  NproGress.start()
axios.interceptors.request.use(config => {
  // console.log("token="+window.sessionStorage.getItem('token'));
  // console.log(config);
  // 为请求头对象，添加Token验证的Authorization字段
  NproGress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须renturn config
  return config
})

// 在response 拦截器中, 隐藏进度条 NproGress.done()
axios.interceptors.response.use(config => {
  NproGress.done()
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
