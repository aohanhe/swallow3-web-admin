
import request, { ResponseData } from '@/libs/request'
import config from '@/config'

// 当前是否与服务器联调
const isDebugLocal:boolean = (process.env.NODE_ENV === 'development' && !config.isConnectDebugSever)

export interface UserLoginResponse extends ResponseData{
  token:string
}

export interface UserInfoResponse extends ResponseData{
  avator?:string
  userName:string
  userId:number
  access:[]

}

/**
 * 用户信息api 用于进行用户认证等操作
 */
export default class Users {
  static login (userName:string, password:string):Promise<UserLoginResponse> {
    const data = {
      userName,
      password
    }

    // 如果处理本地开发模式，则返回成功
    if (isDebugLocal) {
      return new Promise<UserLoginResponse>((resolve, reject) => {
        let resp:UserLoginResponse={
          token: 'ddddddddd',
          code: 0,
          data: {
          }
        }
        resolve(resp)
      })
    } else {
      // 否则处理为远程数据请求处理
      return request<UserLoginResponse>({
        url: 'login',
        data,
        method: 'post'
      })
    }
  }

  static getUserInfo (token:string):Promise<UserInfoResponse> {
    // 如果处理本地开发模式，则返回成功
    if (isDebugLocal) {
      return new Promise<UserInfoResponse>((resolve, reject) => {
        let resp:UserInfoResponse={
          userId: 1,
          userName: 'admin',
          avator: undefined,
          code: 0,
          data: {},
          access: []
        }
        resolve(resp)
      })
    } else {
      // 如果处理本地开发模式，则返回成功
      return request<UserInfoResponse>({
        url: 'get_info',
        params: {
          token
        },
        method: 'get'
      })
    }
  }

  static logout (token:string):Promise<ResponseData> {
    if (isDebugLocal) {
      return new Promise<ResponseData>((resolve, reject) => {
        let resp:ResponseData={
          code: 0,
          message: '',
          data: {}
        }
        resolve(resp)
      })
    } else {
      return request({
        url: 'logout',
        method: 'post'
      })
    }
  }
}
