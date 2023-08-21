// const API = require('../../../common/api/user.js');
import { getMemberDetail, receiveLevelPrize, getConsumThreshold } from '../../../common/api/user.js';
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
      nextLevelNeed: 0,
      progressPercent: 0
    },
    memberInfo: {
      memberCardTag: ''
    },
    couponList: [],
    avatorBorderList: [],
    meetConsumThreshold: false,
  },

  /**
   * 前往会员卡中心
   */
  // goToMemberCard() {
  //   my.navigateTo({
  //     url: `/packageA/pages/buyMemberCard/index`,
  //   })
  // },

  async getDetail() {
    const data = await getMemberDetail(cloud);
    const { 
      memberCardTag, 
      levelNextAmountThr, 
      nextLevelAmount, 
      nextLevelNeed, 
      nextLevelCouponList, 
      nextLevelCoin, 
      waitReceiveCoin, 
      waitReceiveCouponList, 
      ...rests 
    } = data || {};
    const currentLevelAmount = imath.accSub(levelNextAmountThr, nextLevelNeed)
    const progressPercent = imath.accMul(imath.accDiv(currentLevelAmount, levelNextAmountThr), 100)
    this.setData({
      avatorInfo: {
        ...rests,
        nextLevelCouponList: !!nextLevelCoin ? [
          ...nextLevelCouponList, 
          { id: nextLevelCouponList[nextLevelCouponList.length -1].id+1, nextLevelCoin }
        ] : [...nextLevelCouponList || []],
        waitReceiveCouponList: !!waitReceiveCoin ? [
          ...waitReceiveCouponList, 
          { id: waitReceiveCouponList[waitReceiveCouponList.length -1].id+1, nextLevelCoin: waitReceiveCoin }
        ] : [...waitReceiveCouponList || []],
        nextLevelAmount,
        nextLevelNeed,
        progressPercent
      },
      memberInfo: {
        memberCardTag
      },
    })
  },
  /**
   * 升级奖励接口
   */
  async receiveLevelPrize(receiveIds) {
    const that = this;
    await receiveLevelPrize(cloud, {receiveIds});
    my.alert({
      content: `已成功领取升级奖励！`,
      buttonText: '知道了',
      showCancel: false,
      success () {
        that.getDetail()
      }
    })
  },
  /**
   * 领取升级奖励
   */
  handleLevelReceive() {
    const { receiveIds } = this.data.avatorInfo;
    if (!receiveIds) {
      my.showToast({
        title: '已领取升级奖励！',
        icon: 'none'
      })
      return;
    }
    this.receiveLevelPrize(receiveIds);
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
      }
    })
  },
  
  async getConsumThreshold() {
    const meetConsumThreshold = await getConsumThreshold(cloud);
    this.setData({
      meetConsumThreshold
    })
  },

  onLoad() {
    // if (app.globalData.isLogin === 1) { // 登录已完成
    //   this.getConsumThreshold()
    //   this.getDetail()
    // } else {
    //   app.watch(() => {
    //     this.getConsumThreshold()
    //     this.getDetail()
    //   })
    // }
    this.getConsumThreshold()
    this.getDetail()
  }

})