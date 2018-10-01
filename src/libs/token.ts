import Cookies from 'js-cookie'
import config from '../config'
/**
 * token工具
 */
const TOKEN_KEY:string = 'token'

export default class Token {
  /**
     * 设置当前的token
     * @param token
     */
  static setToken (token:string) {
    Cookies.set(TOKEN_KEY, token, { expires: config.cookieExpires || 1 })
  }

  /**
   * 取得当前的token
   */
  static getToken ():string|undefined {
    const token = Cookies.get(TOKEN_KEY)
    if (token) return token
    else return undefined
  }
}
