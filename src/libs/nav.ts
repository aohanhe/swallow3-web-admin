import { RouteConfig } from 'vue-router'

/**
 * 本地标签导航辅助类
 */
export class TagNavItem {
    name:string
    path:string
    meta?:any

    constructor (name:string, path:string) {
      this.name=name
      this.path=path
    }
}

export default class TagNav {
  /**
 * @description 本地存储和获取标签导航列表
 */
  static setTagNavListInLocalstorage (list:Array<TagNavItem>) {
    localStorage.tagNaveList = JSON.stringify(list)
  }
  /**
   * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
   */
  static getTagNavListFromLocalstorage ():Array<TagNavItem> {
    const list = localStorage.tagNaveList
    return list ? JSON.parse(list) : []
  }

  /**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
  static routeHasExist (tagNavList:Array<TagNavItem>, addItem:TagNavItem):boolean {
    let len = tagNavList.length

    for (let i=0; i<len; i++) {
      let item=tagNavList[i]
      if (item.path===addItem.path&&item.name===addItem.name) { return true }
    }

    return false
  }

  static showTitle (item:TagNavItem, vm:any):string {
    return vm.prototype.$config.useI18n ? vm.prototype.$t(item.name) : ((item.meta && item.meta.title) || item.name)
  }

  /**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
  static getNewTagList (list:any, newRoute:any) {
    const { name, path, meta } = newRoute
    let newList = [...list]
    if (newList.findIndex(item => item.name === name) >= 0) return newList
    else newList.push({ name, path, meta })
    return newList
  }
}
