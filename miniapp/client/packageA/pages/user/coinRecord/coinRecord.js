import { getCoinRecord } from '../../../../common/api/user'

const app = getApp();
const { cloud } = app

Page({
  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '金币明细',
    bgBack: true,
    filters: [{
      label: "全部",
      val: null,
      act: "act"
    }, {
      label: "收入",
      val: 1,
      act: ""
    }, {
      label: "支出",
      val: 2,
      act: ""
    }],
    records: [],
    pageNo: 1,
    pageSize: 20,
    type: null,
    coinAccount: 0
  },

  /**
   * 请求更多数据
   */
  requestMoreData() {
    this.data.pageNo++
    this.requestData()
  },

  /**
   * 查看页面
   */
  async switchView(e) {
    const isLogin = await this.interceptJump()
    if (!isLogin) return
    let index = e.currentTarget.dataset.val;
    let arr = this.data.filters;
    let chose = arr[index];
    for (let i = 0; i < arr.length; i++) {
      arr[i].act = ""
    }
    arr[index].act = "act"

    this.setData({
      type: chose.val,
      pageNo: 1,
      filters: arr,
      records: []
    })

    this.requestData()
  },

  /**
   * 请求数据
   */
  requestData() {
    let data = {
      "pageNo": this.data.pageNo,
      "pageSize": this.data.pageSize,
      "tradeType": this.data.type
    }
    my.showLoading({
      mask: true
    })
    getCoinRecord(cloud,data).then(res => {
      const { records = [] } = res || {}
      if (records.length) {
        this.dealData(records)
      }
       my.hideLoading({
        page: this // 防止执行时已经切换到其它页面，page指向不准确
      });
      this.setData({
        isLoading: false
      })
    }).catch(e => {
      my.hideLoading()
    })
    
  },

  /**
   * 处理数据
   * @param {*} list 
   */
  dealData(list) {
    let arr = this.data.records

    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      arr.push({
        // type: element.tradeType == 1 ? (element.tradeDesc === '大魔王争霸收益' ? '大魔王争霸收益' : '收入') : '花费',
        type: element.tradeDesc,
        creatTime: element.createTime,
        num: element.tradeCoin
      })
    }

    this.setData({
      records: arr
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
    if (options.b) {
      this.setData({
        coinAccount: options.b
      })
    }
    if (app.globalData.isLogin === 1) {
      this.requestData()
    } else {
      app.watch(() => {
        this.requestData()
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
  }
})