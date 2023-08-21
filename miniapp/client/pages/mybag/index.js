// pages/mybag/mybag.js
import iMath from '../../common/js/base/math'
const API = require('../../common/api/myBag.js');
import { fetchNotice } from '../../common/api/notice'
import icom from '../../common/js/base/com'

const app = getApp();
const { cloud } = app;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    filters: [{
      label: "现货",
      val: 'SPOT_GOODS',
      act: "act"
    }, {
      label: "预售",
      val: 'PRE_SALE',
      act: ""
    }],
    deliverInfo: {
      label: "发货须知",
      val: 'DELIVER_RULE',
    },
    filterType: 'SPOT_GOODS',
    totalNum: 0,
    goodList: [],
    choseList: [],
    choseAllNum: 0,
    noticeWord: "",
    postage: 10,
    inclusionThreshold: 10,
    // showAuth: false,
    choseAllFlag: false,
    // showAuthMask: false,
    viewModal: false,
    checkAddress: null,
    moveAni: '',
    pickNumShow: false,
    pickNumMax: [],
    pickNum: 0,
    nowChoseData: null,
    isLock: false,
    win: false,
    showOddityBtn: true,
    showRecoveryDialog: false,
    showDeliverDialog: false,
    scrollHeight: 700,
    showDeliver: true
  },

  /**
   * 切换模式
   */
  switchModal() {
    this.setData({
      viewModal: !this.data.viewModal
    })
  },

  /**
   * 获取选择的赏品列表
   */
  getChoseAwardList() {
    let arr = []
    for (let i = 0; i < this.data.goodList.length; i++) {
      const element = this.data.goodList[i];
      for (let j = 0; j < element.goods.length; j++) {
        const item = element.goods[j];
        if (item.choseNumber > 0) {
          arr.push({
            "goodsId": item.goodsId,
            "number": item.choseNumber,
            "rewardBagId": item.id,
            "rewardId": item.id,
            "rewardType": item.type.split('赏')[0],
            "goodsType": item.goodsType
          })
        }
      }
    }
    return arr
  },

  /**
   * 判断是否在数组里面
   */
  jadgeInArr(arr, item) {
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      if (element.goodsId === item.goodsId && element.rewardBagId === item.id && item.type.indexOf(element.rewardType) !== -1) {
        return i
      }
    }
    return 'none'
  },

  /**
   * 请求发货
   */
  requestAwardDeliver(data) {
    let that = this
    if (data.detailList.length <= 0) {
      my.showToast({
        content: '请重新选择你需要发货的物品',
        icon: 'none'
      });
      return
    }
    my.showLoading({
      mask: true,
    })
    API.applyDelivery(cloud, data).then(res => {
      my.alert({
        title: '提示',
        content: '发货成功！可以到“我的->发货记录”查看详情',
        success() {
          that.requestDataAgain();
          // that.deliverDialog.close();
          my.hideLoading()
          that.setData({
            showDeliverDialog: false
          })
        }
      })
    });
    my.hideLoading()
  },

  /**
   * 发货
   */
  awardDeliver(data) {
    let arr = this.getChoseAwardList()
    let { totalMoney, physicalTotalMoney, physicalTotalNum, ...rests } = data || {};
    const params = {
      ...rests,
      detailList: arr
    }
    // data.detailList = arr
    my.showLoading({
      mask: true,
    })
    // physicalTotalMoney：实物金额 - 虚拟商品金额
    // 无门槛包邮
    // deliveryAmount: 0 // this.data.postage
    // API.payDeliveryByPostcard(cloud).then(res => {
    //   console.log('res233333', res)
    //   params.outTradeNo = res
    //   this.requestAwardDeliver(params)
    // })
    this.requestAwardDeliver(params)
    // 满十个可包邮
    // if (physicalTotalNum > 0 && physicalTotalNum < 10) {
    //   API.payDelivery(cloud, {
    //     deliveryAmount: this.data.postage
    //   }).then(res => {
    //     this.openWxPay(res, () => {
    //       data.outTradeNo = res.outTradeNo
    //       this.requestAwardDeliver(data)
    //     })
    //   })
    // } else {
    //   this.requestAwardDeliver(data)
    // }
  },

  /**
   * 转化成魔晶接口
   * @param {*} data 
   */
  async retrieveAward(params) {
    await API.retrieveAward(cloud, params);
    my.alert({
      title: '提示',
      content: '已委托交易，等待处理~'
    })
    this.requestDataAgain();
    // this.recoveryDialog.close();
    this.setData({
      showRecoveryDialog: false
    })
    my.hideLoading()
  },

  /**
   * 云仓发货赏品
   */
  awardRecovery(e) {
    this.data.checkAddress = e.detail
    if (!this.data.checkAddress || !this.data.checkAddress.id) return;
    let arr = this.getChoseAwardList()
    const params = {
      addressId: this.data.checkAddress.id,
      retrieveList: arr
    }
    my.showLoading({
      mask: true,
    })
    this.retrieveAward(params);
  },

  async sellAward() {
    await API.sellAward(cloud, data);
    my.alert({
      title: '提示',
      content: '上架成功，可以在集市查看到你的赏品'
    })
    this.requestDataAgain();
    my.hideLoading()
  },

  /**
   * 赏品上架
   */
  awardShelf(e) {
    let arr = this.getChoseAwardList()
    let data = {
      "detailList": arr,
      "price": e.detail
    }
    my.showLoading({
      mask: true,
    })
    this.sellAward(data);
  },

  /**
   * 去奇物转卖
   */
  goToQiWu() {
    const env = my.getAccountInfoSync().miniProgram.envVersion;
    this.setData({
      showOddityBtn: true
    })
    if (env === 'release') {
      my.alert({
        title: '提示',
        content: '敬请期待奇物开放！',
      })
      return;
    }
    my.alert({
      title: '提示',
      content: '请确认是否前往奇物？',
      success (res) {
        my.navigateToMiniProgram({
          appId: 'wx7547a3cbaf3793de',
          path: 'pages/home/index/index',
          // develop（开发版），trial（体验版），release（正式版）
          envVersion: env === 'release' ? 'release' : "trial",
        })
      }
    })
  },
  showActiveOddityBtn() {
    this.setData({
      showOddityBtn: false
    })
  },
  /**
   * 再次请求数据
   */
  requestDataAgain() {
    this.setData({
      choseAllNum: 0,
      choseList: [],
      choseAllFlag: false,
    })
    for (let i = 0; i < this.data.filters.length; i++) {
      const element = this.data.filters[i];
      if (element.act === 'act') {
        this.requestData(element.val)
      }
    }
  },

  /**
   * 查看页面
   */
  switchView(e) {
    const { item } = e.currentTarget.dataset;
    const chose = item || {};
    const filters = this.data.filters.map(filterItem => {
      if (item.val === filterItem.val) {
        filterItem.act = 'act'
      } else {
        filterItem.act = ''
      }
      return filterItem;
    })
    const nextData = {
      filterType: chose.val || '',
      filters,
    }
    nextData.choseAllNum = 0;
    nextData.choseList = [];
    nextData.showDeliver = chose.val !== 'PRE_SALE';
    this.setData(nextData, () => {
      this.requestData(chose.val)
    })
  },

  /**
   * 显示云仓发货页面
   */
  showRecoveryDialog() {
    const choseList = this.data.choseList;
    if (choseList.length <= 0) {
      my.showToast({
        content: '请先选择需要委托交易的赏品',
        icon: 'none'
      })
    } else {
      let totalMoney = 0
      let totalNum = 0
      choseList.forEach(item => {
        totalMoney = iMath.accAdd(totalMoney, iMath.accMul(item.retrievePrice, item.choseNumber));
        totalNum = iMath.accAdd(totalNum, item.choseNumber)
      })
      this.setData({
        recoveryChoseList: choseList,
        recoveryTotalMoney: totalMoney,
        recoveryTotalNum: totalNum,
        showRecoveryDialog: true
      })
    }
  },

  /**
   * 显示出售页面
   */
  showShelfDialog() {
    if (this.data.viewModal) {
      my.showToast({
        content: '查看模式下不能进行出售',
        icon: 'none'
      })
      return
    }

    if (this.data.choseList.length <= 0 || this.data.choseList.length > 20) {
      const title = this.data.choseList.length <= 0 ? '请先选择需要上架的赏品' : '一次只能上架20个赏品哦~';
      my.showToast({
        content,
        icon: 'none'
      })
    } else {
      // this.shelfDialog.show(this.data.choseList);
    }
  },

  /**
   * 显示发货页面
   */
  showDeliverBox() {
    if (this.data.viewModal) {
      my.showToast({
        content: '查看模式下不能进行发货',
        icon: 'none'
      })
      return
    }

    if (this.data.choseAllNum <= 0) {
      my.showToast({
        content: '请先选择需要发货的赏品',
        icon: 'none'
      })
    } else {
      // this.deliverDialog.show(this.data.choseList, this.data.postage, this.data.filterType, this.data.inclusionThreshold);
      this.setData({
        deliverChoseList: this.data.choseList,
        deliverPostage: this.data.postage,
        deliverFilterType: this.data.filterType,
        showDeliverDialog: true
      })
    }
  },

  /**
   * 显示回收页面
   */
  showRecoveryBox() {
    if (this.data.viewModal) {
      my.showToast({
        content: '查看模式下不能进行发货',
        icon: 'none'
      })
      return
    }

    if (this.data.choseAllNum <= 0) {
      my.showToast({
        content: '请先选择需要发货的赏品',
        icon: 'none'
      })
    } else {
      this.setData({
        recoveryChoseList: choseList,
        showRecoveryDialog: true
      })
      // this.RecoveryDialog.show(this.data.choseList);
    }
  },

  /**
   * 显示赏品列表
   */
  showGoodList(e) {
    let index = e.currentTarget.dataset.listindex;
    let goodList = this.data.goodList;
    goodList[index].open = !goodList[index].open;
    if (goodList[index].open && goodList[index].goods.length <= 0) {
      my.showLoading({
        mask: true,
      })
      API.getMyAwardList(cloud, {
        pageNo: 1,
        pageSize: 9999,
        goodsId: goodList[index].id,
        lockStatus: this.data.isLock ? 1 : 0,
        goodsEnum: this.data.filterType
      }).then(res => {
        let list = res || [];
        goodList[index].goods = []
        list.sort((a, b) => {
          var order = [
            'FIRST', 'LAST', 'SP', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
          ]
          return order.indexOf(a.rewardType) - order.indexOf(b.rewardType)
        })
        for (let i = 0; i < list.length; i++) {
          const element = list[i];
          let goodData = {
            goodsId: element.goodsId,
            id: element.id,
            type: element.rewardType + '赏',
            name: element.rewardName,
            url: element.rewardImage,
            retrievePrice: element.retrievePrice,
            chose: false,
            number: element.showNumber,
            choseNumber: 0,
            deliveryTime: icom.dateFormat(element.deliveryTime, true),
            goodsType: element.goodsType,
            rare: element.rareType || 'N'
          }
          goodList[index].goods.push(goodData)
        }
        this.setData({
          goodList
        })
        my.hideLoading()
      })
    } else {
      this.setData({
        goodList
      })
    }

  },

  /**
   * 选择所有赏品
   */
  choseAll() {
    if (this.data.viewModal) {
      my.showToast({
        content: '查看模式下不能进行全选',
        icon: 'none'
      })
      return
    }

    if (this.data.choseAllFlag) {
      let goodList = this.data.goodList;
      for (let i = 0; i < goodList.length; i++) {
        const element = goodList[i];
        element.choseNum = 0
        for (let j = 0; j < element.goods.length; j++) {
          const item = element.goods[j];
          item.choseNumber = 0
        }
      }
      this.setData({
        goodList: goodList,
        choseList: [],
        choseAllFlag: false,
        choseAllNum: 0
      })
    } else {
      let goodList = this.data.goodList;
      let choseList = []
      let choseAllNum = 0
      for (let i = 0; i < goodList.length; i++) {
        const element = goodList[i];
        element.choseNum = 0
        if (element.open) {
          for (let j = 0; j < element.goods.length; j++) {
            const item = element.goods[j];
            item.choseNumber = item.number
            choseList.push(item)
            element.choseNum += item.choseNumber
            choseAllNum += item.choseNumber
          }
        }
      }
      this.setData({
        goodList: goodList,
        choseList: choseList,
        choseAllFlag: true,
        choseAllNum: choseAllNum
      })
    }
  },

  /**
   * 选择赏品
   */
  choseGood(e) {
    let index = e.target.dataset.listindex;
    let goodIndex = e.target.dataset.goodindex;
    let goodList = this.data.goodList;
    let good = goodList[index].goods[goodIndex];

    if (this.data.viewModal) {
      my.previewImage({
        current: 0,
        urls: [good.url],
      })
      // return;
    } else {
      if (!good.trade) {
        this.showPickNumBox(good)
      }
    }
  },

  /**
   * 选择赏品
   */
  showPickNumBox(data) {
    // let arr = []
    // for (let i = 0; i <= data.number; i++) {
    //   arr.push(i)
    // }
    this.setData({
      pickNumShow: true,
      moveAni: 'uping',
      nowChoseData: data,
      pickNumMax: data.number,
      pickNum: data.choseNumber || null
    })
  },

  /**
   * 隐藏选择的页面
   */
  hidePickNumBox() {
    this.setData({
      moveAni: 'downing'
    })
    setTimeout(() => {
      this.setData({
        pickNumShow: false
      })
    }, 200)
  },

  /**
   * 减少选择数量
   */
  reducePickNum() {
    if (this.data.pickNum > 0) {
      this.setData({
        pickNum: this.data.pickNum - 1
      })
    }
  },

  /**
   * 增加选择数量
   */
  addPickNum() {
    if (this.data.pickNum < this.data.pickNumMax) {
      this.setData({
        pickNum: this.data.pickNum + 1
      })
    }
  },

  /**
   * 选择数字修改
   * @param {} e 
   */
  pickNumChange(data) {
    // let data = parseInt(e.detail)
    // this.data.pickNum = data
    this.setData({
      pickNum: parseInt(data)
    })
  },

  /**
   * 修改选择的数据
   */
  changeChoseNum() {
    if (this.data.pickNum > this.data.pickNumMax) {
      my.showToast({
        content: '不能大于该赏品的持有数量',
        icon: 'none'
      });
      return
    }
    this.data.nowChoseData.choseNumber = this.data.pickNum
    this.setData({
      goodList: this.data.goodList,
    })
    this.setChoseList()
    this.hidePickNumBox()
  },

  /**
   * 设置选择的赏品
   */
  setChoseList() {
    let goodList = this.data.goodList;
    let choseAllNum = 0
    let choseList = []
    for (let i = 0; i < goodList.length; i++) {
      const element = goodList[i];
      element.choseNum = 0
      for (let j = 0; j < element.goods.length; j++) {
        const item = element.goods[j];
        choseAllNum += item.choseNumber
        if (item.choseNumber > 0) {
          choseList.push(item)
        }
      }
    }
    this.setData({
      choseAllNum: choseAllNum,
      choseList: choseList
    })
  },

  /**
   * 更新选择的列表
   */
  updateChoseList(good) {
    let list = this.data.choseList
    if (good.chose) {
      let item = iMath.deepClone(good)
      list.push(item)
    } else {
      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        if (element.id === good.id && element.type === good.type && element.name === good.name && element.goodIndex === good.goodIndex) {
          list.splice(i, 1)
        }
      }
    }
    this.setData({
      choseList: list
    })
  },

  /**
   * 请求数据
   */
  requestData(type) {
    my.showLoading({
      mask: true,
    })
    let data = {
      pageNo: 1,
      pageSize: 9999,
      lockStatus: this.data.isLock ? 1 : 0,
      goodsEnum: type
    }
    // if(!this.data.isLock) data.goodsEnum = type
    API.getMyIpList(cloud, data).then(res => {
      this.dealIpList(res.records)
      my.hideLoading()
    })

  },

  /**
   * 处理IP列表
   */
  dealIpList(list) {
    let arr = []
    let total = 0
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      let item = {
        id: element.goodsId,
        ipName: element.goodsName,
        goods: [],
        open: false,
        total: element.showNumber,
        choseNum: 0
      }
      arr.push(item)
      total += element.showNumber
    }
    this.setData({
      goodList: arr,
      totalNum: total
    }, () => {
      if (this.data.win && !!this.data.winGoodsId) {
        let index = (this.data.goodList || []).findIndex(item => item.id === this.data.winGoodsId);
        const e = { currentTarget: { dataset: { listindex: index }} };
        this.showGoodList(e)
      }
    })
  },

  /**
   * 获取公告/邮费/包邮门槛
   */
  getNotice() {
    fetchNotice(cloud, 'SHIP_RULE').then(res => {
      const { keyValue = '' } = res || {}
      this.setData({
        DAILY_TASK_RULE: keyValue
      })
    })
    fetchNotice(cloud, 'EXPRESS_FEE').then(res => {
      const { keyValue } = res || {}
      this.data.postage = Number(keyValue)
    })
    fetchNotice(cloud, 'EXPRESS_FEE_THRESHOLD_NUM').then(res => {
      const { keyValue } = res || {}
      this.setData({
        inclusionThreshold: +keyValue || 10
      })
    })
  },
  // 规则弹窗初始化
  defaultDialogRef(ref) {
    this.defaultDialogRef = ref
  },
  // 公共弹窗
  showDialog() {
    this.setData({
      noticeWord: this.data['DAILY_TASK_RULE']
    })
    this.defaultDialogRef.show()
  },
  /**
   * 显示发货须知
   */
  // showNotice() {
  //   // this.noticeDialog.show();
  //   this.setData({
  //     showRuleDialog: true
  //   })
  // },
  // closeRuleDialog() {
  //   this.setData({
  //     showRuleDialog: false
  //   })
  // },
  async viewRule() {
    const isLogin = await this.interceptJump()
    if (isLogin) return
    this.showDialog()
  },
  // 未登录状态下拦截跳转
  interceptJump() {
    console.log(app.globalData);
    if (app.globalData.isLogin !== 1) return true
  },

  /**
   * 显示地址列表
   */
  showAddress() {
    // this.addressDialog.show()
  },

  closeRecoveryDialog() {
    this.setData({
      showRecoveryDialog: false
    })
  },

  /**
   * 关闭申请发货弹窗
   */
  closeDeliver(){
    this.setData({
      showDeliverDialog: false
    })
  },

  /**
   * 选中的地址
   */
  checkAddress(e) {
    this.setData({
      checkAddress: e.detail || null
    })
  },

  /**
   * 滚动区高度
   */
  getScrollHeight() {
    const that = this;
    my.getSystemInfo({
      success: function(res) {
        const windowHeight = res.windowHeight;
        const rect = my.createSelectorQuery().select('.goodsScrollBox').boundingClientRect();
        rect.exec(ret => {
          const top = (ret[0] || {}).top;
          const height = windowHeight - top;
          that.setData({
            scrollHeight: height
          });
        })
      }
    });
  },
  /**
   * 去奇物转卖微信小程序
   */
  goToResell() {
    my.alert({
      title: '提示',
      content: '敬请期待奇物微信小程序上线！'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    my.hideTabBar()
    this.setData({
      filters: [{
        label: "现货",
        val: 'SPOT_GOODS',
        act: "act"
      }, {
        label: "预售",
        val: 'PRE_SALE',
        act: ""
      }],
      choseList: [],
      choseAllNum: 0,
      showAuth: false,
      showAuthMask: false
    })
    if (app.globalData.isLogin === 1) {
      this.getNotice();
      this.getScrollHeight();
      this.requestData(this.data.filters[0].val)
    } else {
      app.watch(() => {
        this.getNotice();
        this.getScrollHeight();
        this.requestData(this.data.filters[0].val)
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
    if (!app.globalData.getMyBag) {
      return
    }
    app.globalData.getMyBag = false
    this.requestDataAgain()
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