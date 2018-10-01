import { Module, GetterTree, MutationTree } from 'vuex'
import routers from '@/router/routes.ts'
import Tools from '@/libs/tools'
import { RouteConfig } from 'vue-router'
import { MenuItem, Menu } from '@/libs/menu'
import { BreadCrumbList } from '@/libs/bread_crumbList'
import TagNav from '@/libs/nav'

interface AppState{
    breadCrumbList:Array<any>
    tagNavList: Array<any>
    homeRoute?:RouteConfig
    local:string
}

/**
 * 整体app的store模块
 */
class AppModule implements Module<AppState, any> {
    namespaced=true

    state:AppState={
      breadCrumbList: [],
      tagNavList: [],
      homeRoute: Tools.getHomeRoute(routers),
      local: ''
    }

    getters: GetterTree<AppState, any>={
      menuList (state, getters, rootState):Array<MenuItem> {
        return Menu.getMenuByRouter(routers, [])
      }
    }

    mutations: MutationTree<AppState>={
      // 设置面包屑
      setBreadCrumb (state, routeMetched) {
        let home=state.homeRoute as RouteConfig
        state.breadCrumbList = BreadCrumbList.getBreadCrumbList(routeMetched, home)
      },

      // 设置导航列表
      setTagNavList (state, list) {
        if (list) {
          state.tagNavList = [...list]
          TagNav.setTagNavListInLocalstorage([...list])
        } else state.tagNavList = TagNav.getTagNavListFromLocalstorage()
      },

      // 设置单个导航
      addTag (state, { route, type = 'unshift' }) {
        // 这里没有搞清楚做什么的还有bug
        if (!TagNav.routeHasExist(state.tagNavList, route)) {
          if (type === 'push') state.tagNavList.push(route)
          else {
            if (route.name === 'home') state.tagNavList.unshift(route)
            else state.tagNavList.splice(1, 0, route)
          }
          TagNav.setTagNavListInLocalstorage([...state.tagNavList])
        }
      },

      // 设置语言
      setLocal (state, lang) {
        state.local = lang
      }
    }
}

export default new AppModule()
