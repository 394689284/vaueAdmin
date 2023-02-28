import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
Vue.use(Element)
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.prototype.$msg = function(text, type) {
  this.$message({
    message: text,
    center: true,
    type: type,
    customClass: 'my-message'
  })
}
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
