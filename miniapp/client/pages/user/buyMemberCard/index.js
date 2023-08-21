import { getMemberDetail, getMemberList, buyMember } from '../../../common/api/user.js';
import { fetchNotice as getNotice } from '../../../common/api/notice.js';
import imath from '../../../common/js/base/math';

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
      progressPercent: 0
    },
    memberInfo: {
      memberCardTag: ''
    },
    memberList: [],
    currentMemberInfo: {
      status: 0,
      amount: 0,
      openCouponList: [],
      dailyCouponList: []
    },
    rule: '',
    shouwCardDetailDialog: false,
  },

  /**
   * 获取公告
   */
  async getNotice() {
    const data = await getNotice(cloud, 'MEMBER_CARD_RULE');
    const { keyValue } = data || {};
    this.setData({
      rule: keyValue
    })
  },

  async getDetail() {
    const data = await getMemberDetail(cloud);
    const { avatarUrl, avatarBorderUrl, nickname, level, memberCardTag, levelAmount, nextLevelAmount } = data || {};
    const currentLevelAmount = imath.accAdd(levelAmount, nextLevelAmount);
    const progressPercent = imath.accMul(imath.accDiv(levelAmount, currentLevelAmount), 100)
    this.setData({
      avatorInfo: {
        avatarUrl,
        nickname,
        avatarBorderUrl,
        level,
        nextLevelAmount,
        progressPercent
      },
      memberInfo: {
        memberCardTag
      },
    })
  },
  async getMemberList() {
    const data = await getMemberList(cloud);
    const memberList = data || []
    const currentMemberInfo = memberList[0] || {};
    const { status, name, amount, shopGiveCoupons, shopGiveCoin,  goodsIpCoupons, dayGiveCoin } = currentMemberInfo;
    const currentTip = (status === 1 || status === 2) ? `已购买${name}` : `${amount}元购买${name}`;
    const nextShopGiveCoupons = shopGiveCoupons || [];
    const nextGoodsIpCoupons = goodsIpCoupons || [];
    const openCouponList = !!shopGiveCoin ? [ ...nextShopGiveCoupons, { id: nextShopGiveCoupons.length, nextLevelCoin: shopGiveCoin, type: 'coin' }, { id: nextShopGiveCoupons.length + 1, memberTitle: name, type: 'memberTag' }] : [...nextShopGiveCoupons];
    const dailyCouponList = !!dayGiveCoin ? [ ...nextGoodsIpCoupons, { id: nextGoodsIpCoupons.length, nextLevelCoin: dayGiveCoin, type: 'coin' } ] : [...dailyCouponList];
    this.setData({
      memberList,
      currentMemberInfo: { ...currentMemberInfo, currentTip, openCouponList, dailyCouponList }
    })
  },
  changeSwiper(e) {
    const { current } = e.detail
    const currentMemberInfo = this.data.memberList[current] || {};
    const { status, name, amount, shopGiveCoupons, shopGiveCoin,  goodsIpCoupons, dayGiveCoin } = currentMemberInfo;
    const currentTip = (status === 1 || status === 2) ? `已购买${name}` : `${amount}元购买${name}`;
    const nextShopGiveCoupons = shopGiveCoupons || [];
    const nextGoodsIpCoupons = goodsIpCoupons || [];
    const openCouponList = !!shopGiveCoin ? [ ...nextShopGiveCoupons, { id: nextShopGiveCoupons.length, nextLevelCoin: shopGiveCoin, type: 'coin' }, { id: nextShopGiveCoupons.length + 1, memberTitle: name, type: 'memberTag' }] : [...nextShopGiveCoupons];
    const dailyCouponList = !!dayGiveCoin ?  [ ...nextGoodsIpCoupons, { id: nextGoodsIpCoupons.length, nextLevelCoin: dayGiveCoin, type: 'coin' } ] : [...nextGoodsIpCoupons];
    this.setData({
      currentMemberInfo: { ...currentMemberInfo, currentTip, openCouponList, dailyCouponList }
    })
  },
  /**
   * 确认支付成功
   * @param {*} info 
   */
  confirmPaySuccess() {
    my.alert({
      title: '温馨提示',
      content: '会员卡购买成功，若失败请联系客服',
      success: () => {
        this.getDetail();
        this.getMemberList();
      }
    })
  },
  /**
   * 调用微信支付
   */
  // openWxPay(info) {
  //   const that = this
  //   const { timeStamp, nonceStr, prepayId, signType, paySign } = info
  //   my.requestPayment({
  //     timeStamp: `${timeStamp}`,
  //     nonceStr,
  //     package: `prepay_id=${prepayId}`,
  //     signType,
  //     paySign,
  //     success(res) {
  //       if (res.errMsg === 'requestPayment:ok') {
  //         that.confirmPaySuccess(info)
  //       } else {
  //         my.showToast({
  //           content: '支付失败',
  //           icon: 'none'
  //         })
  //       }
  //     },
  //     fail(res) {
  //       my.showToast({
  //         content: '支付失败',
  //         icon: 'none'
  //       })
  //     }
  //   })
  // },
  async buyMember(id) {
    const data = await buyMember(cloud, { id });
    this.confirmPaySuccess(data)
    // this.openWxPay(data);
  },
  goToBuy() {
    const { id, status } = this.data.currentMemberInfo
    if (status === -1) {
      my.showToast({
        content: '客官，不能购买该会员卡',
        icon: 'none'
      })
      return;
    }
    if (status === 1 || status === 2) {
      my.showToast({
        content: '客官，您已购买该会员卡',
        icon: 'none'
      })
      return;
    }
    this.buyMember(id)
  },
  /**
   * 查看全部
   */
  // viewAll() {
  //   my.navigateTo({
  //     url: "/packageA/pages/memberList/index"
  //   })
  // },
  /**
   * 查看会员卡详情
   */
  viewCardDetail() {
    this.setData({
      shouwCardDetailDialog: true
    })
  },

  /**
   * 关闭会员卡详情弹窗
   */
  closeRuleDialog() {
    this.setData({
      shouwCardDetailDialog: false
    })
  },
  /**
   * 领取奖励成功
   */
  handleReceive() {
    this.getDetail();
    this.getMemberList();
  },

  onLoad() { 
    if (app.globalData.isLogin === 1) { // 登录已完成
      this.getDetail();
      this.getMemberList();
      this.getNotice();
    } else {
      app.watch(() => {
        this.getDetail();
        this.getMemberList();
        this.getNotice();
      })
    }
  }

})