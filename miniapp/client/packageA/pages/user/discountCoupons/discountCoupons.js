import { getMyCouponList } from '../../../../common/api/reward'
import { fetchNotice } from '../../../../common/api/notice'
import icom from '../../../../common/js/base/com.js'


const app = getApp();
const { cloud } = app

const STATUS_MAP = {
  UN_USED: 20,
  USED: 30,
  EXPIRED: 40,
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    check: false,
    currentCoupons: [],
    // ruleWord: '',
    currentTab: 20,
    STATUS_MAP,
    loading: false,
    queryParams: {
      pageNo: 1,
      pageSize: 10,
      status: STATUS_MAP.UN_USED,
      expireAsc: true, // 到期时间逆序-false；顺序-true;不传不排序
      scrollHeight: 0
    }
  },
  onLoad() {
    console.log('currentCoupons', this.data.currentCoupons)
    // this.getNotice();
    this.getScrollHeight();
    this.getMyCouponList();
    // if (app.globalData.hasLogin) { // 登录已完成
    //   this.getNotice();
    //   this.getMyCouponList()
    // } else {
    //   app.watch(() => {
    //     this.getNotice();
    //     this.getMyCouponList()
    //   })
    // }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // this.ruleDialogRef = this.selectComponent('#ruleDialog')
  },

  /**
   * 滚动区高度
   */
  getScrollHeight() {
    const that = this;
    my.getSystemInfo({
      success: function(res) {
        const windowHeight = res.windowHeight;
        const rect = my.createSelectorQuery().select('.couponsScrollBox').boundingClientRect();
        rect.exec(ret => {
          const top = (ret[0] || {}).top;
          const scrollHeight = windowHeight - top;
          that.setData({
            scrollHeight
          });
        })
      }
    });
  },
  
  // 时间-三天内
  formatTimesString3(n) {
    // console.log(icom.timesFunString(n));
    if (3 > icom.timesFunString(n).dayDiff > 0) {
      return true
    }
    return false
  },
  //获取RuleDialog实例
  // saveRuleDialogRef(ref) {
  //   this.ruleDialogRef = ref
  // },
  /**
   * 获取公告
   */
  // async getNotice() {
  //   const res = await fetchNotice(cloud, 'GOODS_IP_COUPON_RULE')
  //   const { keyValue } = res || {}
  //   this.setData({
  //     ruleWord: keyValue || ''
  //   })
  // },
  goBack() {
    my.navigateBack({
      delta: 1
    })
  },
  // showRuleDialog() {
  //   this.ruleDialogRef.show();
  // },
  async getMyCouponList() {
    const { queryParams, currentCoupons } = this.data;
    const data = await getMyCouponList(cloud, { ...queryParams });
    const { records = [] } = data || {};
    const nextCurrentCoupons = [...currentCoupons, ...records]
    // console.log(nextCurrentCoupons);
    nextCurrentCoupons.forEach((e, i) => {
      if (e.expireTime) {
        e.beExpire =  this.formatTimesString3(e.expireTime)
      }
    });
    this.setData({
      currentCoupons: nextCurrentCoupons,
      loading: false
    })
  },
  /**
   * 滚动查询下一页
   */
  queryMore() {
    const queryParams = this.data.queryParams;
    this.setData({
      queryParams: {
        ...queryParams,
        pageNo: queryParams.pageNo + 1
      }
    }, () => {
      this.getMyCouponList();
    })
  },
  /**
   * 刷新列表
   */
  // refreshCouponList() {
  //   const queryParams = this.data.queryParams;
  //   this.setData({
  //     loading: true,
  //     currentCoupons: [],
  //     queryParams: {
  //       ...queryParams,
  //       pageNo: 1
  //     }
  //   }, () => {
  //     this.getMyCouponList();
  //   })
  // },
  /**
   * 切换tab
   * @param {*} e 
   */
  handleSelectTab(e) {
    const { status } = e.currentTarget.dataset;
    this.setData({
      currentTab: status,
      currentCoupons: [],
      queryParams: { ...this.data.queryParams, status, pageNo: 1 },
    }, () => {
      this.getMyCouponList();
    })
  },
  /**
   * 跳转至首页或者无限赏
   */
  goToUse(e) {
    if (this.data.currentTab !== STATUS_MAP.UN_USED) return;
    my.switchTab({
      url:"/pages/reward/index/index"
    })
  }
})