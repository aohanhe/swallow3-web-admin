import { Module, GetterTree, MutationTree, ActionTree } from 'vuex'
import Token from '@/libs/token'
import Users from '@/api/user'
/**
 * 用户信息的store类
 */
interface UserStore{
    userName?:string
    userId?:number
    avatorImgPath?:string
    token?:string
    access:string
}

class UserStoreModule implements Module<UserStore, any> {
    namespaced=true

    state:UserStore={
      userName: undefined,
      userId: undefined,
      avatorImgPath: undefined,
      token: Token.getToken(),
      access: ''
    }

    mutations:MutationTree<UserStore>={
      setAvator (state, avatorPath) {
        state.avatorImgPath = avatorPath
      },
      setUserId (state, id) {
        state.userId = id
      },
      setUserName (state, name) {
        state.userName = name
      },
      setAccess (state, access) {
        state.access = access
      },
      setToken (state, token) {
        state.token = token
        Token.setToken(token)
      }
    }

    actions: ActionTree<UserStore, any>={
      // 登录
      handleLogin ({ commit }, { userName, password }) {
        userName = userName.trim()

        return new Promise((resolve, reject) => {
          Users.login(userName, password)
            .then(res => {
              commit('setToken', res.token)
              resolve()
            }).catch(err => {
              reject(err)
            })
        })
      },
      // 退出登录
      handleLogOut ({ state, commit }) {
        let curstate = state as UserStore

        return new Promise((resolve, reject) => {
          Users.logout(curstate.token as string).then(() => {
            commit('setToken', '')
            commit('setAccess', [])
            resolve()
          }).catch(err => {
            reject(err)
          })
          // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
          // commit('setToken', '')
          // commit('setAccess', [])
          // resolve()
        })
      },
      // 获取用户相关信息
      getUserInfo ({ state, commit }) {
        return new Promise((resolve, reject) => {
          Users.getUserInfo(state.token as string).then(res => {
            commit('setAvator', res.avator)
            commit('setUserName', res.userName)
            commit('setUserId', res.userId)
            commit('setAccess', res.access)

            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      }
    }
}

export default new UserStoreModule()
