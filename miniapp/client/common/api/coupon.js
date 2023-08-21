import { request } from '../js/reques'

/**
 * 初酱券数量
 */
export const getMyCouponNum = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/coupon/count',
    method: 'GET',
    params
  })
}

/**
 * 初酱券列表
 */
export const getMyCouponList = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/coupon/page',
    method: 'GET',
    params
  })
}