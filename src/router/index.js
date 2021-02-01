import Vue from 'vue'
import VueRouter from 'vue-router'
// eslint-disable-next-line no-unused-vars
import Login from '../components/Login'
// home组件
import Home from '../components/Home'
// 欢迎组件
import Welcome from '../components/Welcome'
// 用户列表组件
import Users from '../components/user/Users'
// 权限列表组件
import Rights from '../components/power/rights'
// 用户角色组件
import Roles from '../components/power/roles'
// 商品管理商品分类组件
import Categories from '../components/goods/Categories'
// 商品管理分类参数组件
import Params from '../components/goods/Params'
// 商品列表组件
import Goods from '../components/goods/Goods'
// 商品添加组件
import GoodsAdd from '../components/goods/Add'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    // 进入home组件后重定向到welcome组件
    redirect: '/welcome',
    // 定义子路由
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: GoodsAdd }
    ]
  }

]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  var item = window.sessionStorage.getItem('token')
  if (to.path === '/login') {
    return next()
  } else if (!item) {
    return next('/login')
  }
  next()
})
export default router
