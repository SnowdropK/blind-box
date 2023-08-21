// const API = require('../../../common/api/user.js');
import { getMemberList, getMemberDetail, receiveCardPrize } from '../../../common/api/user.js';

// import imath from'../../../common/js/base/math';
const app = getApp();
const { cloud } = app;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatorInfo: {
      avatarUrl: '',
      nickname: '',
      avatarBorderUrl: '',
      level: 0,
      nextLevelAmount: 0,
      nextLevelNeed: 0,
      progressPercent: 0
    },
    memberInfo: {
      memberCardTag: ''
    },
    currentMemberInfo: {
      goodsIpCoupons: []
    },
    couponList: [],
    avatorBorderList: [],
  },

  /**
   * 前往会员卡中心
   */
  goToMemberCard() {
    my.navigateTo({
      url: `/pages/user/buyMemberCard/index`,
    })
  },

  async getMemberInfo() {
    const data = await getMemberList(cloud);
    const memberList = data || [];
    const currentMemberInfo = memberList.filter(item => item.status === 1 || item.status === 2)[0] || {};

    const { status, name, amount, goodsIpCoupons, dayGiveCoin } = currentMemberInfo;
    console.log('currentMemberInfo', currentMemberInfo)
    const nextGoodsIpCoupons = goodsIpCoupons || [];
    const dailyCouponList = !!dayGiveCoin ? [ ...nextGoodsIpCoupons, { id: nextGoodsIpCoupons.length, nextLevelCoin: dayGiveCoin, type: 'coin' } ] : [...nextGoodsIpCoupons];
    console.log('dailyCouponList', dailyCouponList)
    this.setData({
      currentMemberInfo: { ...currentMemberInfo, dailyCouponList }
    })
  },

  async getDetail() {
    const data = await getMemberDetail(cloud);
    const { memberCardTag, ...rests } = data || {};
    this.setData({
      avatorInfo: rests || {},
      memberInfo: {
        memberCardTag
      },
    })
  },
  /**
   * 领取奖励
   */
  async receiveRewards() {
    if (this.data.currentMemberInfo.status === 2) {
      my.showToast({
        content: '今日会员奖励已领取成功！',
        icon: 'none'
      })
      return;
    }
    await receiveCardPrize(cloud, {});
    my.showToast({
      content: '每日会员奖励领取成功！',
      icon: 'none'
    })
    this.getMemberInfo();
  },

  onLoad() {
    if (app.globalData.isLogin === 1) { // 登录已完成
      this.getDetail();
      this.getMemberInfo();
    } else {
      app.watch(() => {
        this.getDetail();
        this.getMemberInfo();
      })
    }
  }

})