import axios, { AxiosRequestConfig } from 'axios'
import config from '@/config'

/**
 * 服务器请求
 */

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
const RESPONSE_SUCCESS:number = 0

/**
 * 分页服务回复
 */
export interface ResponseDataPager<T> {
    total:number
    items:Array<T>
}

/**
 * 服务器回复数据
 */
export interface ResponseData{
    code:number
    message?:string
    data?:any
}

/**
 * 分页数据结果
 */
export interface PagerResponseData<T> extends ResponseData{
  data?:ResponseDataPager<T>
}

/**
 * 服务器回复错误
 */
export interface ResponseError {
    code:number
    message:string
}

/**
 * 查询对象
 */
export interface Query<T>{
  query?:T
  page:number
  pageSize:number
  sorts:Array<string>
}

export default function request<T extends ResponseData> (req:AxiosRequestConfig) {
  return new Promise<T>((resolve, reject) => {
    let reqData=req

    // 根据环境变量取得服务地址
    let url=req.url as string

    url=url.startsWith('/')?baseUrl+url:baseUrl+'/'+url
    reqData.url=url

    console.log('向服务器发送数据请求:%o', reqData)

    // 向reqData中添加token数据

    axios.request(reqData)
      .then(response => {
        let resp:T=response.data

        console.log('收到服务回复的数据请求:%o', response)

        // 检查服务器返回的数据的code值是否正确
        if (resp.code) {
          if (resp.code===RESPONSE_SUCCESS) {
            resolve(resp)
          } else {
            // code 值不为成功，则通知错误
            let error:ResponseError={
              code: resp.code,
              message: resp.message?resp.message:''
            }
            reject(error)
          }
        } else {
          // 如果不带code值的返回则直接发送数据处理器
          resolve(response.data)
        }
      }).catch((resonse) => {
        console.error('收到服务回复的数据请求错误:%o', resonse)

        let error:ResponseError={
          code: resonse.code,
          message: resonse.message?resonse.message:''
        }
        reject(error)
      })
  })
}
