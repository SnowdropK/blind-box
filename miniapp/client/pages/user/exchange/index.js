import { fetchIps as getIpList, exchangeCoupon } from '../../../common/api/reward'
import { fetchNotice } from '../../../common/api/notice'

const app = getApp();
const { cloud } = app

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ruleWord: '',
    wrongTimesTip: '', // 输入错误，您还能输错{{wrongTimes}}次
    exchangeCode: null,
    goodsList: [],
    loading: false,
    pageNo: 1,
    scrollHeight: 0
  },
  onLoad() {
    // if (app.globalData.hasLogin) { // 登录已完成
    //   this.getNotice();
    // } else {
    //   app.watch(() => {
    //     this.getNotice();
    //   })
    // }
    this.getNotice();
    this.getIpList();
    this.getScrollHeight();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // this.ruleDialog = this.selectComponent('#ruleDialog')
    // this.exchangeDialog = this.selectComponent('#exchangeDialog')
  },
    /**
   * 滚动区高度
   */
  getScrollHeight() {
    const that = this;
    my.getSystemInfo({
      success: function(res) {
        const windowHeight = res.windowHeight;
        const rect = my.createSelectorQuery().select('.recommendedScrollBox').boundingClientRect();
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
  async getIpList(pageNo = 1) {
    const params = { 
      isRecommend: 1,
      pageNo,
      pageSize: 8,
      rewardType: 3
    }
    this.setData({
      loading: true
    })
    const data = await getIpList(cloud, params);
    const { records = [] } = data || {};
    const nextGoodsList = records.map((item, index) => {
      let now = new Date(new Date().toLocaleDateString()).getTime();
      let date = item.saleDate ? new Date(item.saleDate.replace(/-/g, '/')).getTime() : now;
      return {
        id: item.id, // 
        name: item.goodsName,
        new: (index == 0 || index == 1),
        saleOpen: item.saleOpen,
        img: item.smallImage, //
        date: item.saleDate ? item.saleDate.split(' ')[0] : '待定',
        price: item.everyDrawPrice || '待定',
        num: item.onSaleBoxNumber,
        total: item.boxNumber,
        isPoints: item.isPoints,
        sellOut: item.goodsMark == 3,
        rewardType: item.rewardType,
        interceptAll: item.interceptAll,
        interceptReward: item.interceptReward,
        currentSaleBoxNumber: item.currentSaleBoxNumber,
        hasDeficit: item.hasDeficit,
        label: date > now ? '预售' : '现货',
        mode: item.mode, // 
        openGift: item.openGift,
      }
    })
    this.setData({
      goodsList: [ ...this.data.goodsList, ...nextGoodsList ],
      pageNo: params.pageNo,
      loading: false
    })

    // try {

    // } catch {
    //   my.showToast({
    //     content: '出错了！',
    //     icon: 'error',
    //     duration: 2000
    //   })
    // } finally {
      
    // }
  },
  requestMoreData() {
    const pageNo = this.data.pageNo + 1
    this.getIpList(pageNo)
  },
  goBack() {
    my.navigateBack({
      delta: 1
    })
  },
  /**
   * 获取公告
   */
  async getNotice() {
    const data = await fetchNotice(cloud, 'GOODS_IP_COUPON_ACTIVITY_RULE')
    this.setData({
      ruleWord: data ? data.keyValue : ''
    })
  },
  // 规则弹窗初始化
  defaultDialogRef(ref) {
    this.defaultDialogRef = ref
  },
  // 公共弹窗
  showDialog() {
    this.setData({
      noticeWord: this.data['ruleWord']
    })
    this.defaultDialogRef.show()
  },
  //获取RuleDialog实例
  // saveRuleDialogRef(ref) {
  //   this.ruleDialogRef = ref
  // },
  saveExchangeDialogRef(ref) {
    this.exchangeDialogRef = ref
  },
  showRuleDialog() {
    this.ruleDialogRef.show();
  },
  /**
   * 修改输入
   */
  changeInput(e) {
    this.setData({
      exchangeCode: e.detail.value.trim()
    })
  },
  async exchangeCoupon(exchangeCode) {
    const couponList = await exchangeCoupon(cloud, { couponId: exchangeCode });
    if (!couponList) {
      this.setData({
        wrongTimesTip: message
      })
      return;
    }
    this.exchangeDialogRef.show(couponList);
    this.setData({
      exchangeCode: null
    })
  },
  /**
   * 兑换
   */
  exchange() {
    this.exchangeCoupon(this.data.exchangeCode)
  },
})