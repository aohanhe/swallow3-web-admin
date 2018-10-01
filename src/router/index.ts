import Vue from 'vue'
import Router from 'vue-router'
import RouteRight from '@/libs/route_right'
import Token from '@/libs/token'
import routes from './routes'
import { dispatchGetUserInfo } from '@/store/dispatcher'

Vue.use(Router)

let router = new Router({
  routes
})

const LOGIN_PAGE_NAME = 'login'

router.beforeEach((to, from, next) => {
  Vue.prototype.$Loading.start()

  const token = Token.getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: 'home' // 跳转到home页
    })
  } else {
    dispatchGetUserInfo().then(user => {
      // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
      if (RouteRight.canTurnTo(to.name, user.access, routes)) next() // 有权限，可访问
      else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
    })
  }
})

router.afterEach((to, from) => {
  Vue.prototype.$Loading.finish()
})

export default router
