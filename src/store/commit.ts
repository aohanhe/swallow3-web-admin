import store from './index'

/**
 * store 快捷访问工具
 */
export default class Commit {
  static setBreadCrumb (routeMetched:any) {
    store.commit('app/setBreadCrumb', routeMetched)
  }
  static setTagNavList (list:any) {
    store.commit('app/setTagNavList', list)
  }
  static addTag (route:any) {
    store.commit('app/addTag', route)
  }
  static setLocal (lang:string) {
    store.commit('app/setLocal', lang)
  }
}
