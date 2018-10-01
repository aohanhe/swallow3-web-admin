import tools from '@/libs/tools'
import { RouteConfig } from 'vue-router'
import { objEqual, doCustomTimes } from '@/libs/common-tools.js'

/**
 * 权限处理模块
 */
export default class RouteRight {
  /**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 * 如果节点是没有配置meta的access则是充许访问
 */
  private static hasAccess (access:Array<string>, route:RouteConfig):boolean {
    if (route.meta && route.meta.access) return tools.hasOneOf(access, route.meta.access)
    else return true
  }

  /**
   * 权鉴
   * @param {*} name 即将跳转的路由name
   * @param {*} access 用户权限数组
   * @param {*} routes 路由列表
   * @description 用户是否可跳转到该页
   */
  private static routePermissionJudge (name:string, access:Array<string>, routes:Array<RouteConfig>):boolean {
    return routes.some((route) => {
      if (route.children&&route.children.length) {
        return RouteRight.routePermissionJudge(name, access, route.children)
      } else if (route.name===name) {
        return RouteRight.hasAccess(access, route)
      }
      return false
    })
  }

  /**
   * 检查当前用户是否有权限打开route
   * @param name
   * @param access
   * @param routes
   */
  public static canTurnTo (name:string|undefined, access:Array<string>, routes:Array<RouteConfig>):boolean {
    if (!name) { return true }
    return RouteRight.routePermissionJudge(name, access, routes)
  }

  /**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
  static routeEqual (route1:any, route2:any):boolean {
    const params1 = route1.params || {}
    const params2 = route2.params || {}
    const query1 = route1.query || {}
    const query2 = route2.query || {}
    return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
  }

  /**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
  static routeHasExist (tagNavList:any, routeItem:any):boolean {
    let len = tagNavList.length
    let res = false
    doCustomTimes(len, (index:number) => {
      if (RouteRight.routeEqual(tagNavList[index], routeItem)) res = true
    })
    return res
  }
}
