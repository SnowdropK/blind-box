import { getPoints } from '../../../common/api/user'

const app = getApp();
const { cloud } = app

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList: [],
    showDialog: false,
    info: {},
    point: 0
  },
  onLoad() {
    this.getPointList()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // this.ruleDialog = this.selectComponent('#ruleDialog')
  },
  goBack() {
    my.navigateBack({
      delta: 1
    })
  },
  showRuleDialog() {
    this.ruleDialog.show();
  },
  async getPointList() {
    const data = await getPoints(cloud);
    const { list = [], point = 0 } = data || {};
    this.setData({
      couponList: list,
      point
    })
  },
  exchange(e) {
    const { info } = e.currentTarget.dataset
    if (info.num === 0) {
      my.showToast({
        content: '已兑换',
        icon: 'none'
      })
      return;
    }
    this.setData({
      info,
      showDialog: true
    })
  },
  handleClose() {
    this.setData({
      showDialog: false
    })
  },
  handleEnsure() {
    this.getPointList()
    this.setData({
      showDialog: false
    })
  },
})