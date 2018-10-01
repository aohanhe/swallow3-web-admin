import store from './index'
import { UserLoginResponse, UserInfoResponse } from '@/api/user'
/**
 * store 的dispatcher方法，以方便对store的action方法进行访问
 */
export function dispatchHandleLogin (data:any):Promise<UserLoginResponse> {
  return store.dispatch('user/handleLogin', data)
}

export function dispatchHandleLogOut ():Promise<any> {
  return store.dispatch('user/handleLogOut')
}

export function dispatchGetUserInfo ():Promise<UserInfoResponse> {
  return store.dispatch('user/getUserInfo')
}
