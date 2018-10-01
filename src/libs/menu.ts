import { RouteConfig } from 'vue-router'
import Tool from './tools'

/**
 * 系统菜单辅助工具
 */

export class MenuItem {
    icon:string = ''
    name?:string
    meta:any
    href?:string
    children?:Array<MenuItem>

    constructor (name:string) {
      this.name = name
    }
}

export class Menu {
  /**
   * 检查route项下是否有子节点
   * @param item
   */
  static hasChild (item:RouteConfig) {
    return item.children && item.children.length !== 0
  }

  /**
   * 是否要显示这个路由在菜单中
   * @param item
   * @param access
   */
  static showThisMenuEle (item:RouteConfig, access:Array<string>) {
    if (item.meta && item.meta.access && item.meta.access.length) {
      if (Tool.hasOneOf(item.meta.access, access)) return true
      else return false
    } else return true
  }

  /**
   * 取得router中的菜单列表
   */
  static getMenuByRouter (routers:Array<RouteConfig>, access:Array<string>) {
    let res:Array<MenuItem>=[]

    routers.forEach((item) => {
      if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
        let obj:MenuItem =
        {
          icon: (item.meta && item.meta.icon) ? item.meta.icon: '',
          name: item.name,
          meta: item.meta
        }
        if ((Menu.hasChild(item) || (item.meta && item.meta.showAlways)) && Menu.showThisMenuEle(item, access)) {
          let childrens=item.children as Array<RouteConfig>
          obj.children = Menu.getMenuByRouter(childrens, access)
        }
        if (item.meta && item.meta.href) obj.href = item.meta.href
        if (Menu.showThisMenuEle(item, access)) res.push(obj)
      }
    })

    return res
  }

  /**
   * 向上查找带有tag值的节点，会根据tag值的首字母大字进行转换后查找
   * @param ele
   * @param tag
   */
  static findNodeUpper (ele:Element, tag:string):Element|undefined {
    if (ele.parentNode) {
      let parentNode = ele.parentNode as Element
      if (parentNode.tagName === tag.toUpperCase()) {
        return parentNode
      } else {
        return Menu.findNodeUpper(parentNode, tag)
      }
    }
    return undefined
  }

  /**
   * 向上查找带有class参数的节点
   * @param ele
   * @param classes
   */
  static findNodeUpperByClasses (ele:Element, classes:Array<string>):Element|undefined {
    let parentNode = ele.parentNode as Element

    if (parentNode) {
      let classList = parentNode.classList
      if (classList && classes.every(className => classList.contains(className))) {
        return parentNode
      } else {
        return Menu.findNodeUpperByClasses(parentNode, classes)
      }
    }
    return undefined
  }

  /**
   * 向下查找节点带有tag的节点
   * @param ele
   * @param tag
   */
  static findNodeDownward (ele:Element, tag:string):Element|undefined {
    const tagName = tag.toUpperCase()
    if (ele.childNodes.length) {
      let i = -1
      let len = ele.childNodes.length
      while (++i < len) {
        let child = ele.childNodes[i] as Element
        if (child.tagName === tagName) return child
        else return Menu.findNodeDownward(child, tag)
      }
    }
  }

  /**
   * 是否有权限显示
   * @param access
   * @param canViewAccess
   */
  static showByAccess (access:Array<string>, canViewAccess:Array<string>):boolean {
    return Tool.hasOneOf(canViewAccess, access)
  }
}
