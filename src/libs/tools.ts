import { RouteConfig } from 'vue-router'
import RouteRight from './route_right'

export default class Tools {
  /**
     * 判断目标数组中是否有要检查数据中的任意一个值
     * @param targetarr
     * @param arr
     */
  static hasOneOf<T> (targetarr:Array<T>, arr:Array<T>):boolean {
    return targetarr.some(item => arr.indexOf(item)>-1)
  }

  /**
   * 取得homeRoute节点
   * @param routers
   */
  static getHomeRoute (routers:Array<RouteConfig>):RouteConfig|undefined {
    let i = -1
    let len = routers.length
    let homeRoute:RouteConfig|undefined
    while (++i < len) {
      let item = routers[i]

      if (item.children && item.children.length) {
        let res = Tools.getHomeRoute(item.children)
        if (res) return res
      } else {
        if (item.name === 'home') homeRoute = item
      }
    }
    return homeRoute
  }

  /**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
  static getNextRoute (list:any, route:any) {
    let res:RouteConfig|undefined
    if (list.length === 2) {
      res = Tools.getHomeRoute(list)
    } else {
      const index = list.findIndex((item:any) => RouteRight.routeEqual(item, route))
      if (index === list.length - 1) res = list[list.length - 2]
      else res = list[index + 1]
    }
    return res
  }
}
