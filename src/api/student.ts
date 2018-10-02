import request, { ResponseData, PagerResponseData, Query } from '@/libs/request'
/**
 * 演示用的学生访问Api
 */
export interface StudentInfo {
    id?: number
    name?: string
    age?: number
    score?: number
    phone?: string
    city?: string
}

/**
 * 学生分页结果
 */
export interface StudentPager extends PagerResponseData<StudentInfo>{
}

/**
 * 取得学生的查询结果
 */
export default class Student {
  static fecthList (query:Query<StudentInfo>):Promise<StudentPager> {
    return request<StudentPager>({
      url: '/student/list',
      method: 'get',
      data: query
    })
  }
}
