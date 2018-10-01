import { RouteConfig } from 'vue-router'

/**
 * 系统面包屑辅助类
 */

export interface BreadCrumbItem {
    icon:string
    name?:string
    to?:string
    meta?:any
}

export class BreadCrumbList {
  /**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
  static getBreadCrumbList (routeMetched:Array<RouteConfig>, homeRoute:RouteConfig) {
    let res = routeMetched.filter(item => {
      return item.meta === undefined || !item.meta.hide
    }).map(item => {
      let obj:BreadCrumbItem = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      return obj
    })
    res = res.filter(item => {
      return !item.meta.hideInMenu
    })

    let reData:Array<BreadCrumbItem>=[{
      icon: '',
      name: homeRoute.name,
      to: homeRoute.path
    }]

    // 把取得的所有对象插入到返回值中
    reData.push(...res)

    return reData
  }

  /**
   * 显示的标题
   * @param item
   * @param vm
   */
  static showTitle (item:BreadCrumbItem, vm:any):string {
    return vm.prototype.$config.useI18n ? vm.prototype.$t(item.name) : ((item.meta && item.meta.title) || item.name)
  }
}
