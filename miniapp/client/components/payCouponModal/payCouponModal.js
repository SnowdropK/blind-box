// components/payCoupon/payCoupon.js
import { getCouponList, getMyCouponList } from '../../common/api/reward.js';
import imath from '../../common/js/base/math.js';
import icom from '../../common/js/base/com.js'

const app = getApp();
const { cloud } = app

const STATUS_MAP = {
  UN_USED: 20,
  USED: 30,
  EXPIRED: 40,
}

Component({
  /**
   * 组件的属性列表
   */
  props: {
    showList: false,
    checkedCouponId: null,
    checkedReduceAmount: null,
    goodsId: null,
    amount: null,
    everyDrawPrice: null,
    rewardType: null,
    useCoupon: null,
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    isUsefulCoupon: true,
    // isDisableCoupon: false,
    showAni: '',
    moveAni: '',
    usefulCoupons: [],
    // expiredCoupons: [],
    currentCoupons: [],
    checkedReduceAmount: 0,
    queryParams: {
      pageNo: 1,
      pageSize: 5,
      status: STATUS_MAP.UN_USED,
      expireAsc: true,
    }
  },

  /**
   * 组件的方法列
   */
  methods: {
    show() {
      const queryParams = this.data.queryParams;
      console.log(this.props.useCoupon);
      this.setData({
        show: true,
        currentCoupons: [],
        queryParams: {
          ...queryParams,
          pageNo: 1
        }
      })
      if (!this.props.useCoupon) {
        return
      }
      this.getCouponList()
    },
    isUseful(item, amount, currentTimeStamp) {
      const expireTimeStamp = new Date(item.expireTime.replace(/-/g, '/')).getTime()
      return amount >= item.minThreshold && expireTimeStamp >= currentTimeStamp && item.allocateGoodsType !== '1' && (item.allocateGoodsType === `${this.props.rewardType}` || item.allocateGoodsType === '')
    },
    /**
     * 获取票券列表
     */
    async getCouponList() {
      my.showLoading({
        mask: true,
      })
      console.log(this.props);
      const { queryParams } = this.data;
      const { everyDrawPrice, amount, goodsId } = this.props;
      const { records = [] } = await getMyCouponList(cloud, {
        // amount,
        singleAmountEqual: everyDrawPrice,
        goodsId,
        ...queryParams
      })
      const nextCurrentCoupons = [...this.data.currentCoupons, ...records]
      // const { data: expiredCoupons } = await getCouponList({status: STATUS_MAP.EXPIRED, goodsId: this.props.goodsId, amount: this.props.amount })
      // const sortCoupons = (nextCurrentCoupons || []).sort((a, b) =>  imath.accSub(b.reduceAmount, a.reduceAmount))
      // const currentTimeStamp = new Date().getTime()
      // const usefulCoupons = sortCoupons.filter(item => this.isUseful(item, amount, currentTimeStamp))
      // const disableCoupons = sortCoupons.filter(item => !this.isUseful(item, amount, currentTimeStamp)).map(item => {
      //   item.disable = true;
      //   return item;
      // })
      // let currentCoupons = [ ...usefulCoupons, ...disableCoupons ]
      nextCurrentCoupons.forEach((e, i) => {
        if (e.expireTime) {
          e.beExpire =  this.formatTimesString3(e.expireTime)
        }
      });
      this.setData({
        // usefulCoupons: usefulCoupons || [],
        // expiredCoupons: expiredCoupons || [],
        currentCoupons: nextCurrentCoupons
      })
      my.hideLoading()
    },
    handleSelectTab(e) {
      const { type } = e.currentTarget.dataset
      this.setData({
        isUsefulCoupon: type === 'useful',
        isDisableCoupon: type === 'disable',
        currentCoupons: type === 'useful' ? this.data.usefulCoupons : this.data.expiredCoupons
      })
    },
    changeChecked(e) {
      const { id, reduceAmount } = e.detail
      this.setData({
        checkedReduceAmount: id === this.props.checkedCouponId ? 0 : reduceAmount,
        checkedCouponId: id === this.props.checkedCouponId ? null : id,
      })
    },
    // 时间-三天内
    formatTimesString3(n) {
      if (3 > icom.timesFunString(n).dayDiff > 0) {
        return true
      }
      return false
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
        this.getCouponList();
      })
    },
    /**
     * 确定
     */
    ensure() {
      this.close()
      // this.props.ensure({ checkedCouponId: this.props.checkedCouponId || null, checkedReduceAmount: this.props.checkedReduceAmount })
    },
    /**
     * 关闭弹窗
     */
    close() {
      // setTimeout(() => {
        this.setData({
          show: false
        })
      // }, 200)
      // this.props.close()
    },
  },
  lifetimes: {
    didMount() {
      // this.getCouponList()
    }
  },
})