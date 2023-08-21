import { request } from '../js/reques'

/**
 * 获取地址列表
 */
export const fetchAddressList = (cloud, params) => {
  return request(cloud, {
    path: `/wx/address/page`,
    method: 'POST',
    params
  })
}

/**
 * 支付快递费用
 */
export const payDelivery = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/bag/pay/delivery`,
    method: 'POST',
    params
  })
}

/**
 * 支付快递费用：明信片
 */
export const payDeliveryByPostcard = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/postcard/subtractPostageNumber`,
    method: 'POST',
    params
  })
}

/**
 * 申请发货
 */
export const applyDelivery = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/bag/apply/delivery`,
    method: 'POST',
    params
  })
}

/**
 * 云仓发货赏品
 */
export const retrieveAward = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/bag/retrieve`,
    method: 'POST',
    params
  })
}

/**
 * 发布我的赏品
 */
export const sellAward = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/bag/sell/market`,
    method: 'POST',
    params
  })
}

/**
 * 获取我拥有的赏品
 */
export const getMyAwardList = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/bag/list`,
    method: 'POST',
    params
  })
}

/**
 * 获取我拥有的赏品IP
 */
export const getMyIpList = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/bag/page`,
    method: 'POST',
    params
  })
}

/**
 * 查询云仓发货赏品价格
 */
export const getRecoveryPrice = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/bag/calculate/retrieve/price`,
    method: 'POST',
    params
  })
}

/**
 * 物品解锁
 */
export const unlockReward = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/bag/unlockReward`,
    method: 'POST',
    params
  })
}

/**
 * 物品上锁
 */
export const lockReward = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/bag/lockReward`,
    method: 'POST',
    params
  })
}