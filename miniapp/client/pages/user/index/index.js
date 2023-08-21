// pages/user/index/user.js
import { userLogin, userDetail as getUserAcountInfo } from '../../../common/api/user';
import { getUnreadCount } from '../../../common/api/reward.js';
import { getMyCouponNum } from '../../../common/api/coupon';
import imath from '../../../common/js/base/math.js';

const app = getApp();
const { cloud, setUserInfo, getUserInfo } = app 

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: '/images/icon/common/head.png',
      nickName: '用户昵称',
      avatarBorderUrl: ''
    },
    userAccountInfo: {
      coin: 0,
      postcardTotal: 0,
      canUseAmount: 0
    },
    collectionIps: [],
    showAuthMask: false,
    QrCode: '',
    couponNum: 0,
    canUseGetUserProfile: !!my.getUserProfile,
    weChatSource: '',
    showRuleDialog: false,
    // noticeWord: "",
    // platform: '', // 当前系统
    sumCount: 0
  },

  /**
   * 前往消息中心
   */
  goToMessage() {
    my.navigateTo({
      url: `../message/index`,
    })
  },

  /**
   * 查看余额明细
   */
  gotoBalanceRecord() {
    my.navigateTo({
      url: "../balanceRecord/balanceRecord?b="+this.data.userAccountInfo.canUseAmount
    })
  },

  /**
   * 查看交易记录
   */
  gotoTradeRecord() {
    my.navigateTo({
      url: "../tradeRecord/tradeRecord"
    })
  },

  /**
   * 查看发货记录
   */
  gotoDeliverRecord() {
    my.navigateTo({
      url: "../deliverRecord/deliverRecord"
    })
  },

  /**
   * 查看金币
   */
  gotoCoinRecord() {
    my.navigateTo({
      url: "/packageA/pages/user/coinRecord/coinRecord?b="+this.data.userAccountInfo.coin
    })
  },

  /**
   * 积分明细
   */
  gotoPointRecord() {
    my.navigateTo({
      url: "/packageA/pages/user/pointRecord/pointRecord?b="+this.data.userAccountInfo.point
    })
  },
  //明信片
  gotoPostcard() {
    my.navigateTo({
      url: `/packageA/pages/user/postcard/postcard?count=${this.data.postcardTotal || 0}`
    })
  },
  /**
   * 查看魔晶明细
   */
  gotoMagicCoinList() {
    my.navigateTo({
      url: "../magicCoinRecord/magicCoinRecord?b="+this.data.userAccountInfo.magicCoin
    })
  },

  /**
   * 去收藏页面
   */
  gotoCollectionPage(){
    my.navigateTo({
      url: "/packageA/pages/user/collect/collect"
    })
  },

  /**
   * 显示充值页面
   */
  goToRecharge() {
    my.navigateTo({
      url: "/packageA/pages/user/recharge/recharge?b="+this.data.userAccountInfo.canUseAmount
    })
  },

  /**
   * 显示进群二维码
   */
  showQrCode() {
    let that = this;
    my.previewImage({
      urls: [that.data.QrCode]
    })
  },

  /**
   * 前往会员中心
   */
  async goToMemberCentre() {
    const isLogin = await this.interceptJump()
    if (isLogin) {
      my.navigateTo({
        url: "/pages/user/memberCentre/index"
      })
    }
  },

  /**
   * 前往会员卡
   */
  async goToMemberCard() {
    const isLogin = await this.interceptJump()
    if (isLogin) {
      my.navigateTo({
        url: `/pages/user/memberCard/index`,
      })
    }
  },

  /**
   * 前往优惠券列表页
   */
  gotoDiscountCoupons() {
    my.navigateTo({
      url: "/packageA/pages/user/discountCoupons/discountCoupons"
    })
  },

  /**
   * 前往兑换码页
   */
  async gotoExchange() {
    const isLogin = await this.interceptJump()
    if (isLogin) {
      my.navigateTo({
        url: "/pages/user/exchange/index"
      })
    }
  },
  /**
   * 查看发货规则
   */
  viewRule() {
    this.showNotice()
  },
  /**
   * 显示发货须知
   */
  showNotice() {
    this.setData({
      showRuleDialog: true
    })
  },

  /**
   * 前往积分兑换
   */
  gotoPointExchange() {
    my.navigateTo({
      url: "/packageA/pages/user/store/store"
    })
  },

  /**
   * 显示退款页面
   */
  showWithdrawalDialog() {
    my.showToast({
      title: '自动退款功能暂未开放，请联系客服处理~',
      icon: 'none'
    })
  },

  /**
   * 判断是否需要授权
   */
  jadgeAuth() {
    const userInfo = getUserInfo() || {};
    if (!userInfo.openId) {
      this.setData({
        showAuthMask: true
      })
    } else {
      this.setData({
        userInfo
      }, () => {
        this.getUserDetail()
      })
    }
  },
  /**
   * 获取用户详细信息
   */
  getUserDetail() {
    this.getUserAcountInfo();
    this.getCouponNum();
    this.getUnreadCount();
  },
  /**
   * 绑定手机后再查询详情
   */
  // getNewUserDetail() {
  //   this.getUserDetail();
  //   this.setData({
  //     showPhoneBindModal: false,
  //   })
  // },

  /**
   * 获取初酱券的数量
   */
  getCouponNum(){
    getMyCouponNum(cloud, {}).then(res=>{
      if(res.code === 'SUCCESS'){
        this.setData({
          couponNum: res.data
        })
      }
    })
  },

  // 显示三方小程序绑定窗口
  showWechatBindModal(userInfo = {}) {
    const { bindCode = '', openId = '' } = userInfo
    if (this.data.weChatSource === 'free-transaction-miniapp') {
      my.confirm({
        title: '提示',
        content: '请确定是否绑定奇物小程序？',
        success (res) {
          if (res.confirm) {
            my.navigateBackMiniProgram({
              extraData: {
                weChatSource: 'reward-service-front',
                bindCode,
                openId,
              },
              success(res) {
                // 返回成功
              }
            })
          } else if (res.cancel) {
            my.navigateBackMiniProgram()
          }
        }
      })
      
    }
  },

  //获取当前用户详情
  async getUserAcountInfo() {
    const res = await getUserAcountInfo(cloud);
    const data = res || {};
    const { point = 0, postcardTotal = 0, avatarUrl = '', nickname = '' } = data;
    this.setData({
      // point,
      // postcardTotal,
      // nickName: nickname || '',
      // avatar: avatarUrl || '',
      // openId,
      userInfo: { ...data },
      userAccountInfo: { ...data },
      showPhoneBindModal: !data.telephone,
    });
    // app.globalData.userInfo = { ...userInfo }
    setUserInfo({ ...data })
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    my.getUserProfile(cloud, {
      desc: '登录获取用户信息'
    }).then(res => {
      this.updateUserInfo(res.userInfo)
    }).catch(res => {
      my.confirm({
        title: '请授权你的头像，昵称以便使用更多功能~',
        showCancel: false
      })
    })
  },

  /**
   * 跳转至头像昵称填写页面
   */
  goToAvator(e) {
    const { openId } = this.data.userInfo
    const type = !!openId ? 'update' : 'login'
    my.navigateTo({
      url: `../avator/avator?type=${type}`,
    })
  },

  /**
   * 复制Uid
   */
  copyOpenId(e) {
    const code = e.target.dataset.no
    my.setClipboard({
      text: code,
      success: () => {
        my.showToast({
          type: 'success',
          content: '复制成功',
          duration: 3000
        });
      }
    });
  },

  /**
   * 更新用户信息
   */
  updateUserInfo(info) {
    // info.nickname = info.nickName
    info.avatarUrl = info.avatarUrl || '/images/icon/common/head.png'
    app.globalData.userInfo = info
    my.showLoading({
      mask: true,
    })
    API.updateUserInfo(cloud, {
      nickname: info.nickName,
      avatarUrl: info.avatarUrl
    }).then(res => {
      if (res.code === 'SUCCESS') {
        this.setData({
          showAuthMask: false
        })
        this.getUserDetail();
      }
      my.hideLoading()
    })
  },

  /**
   * 未读数据
   */
  async getUnreadCount() {
    const data =  await getUnreadCount(cloud);
    const { sysMsgUnreadCount , activityMsgUnreadCount, rewardMsgUnreadCount } = data || {};
    const sumCount = imath.accAdd(imath.accAdd(activityMsgUnreadCount, rewardMsgUnreadCount), sysMsgUnreadCount);
    this.setData({
      sumCount
    })
  },

  // 未登录状态下拦截跳转
  interceptJump() {
    console.log(app.globalData);
    if (app.globalData.isLogin !== 1) {
      my.showToast({
        content: '您的账户已经被冻结，无法使用小程序的功能',
        duration: 3000
      });
      return false
    }
    return true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    my.hideTabBar();
    // if (app.globalData.isLogin === 1) { // 登录已完成
    //   this.getNotice();
    // } else {
    //   app.watch(() => {
    //     this.getNotice()
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.jadgeAuth();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.rechargeDialog = this.selectComponent('#rechargeDialog')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.onShareAppMessage()
  },
  /**
   * 关闭绑定手机号弹窗
   */
  // closePhoneBind() {
  //   this.setData({
  //     showPhoneBindModal: false
  //   })
  // },
  /**
   * 打开手机弹窗
   */
  // openPhoneBind() {
  //   this.setData({
  //     showPhoneBindModal: true
  //   })
  // }
})