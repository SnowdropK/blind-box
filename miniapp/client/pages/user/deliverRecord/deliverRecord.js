// pages/user/deliverRecord/deliverRecord.js
import { getDeliveryRecord } from '../../../common/api/user'

const app = getApp();
const { cloud } = app;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deliverFilters: [{
      label: "已申请",
      val: 0,
      act: "deliverAct"
    }, {
      label: "准备中",
      val: 3,
      act: ""
    }, {
      label: "已发货",
      val: 1,
      act: ""
    }],
    params: {
      pageNo: 1,
      pageSize: 10,
      state: 0
    },
    STATE_MAP: {
      APPLIED: 0,
      PREPARE: 3,
      DELIVERED: 1
    },
    currentState: 0,
    deliverRecords: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      params: {
        pageNo: 1,
        pageSize: 10,
        state: 0
      },
      deliverRecords: [],
    }, () => {
      this.requestData();
    })
  },

  /**
   * 请求更多数据
   */
  requestMoreData() {
    // const params = {
    //   ...this.data.params,
    //   pageNo: this.data.pageNo + 1
    // }
    // this.setData({
    //   params
    // }, () => {
    //   this.requestData()
    // })
    this.requestData({ pageNo: this.data.params.pageNo + 1 })
  },

  /**
   * 查看页面
   */
  switchView(e) {
    const { state } = e.currentTarget.dataset;
    const nextFilters = this.data.deliverFilters.map(item => {
      if (item.val === state) {
        item.act = 'deliverAct'
      } else {
        item.act = ''
      }
      return item;
    })

    this.setData({
      // type: info.val,
      // pageNo: 1,
      deliverFilters: nextFilters,
      deliverRecords: [],
      currentState: state
    }, () => {
      this.requestData({ pageNo: 1, state })
    })
  },

  /**
   * 请求数据
   */
  requestData(resetParams) {
    // const params = {
    //   pageNo: this.data.pageNo,
    //   pageSize: this.data.pageSize,
    //   state: this.data.type
    // }
    const params = { ...this.data.params, ...resetParams };
    my.showLoading({
      mask: true
    })
    getDeliveryRecord(cloud, params).then(res => {
      my.hideLoading()
      const { records = [] } = res || {};
      this.dealData(records);
    }).finally(() => {
      this.setData({
        params
      })
    })
  },

  /**
   * 处理数据
   * @param {*} list 
   */
  dealData(list) {
    let arr = [...this.data.deliverRecords];
    for (let i = 0; i < list.length; i++) {
      const deliveryDo = list[i].deliveryDo || {};
      let count = 0
      let awards = list[i].goodsDtoList
      let item = {
        expressCompany: deliveryDo.shipChannel,
        expressNo: deliveryDo.shipSn,
        add: deliveryDo.address + ',' + deliveryDo.consignee + ',' + deliveryDo.mobile,
        remarks: deliveryDo.message,
        creatTime: deliveryDo.applyTime,
        num: 0,
        goods: []
      }

      let goods = [];
      for (let j = 0; j < awards.length; j++) {
        const element = awards[j];
        for (let k = 0; k < element.rewardDtoList.length; k++) {
          let ele2 = element.rewardDtoList[k]
          for (let m = 0; m < ele2.number; m++) {
            let goodData = {
              img: ele2.rewardImage,
              // word: (ele2.rewardType.indexOf('DE_') === -1 ? (ele2.rewardType.indexOf('CJ_') === -1 ? ele2.rewardType + '赏 ' : '全局赏 ') : '雷王赏 ') + ele2.rewardName
              word: ele2.rewardName
            }
            goods.push(goodData)
            count++
          }
        }
      }
      item.num = count
      item.goods = goods
      arr.push(item)
    }
    this.setData({
      deliverRecords: [...arr]
    })
  },

  /**
   * 复制快递单号
   */
  copyExpressNo(e) {
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
   * 显示赏品预览页面
   */
  showGoodsView(e) {
    const info = e.currentTarget.dataset.info
    this.goodsViewRef.show(info);
  },

  //获取notice实例
  saveGoodsViewRef(ref) {
    this.goodsViewRef = ref
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   return app.onShareAppMessage()
  // }
})