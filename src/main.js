import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式
import './assets/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// 导入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
// 设置请求头携带token
axios.interceptors.request.use(config => {

  // 取到token,并设置为请求头
    config.headers.Authorization = window.sessionStorage.getItem('token')
  

  return config
})


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
