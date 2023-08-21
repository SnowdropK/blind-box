import { request } from '../js/reques'

/**
 * 获取banner
 */
export const fetchBanners = (cloud) => {
  return request(cloud, {
    path: '/wx/banner/list',
    method: 'GET',
  })
}

/**
 * 获取分类数据
 */
export const fetchCategorys = (cloud) => {
  return request(cloud, {
    path: '/wx/category/list',
    method: 'GET',
  })
}

/**
 * 获取商品列表
 */
export const fetchIps = (cloud, params) => {
  return request(cloud, {
    path: '/wx/goods/page',
    method: 'GET',
    params
  })
}

/**
 * 获取IP详情
 */
export const fetchIpDetail = (cloud, id) => {
  return request(cloud, {
    path: `/wx/goods/tb-detail/${id}`,
    method: 'GET'
  })
}

/**
 * 获取赏池子记录
 */
export const fetchIpAward = (cloud, { id, no }) => {
  return request(cloud, {
    path: `/wx/goods/reward/${id}/${no}`,
    method: 'GET'
  })
}

/**
 * 获取中赏记录
 */
export const fetchIpRecord = (cloud, params) => {
  return request(cloud, {
    path: `/wx/order/reward/record`,
    method: 'GET',
    params
  })
}

/**
 * 获取First中赏记录
 */
export const fetchIpFirstRecord = (cloud, params) => {
  return request(cloud, {
    path: `/wx/order/reward/firstRecord`,
    method: 'GET',
    params
  })
}

/**
 * 获取所有箱子
 */
export const fetchAllBoxList = (cloud, params) => {
  return request(cloud, {
    path: `/wx/goods/change/box`,
    method: 'GET',
    params
  })
}

/**
 * 获取中赏结果
 */
export const fetchRewardResult = (cloud, orderId) => {
  return request(cloud, {
    path: `/wx/order/${orderId}`,
    method: 'GET'
  })
}

/**
 * 获取分类数据
 */
export const getCategoryList = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/category/list`,
    method: 'GET',
    params
  })
}

/**
 * 我的优惠券列表(分页)
 */
export const getMyCouponList = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/goods/coupon/user-coupon-page`,
    method: 'GET',
    params
  })
}

/**
 * 兑换优惠券
 */
export const exchangeCoupon = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/goods/coupon/receive`,
    method: 'GET',
    params
  })
}

/**
 * 获取会员等级
 */
export const getLevel = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/member/level/level`,
    method: 'POST',
    params
  })
}

/**
 * 获取广告
 */
export const getBanner = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/banner/open`,
    method: 'GET',
    params
  })
}

/**
 * 获取活动列表
 */
export const getActivityList = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/active/welfare/list`,
    method: 'GET',
    params
  })
}

/**
 * 最强王者榜
 */
export const getConsumerList = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/reward/rank/total/reward-consumer`,
    method: 'GET',
    params
  })
}

/**
 * 拳神榜
 */
export const getAllRewardList = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/reward/rank/total/all-reward-num`,
    method: 'GET',
    params
  })
}


/**
 * 获取活动详情
 */
export const getActivityDetail = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/active/welfare/activityInfo`,
    method: 'POST',
    params
  })
}

/**
 * 领取活动奖品
 */
export const receivePrize = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/active/welfare/receive`,
    method: 'POST',
    params
  })
}

/**
 * 获取无限赏分类数据
 */
export const getUnlimitCategoryList = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/category/unlimit-list`,
    method: 'GET',
    params
  })
}
/** 
 * 获取IP详情
 */
export const getIpDetail = (cloud, id = '') => {
  return request(cloud, {
    path: `/wx/goods/detail/${id}`,
    method: 'GET',
  })
}

/**
 * 查询当前赛季活动
 */
export const getCurSeasonActivity = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/active/range/current-active`,
    method: 'POST',
    params
  })
}

/**
 * 获取锁箱信息
 */
export const getLockInfo = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/goods/rewardLockStatus/${params.goodsId}/${params.currentBox}`,
    method: 'GET',
    params
  })
}

/**
 * 获取次数排行
 */
export const getRankList = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/reward/rank/rewardNum/${params.goodsId}/${params.currentBox}`,
    method: 'GET',
    params
  })
}

/**
 * 领取赛季奖品
 */
export const receiveLadderPrize = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/active/range/receive`,
    method: 'POST',
    params
  })
}

/**
 * 获取欧皇排行
 */
export const fetchLuckList = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/reward/rank/luck/${params.goodsId}/${params.currentBox}`,
    method: 'GET',
    params
  })
}

/**
 * 获取魔王信息
 */
export const getDevilInfo = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/order/bag/devil/reward`,
    method: 'GET',
    params
  })
}

/**
 * 魔王榜
 */
export const getDemonList = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/order/bag/devil/reward-rank`,
    method: 'GET',
    params
  })
}

/**
 * 优惠券列表-废
 */
export const getCouponList = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/goods/coupon/user-coupon-list`,
    method: 'GET',
    params
  })
}

// 优惠券列表 卡券单个批量查询返回
export const batchCouponList = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/goods/coupon/batch-user-coupon`,
    method: 'POST',
    params
  })
}

/**
 * 获取公告富文本
 */
export const getRichText = (cloud, url) => {
  return request(cloud, {
    path: url,
    method: 'GET',
  })
}

// 试一次 创建订单
export const tryCreateOrder = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/order/reward/try-order`,
    method: 'POST',
    params
  })
}

/**
 * 获取淘宝店铺信息
 */
export const fetchTaoBaoStoreInfo = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/tb-agg/follow-shop-status`,
    method: 'GET',
    params
  })
}
/**
 * 关注淘宝店铺信息
 */
export const followTaoBaoStore = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/tb-agg/follow-shop`,
    method: 'POST',
    params
  })
}
/**
 * 每日任务列表
 */
export const fetchTaskList = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/day-sign/sign-list`,
    method: 'GET',
    params
  })
}
/**
 * 邀请信息
 */
export const fetchInviteInfo = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/tb-agg/invite-info`,
    method: 'POST',
    params
  })
}
/**
 * 签到
 */
export const signToday = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/day-sign/sign-today`,
    method: 'POST',
    params
  })
}
/**
 * 任务弹窗操作栏控制
 */
export const fetchTaskOperate = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/system/key-value-list`,
    method: 'POST',
    params
  })
}
/**
 * 未读消息数据
 */
export const getUnreadCount = (cloud, params = {}) => {
  return request(cloud, {
    path: `/wx/message/unreadCount`,
    method: 'POST',
    params
  })
}