import { request } from '../js/reques'

/**
 * 创建抽赏订单
 */
export const createRewardOrder = (cloud, params) => {
  return request(cloud, {
    path: `/wx/order/reward/createOrder`,
    method: 'POST',
    params
  })
}

/**
 * 创建积分支付订单
 */
export const createPointRewardOrder = (cloud, params) => {
  return request(cloud, {
    path: `/wx/order/reward/createPointOrder`,
    method: 'POST',
    params
  })
}

/**
 * 支付订单
 */
export const payOrder = (cloud, params) => {
  return request(cloud, {
    path: `/wx/order/reward/payOrder`,
    method: 'POST',
    params
  })
}

/**
 * 关闭订单
 */
export const closeOrder = (cloud, params) => {
  return request(cloud, {
    path: `/wx/order/close`,
    method: 'POST',
    params
  })
}
