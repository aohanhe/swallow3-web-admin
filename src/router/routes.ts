import { RouteConfig } from 'vue-router'
// import Main from '@/views/main'

/**
 * 系统的路由配置清单
 */
let Main = () => import('@/views/main')

let routers:Array<RouteConfig>=[
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/views/login/login.vue')
  },

  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true
        },
        component: () => import('@/views/single-page/home')
      }
    ]
  },

  // 以下为显示在用户界面的菜单路由
  {
    path: '/components',
    name: 'components',
    meta: {
      icon: 'logo-buffer',
      title: '标准界面演示'
    },
    component: Main,
    children: [
      {
        path: 'tables',
        name: 'tables',
        meta: {
          icon: 'md-trending-up',
          title: '标准表格'
        },
        component: () => import('@/views/components/tables/tables.vue')
      },
      {
        path: 'tables2',
        name: 'tables2',
        meta: {
          icon: 'md-trending-up',
          title: '标准表格2'
        },
        component: () => import('@/views/tablepage-demo/tablepage-demo.vue')
      }
    ]
  },

  // 以下为不在菜单中显示的路由
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/views/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/views/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/views/error-page/404.vue')
  }
]

export default routers
