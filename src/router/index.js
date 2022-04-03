import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login.vue'
import Home from '../views/Home.vue'
import Users from '../components/user/Users.vue'
import Welcome from '../components/Welcome.vue'
Vue.use(VueRouter)

const routes = [
  // 重定向
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    // 重定向
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome},
      { path: '/users', component: Users }
    ]
  },
]

const router = new VueRouter({
  routes
})
// 路由守卫，如果没有token，强制跳转回登录页面，
router.beforeEach((to,from,next) => {
  // 如果访问的是登录页面就放行
  if(to.path === '/login') return next()
  // 如果访问其他页面，需要看看是否含有token，有token放行，没有强制回到登录页面
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果token不存在，返回登录页面
  if (!tokenStr) {
    return next('/login')
  }
  next()

}) 



export default router
