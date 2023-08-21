import { request } from '../js/reques'

/**
 * 用户登陆
 */
export const userLogin = (cloud, params) => {
  return request(cloud, {
    path: '/wx/user/taobao/login',
    method: 'POST',
    params
  })
}

/**
 * 用户详情
 */
export const userDetail = (cloud) => {
  return request(cloud, {
    path: '/wx/user/detail',
    method: 'GET',
  })
}

/**
 * 获取用户积分明细
 */
export const userPoint = (cloud, params) => {
  return request(cloud, {
    path: '/wx/account/point/record/page',
    method: 'POST',
    params
  })
}

/**
 * 获取收藏列表
 */
export const collectList = (cloud, params) => {
  return request(cloud, {
    path: '/wx/collect/page',
    method: 'POST',
    params
  })
}

/**
* 收藏
*/
export const onCollect = (cloud, params) => {
  return request(cloud, {
    path: '/wx/collect',
    method: 'POST',
    params
  })
}
// 移除收藏
export const removeCollect = (cloud, params) => {
  return request(cloud, {
    path: '/wx/collect/remove',
    method: 'POST',
    params
  })
}

// 收藏状态
export const statusCollect = (cloud, params) => {
  return request(cloud, {
    path: '/wx/collect/status',
    method: 'POST',
    params
  })
}


/**
 * 删除收藏
 */
export const delCollect = (cloud, params) => {
  return request(cloud, {
    path: '/wx/collect/remove',
    method: 'POST',
    params
  })
}

/**
 * 获取寄卖记录
 */
export const retrieveList = (cloud, params) => {
  return request(cloud, {
    path: '/wx/retrieve/page',
    method: 'GET',
    params
  })
}

/**
 * 获取发货记录
 */
export const getDeliveryRecord = (cloud, params) => {
  return request(cloud, {
    path: '/wx/delivery/page',
    method: 'POST',
    params
  })
}

/**
 * 获取用户明信片
 */
export const postcardList = (cloud, params) => {
  return request(cloud, {
    path: '/wx/postcard/page',
    method: 'POST',
    params
  })
}

/**
 * 返回支持积分兑换的明信片/券
 */
export const pointPostcardList = (cloud, params) => {
  return request(cloud, {
    path: '/wx/member/point/exchange/list',
    method: 'POST',
    params
  })
}

/**
 * 积分兑换明信片-废
 */
export const postcardExchange = (cloud, params) => {
  return request(cloud, {
    path: '/wx/postcard/exchange',
    method: 'POST',
    params
  })
}

/**
 * 获取用户返利信息
 */
// export const userRebateInfo = (cloud) => {
//   return request(cloud, {
//     path: '/wx/account/rebate/detail',
//     method: 'POST'
//   })
// }

/**
 * 获取用户返利二维码
 */
export const userRebateQRcode = (cloud, params) => {
  return request(cloud, {
    path: '/wx/user/getQrcode',
    method: 'GET',
    params
  })
}

/**
 * 小程序短链接
 */
export const userShortUrl = (cloud) => {
  return request(cloud, {
    path: '/wx/user/shortUrl',
    method: 'POST'
  })
}

/**
 * 获取支付管理数据
 */
export const userPayMent = (cloud, params) => {
  return request(cloud, {
    path: '/wx/payment/page',
    method: 'POST',
    params
  })
}

/**
 * 获取支付管理数据新增/修改
 */
export const userPayMentSave = (cloud, params) => {
  return request(cloud, {
    path: '/wx/payment/saveOrUpdate',
    method: 'POST',
    params
  })
}

/**
 * 获取支付管理数据删除
 */
export const userPayMentDel = (cloud, params) => {
  return request(cloud, {
    path: '/wx/payment/remove',
    method: 'GET',
    params
  })
}

/**
 * 获取邮费明信片数量
 */
export const postageNumer = (cloud) => {
  return request(cloud, {
    path: '/wx/postcard/getPostageNumber',
    method: 'GET',
  })
}

/**
 * 扣除邮费明信片数量
 */
export const subtractpostageNumer = (cloud) => {
  return request(cloud, {
    path: '/wx/postcard/subtractPostageNumber',
    method: 'POST',
  })
}

/**
 * 更新用户手机号
 * @param {} 
 */
export const updateUserPhone = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/user/update/user/info/phone',
    method: 'POST',
    params
  })
}

/**
 * 获取积分兑换列表
 * @param {} 
 */
export const getPoints = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/member/point/exchange/list',
    method: 'POST',
    params
  })
}

/**
 * 积分兑换-减免券
 * @param {} 
 */
export const pointExchange = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/member/point/exchange',
    method: 'POST',
    params
  })
}

/**
 * 积分兑换-明信片
 * @param {} 
 */
export const pointExchangePostcard = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/member/point/exchange/postcard',
    method: 'POST',
    params
  })
}

/**
 * 获取云仓记录
 */
export const getRecoverRecord = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/retrieve/page',
    method: 'GET',
    params
  })
}

/**
 * 获取微信消费记录明细
 * @param {} 
 */
export const getCostRecord = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/account/wechat/pay/record/page',
    method: 'POST',
    params
  })
}

/**
 * 获取金币记录
 */
export const getCoinRecord = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/coin/page',
    method: 'POST',
    params
  })
}

/**
 * 领取升级奖励
 * @param {} 
 */
export const receiveLevelPrize = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/member/level/receive',
    method: 'POST',
    params
  })
}

/**
 * 获取会员详情
 * @param {} 
 */
export const getMemberDetail = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/member/level/detail',
    method: 'POST',
    params
  })
}

/**
 * 获取会员列表
 * @param {} 
 */
export const getMemberList = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/member/card/list',
    method: 'POST',
    params
  })
}

/**
 * 会员卡购买
 * @param {} 
 */
export const buyMember = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/member/card/shop',
    method: 'POST',
    params
  })
}

/**
 * 领取会员卡奖励
 * @param {} 
 */
export const receiveCardPrize = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/member/card/receive',
    method: 'POST',
    params
  })
}

/**
 * 获取消息列表
 * @param {*} data 
 */
export const getMessage = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/message/page',
    method: 'POST',
    params
  })
}

/**
 * 未读消息数据
 * @param {*} data 
 */
export const getUnreadCount = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/message/unreadCount',
    method: 'POST',
    params
  })
}

/**
 * 标记消息已读
 * @param {*} data 
 */
export const markNoticeRead = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/message/read',
    method: 'POST',
    params
  })
}

/**
 * 全局消费门槛
 */
export const getConsumThreshold = (cloud, params = {}) => {
  return request(cloud, {
    path: '/wx/account/thr-default',
    method: 'GET',
    params
  })
}