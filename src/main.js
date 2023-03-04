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
  // config.headers.Authorization = sessionStorage.getItem('token')
  config.headers.Authorization = localStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.prototype.msg = function(text, type) {
  this.$message({
    message: text,
    center: true,
    type: type,
    customClass: 'my-message'
  })
}
Vue.prototype.confirm = function(text, hander, type) {
  this.$confirm(text, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: type || 'waring'
  })
    .then(() => {
      if (hander) {
        hander()
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
          .catch(er => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          })
      }
    })
    .catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
}
Vue.prototype.loopFun = function(data) {
  if (data.children) {
    const item = data.children
    for (let index = 0; index < item.length; index++) {
      this.loopFun(item[index])
    }
  } else {
    this.selectTree.push(data.id)
  }
}
new Vue({
  router,
  render: h => h(App),
  mounted() {}
}).$mount('#app')
