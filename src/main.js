// 入口函数
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入登录表单图标
import './assets/fonts/iconfont.css'
// 导入第三方treeTable
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios请求拦截（请求预处理）
axios.interceptors.request.use((config) => {
  // console.log(config)
  // 为请求头对象，添加 Token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
// 全局注册treeTable
Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为全局组件
Vue.use(VueQuillEditor)
// 注册一个全局的时间过滤器
Vue.filter('dateFormat', function (originVal) {
  const ov = new Date(originVal)
  // padStart 不足2位前面用 0 补上
  const y = ov.getFullYear()
  const m = (ov.getMonth() + 1 + '').padStart(2, '0')
  const d = (ov.getDate() + '').padStart(2, '0')
  const hh = (ov.getHours() + '').padStart(2, '0')
  const mm = (ov.getMinutes() + '').padStart(2, '0')
  const ss = (ov.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
