// service
import { fetchRewardResult as getRewardResult, fetchIpAward as getIpAwardDetail, fetchIpRecord as getRewardRecords, getIpDetail, getDevilInfo, getRichText, getDemonList, tryCreateOrder, getCouponList, batchCouponList, fetchTaoBaoStoreInfo } from '../../../common/api/reward';
import { onCollect as collectBox, removeCollect, statusCollect, userDetail } from '../../../common/api/user'
import { fetchNotice as getNotice } from '../../../common/api/notice.js'
import { createPointRewardOrder, createRewardOrder, payOrder, closeOrder } from '../../../common/api/pay.js'
// utils
import { timeFormatter, countDownTime } from '../../../common/js/base/com.js'
// consts
import agreementWord from '../../../common/js/base/agreement.js'
import rules from '../../../common/js/base/rule.js'
import imath from '../../../common/js/base/math.js'
import parse from 'mini-html-parser2'

const app = getApp();
const { cloud, getUserInfo } = app

// let awardListBox = null
const OPEN_GIFT = {
  OFF: 0, // 拳王赏：未开启赠品
  ON: 1 // 拳王赏：开启赠品
}
let interval1
let interval2
var num = 60; // 计时器显示的数字
var timerID; // 计时器ID

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '',
    bgBack: false,
    filters: [{
      label: "扭蛋池预览",
      val: 1,
      act: "act"
    }, {
      label: "中赏记录",
      val: 3,
      act: ""
    }],
    ipId: 1,
    choseType: 1,
    currentBoxNo: 1,
    IpInfo: {},
    buyNum: 0,
    lotteryNum: [1, 5, 10, 0],
    goods: [],
    baseGood: [],
    awardList: [],
    goodImgShow: true,
    goodInfoShow: false,
    awardListShow: false,
    noticeTitle: "用户服务协议条款",
    noticeWord: "",
    btnTitle: "",
    showAuto: false,
    showAuthMask: false,
    rewardTypeNames: [],
    probInfo: [],
    searchWord: '',
    noticeCount: 0,
    noticeInfoItems: [],
    rewardTypeMap: {},
    noticeInfo: [],
    bagDevilInfo: null,
    devilInfo: {
      nickname: '-暂无-',
      avatarUrl: '/images/reward/inf/who.png',
      time: '未占领',
      ups: [],
      upsNum: 0,
      downOrderId: null
    },
    rewardChallengeList: [], // 挑战记录
    animationTime: 10,
    rewardTypeChoseIndex: 0,
    loading: false,
    pageNo: 1,
    pageSize: 20,
    rloading: false,
    awardListHeight: 200,
    showImageModal: false,
    currentGoods: {},
    probabilityMap: {},
    showDemonModal: false,
    demonList: [],
    demonX: 604,
    demonY: 968,
    useGoodsCoupon: 0,
    isRichText: false,
    showConditionTip: false,
    conditionTipText: '',
    showChooseMask: false, // 选择模式弹窗
    nowMode: '明信片抽取',
    modeList: [
      { name: '明信片抽取', value: 1 },
      { name: '金币抽取', value: 2 },
      // { name: '积分抽取', value: 3 },
    ],
    modeImg: '/images/reward/inf/modeCard.png',
    btnsList: [1, 3, 5, 10],
    btnsListNum: [1, 3, 5, 10],
    selectCoupons: [],
    showOpen: false, // 抽赏动画
    openImg: '',
    isCollect: false, // 收藏状态
    showPayCoupon: false, // 减免券列表弹窗
    couponTotal: 0,
    couponUserMap: {}, // 可用券
    postcardTotal: 0, // 当前价格可用的明信片数量
    userAccountInfo: {},
    offShelfDate: '已结束', // 结束时间
    saleDate: '已开始', // 发售时间
    showDefaultDialog: true, // 公共弹窗
    showDailyTaskDialog: false,
    getRule: false, // 规则弹窗触发一次控制

    serviceData: null,
    move: 0,
    searchBottom: 0,
    tabHeight: 0,
    totalHeight: 0
  },
  
  /**
   * 开始/结束时间
   */
filterTime() {
  let saleDate = '已开始'
  let offShelfDate = '已结束'
  // 开始时间
  saleDate = countDownTime(this.data.IpInfo.saleDate, 1) || '已开始'
  // 距离结束时间
  offShelfDate = countDownTime(this.data.IpInfo.offShelfDate, 2) || '已结束'

  if (saleDate === '已开始') {
    // this.start()
    this.setData({
      saleDate: '已开始'
    })
  } else {
    this.setData({
      saleDate: saleDate
    })
  }
  if (offShelfDate !== '已结束' && saleDate === '已开始') {
    this.start()
  }
},
start() {
  var that = this;
  timerID = setInterval(() => {
    that.timer()
  }, 1000)
},
// 清除计时器
stop() {
  clearInterval(timerID)
},
// 计时函数
timer() {
  var that = this;
  // num = countDownTime(this.data.IpInfo.saleDate, 1) || '已开始'
  num = countDownTime(this.data.IpInfo.offShelfDate, 2) || '已结束'

  if (num !== '已结束') {
    that.setData({
      offShelfDate: num
    })
  } else {
    that.setData({
      offShelfDate: num
    })
  }
  // console.log(num)
},

  /**
   * 修改搜索内容
   */
  changeSearch(e) {
    this.data.searchWord = e.detail.value;
  },

  /**
   * 搜索中奖记录
   */
  searchAwardList() {
    if (this.data.rloading) {
      this.setData({
        loading: false
      })
      setTimeout(() => {
        this.data.rloading = false
      }, 500)
      return
    }
    this.data.rloading = true
    this.resetPageSize();
    this.requestAwardListData(true)
  },

  /**
   * 重置页码
   */
  resetPageSize() {
    this.setData({
      pageNo: 1,
      pageSize: 10,
      awardList: []
    })
    // awardListBox.splice(0, 99999999)
  },

  /**
   * 选择赏品类型查看
   */
  choseTypeIndex(e) {
    let index = e.currentTarget.dataset.val;
    this.setData({
      rewardTypeChoseIndex: index
    })
    this.resetPageSize();
    this.requestAwardListData()
  },

  /*
   * 请求更多中奖记录数据
   */
  requestMoreAwardListData(e) {
    console.log(e);
    // if (this.data.rloading) {
    //   setTimeout(() => {
    //     this.data.rloading = false
    //   }, 500)
    //   return
    // }
    // this.data.rloading = true
    this.data.pageNo++
    this.requestAwardListData()
  },

  /**
   * 显示授权页面
   */
  showAuthBox() {
    this.setData({
      showAuto: true,
      showAuthMask: false
    })
  },

  /**
   * 查看页面
   */
  switchView(e) {
    let index = e.currentTarget.dataset.val;
    let arr = this.data.filters;
    let chose = arr[index];
    for (let i = 0; i < arr.length; i++) {
      arr[i].act = ""
    }
    arr[index].act = "act"
    this.data.choseType = chose.val
    if (chose.val === 1) this.showIpImg();
    else if (chose.val === 3) this.showAwardList();

    this.setData({
      filters: arr
    })

    this.requestAllData()
  },

  /**
   * 显示中奖记录
   */
  showAwardList() {
    this.setData({
      goodImgShow: false,
      goodInfoShow: false,
      awardListShow: true
    })
  },

  /**
   * 显示Ip图片信息
   */
  showIpImg() {
    this.setData({
      goodImgShow: true,
      goodInfoShow: false,
      awardListShow: false
    })
  },

  /**
  * 是否收藏了该箱
  */
  ifCollect() {
    statusCollect(cloud, {
       goodsId: this.data.ipId,
      boxNumber: this.data.currentBoxNo
    }).then(res => {
      this.setData({
        isCollect: res.collectStatus
      })
    })
  },
  /**
   * 收藏该箱子
   */
  collectionIp() {
    collectBox(cloud, {
      "boxNumber": this.data.currentBoxNo,
      "goodsId": this.data.ipId,
    }).then(res => {
      my.showToast({
        content: '收藏成功',
      })
      this.ifCollect();
    })
  },
  // 取消收藏
  removeCollect() {
    removeCollect(cloud, {
      "boxNumber": this.data.currentBoxNo,
      "goodsId": this.data.ipId,
    }).then(res => {
      my.showToast({
        content: '取消收藏成功',
      })
      this.ifCollect();
    })
  },

  // 去赏袋
  toMyBag() {
    my.switchTab({
      url: '/pages/mybag/index'
    })
  },

  // 试一发
  async onTry() {
    let that = this
    let params = {
      currentBox: this.data.currentBoxNo,
      goodsId: this.data.ipId,
      number: 1
    }
    this.setData({
      isLoading: true
    })
    my.showLoading({
      mask: true
    });
    const { data } = my.getStorageSync({ key: 'SKIP_ANIMATION' })
    let times = 200
    if (data && !data.skip) {
      await this.animationOpen()
      times = 2500
    }
    setTimeout(()=>{
      tryCreateOrder(cloud, params).then(res => {
        console.log(res);
        if (res && res.length>0) {
          that.dealRewardRes(res, 'try')
        } else {
          that.setData({
            showOpen: false,
          })
        }
        that.setData({
          isLoading: false,
        })
        my.hideLoading()
      }).catch(e => {
        my.hideLoading()
      })
    }, times)
  },

  //开门动画
  animationOpen() {
    const { data } = my.getStorageSync({ key: 'SKIP_ANIMATION' })
    if (data && data.skip) {
      return
    }
    this.setData({
      showOpen: true,
      openImg: 'https://chujiangupload.xingyunyfs.com/tb-static/special-img/reward/open-min.gif?' + Math.random()
    })
  },

  /**
   * 确认使用积分支付
   */
  payPointConfirm(e) {
    let data = {
      "currentBox": this.data.currentBoxNo,
      "goodsId": this.data.ipId,
      "number": this.data.buyNum
    }
    my.showLoading({
      mask: true
    })
    createPointRewardOrder(cloud, data).then(res => {
      this.confirmPayOrder(res)
    })
  },

  // 启动
  onCreateOrder(e) {
    const { info = 0, nums = 0 } = e.currentTarget.dataset
    if (this.data.saleDate!=='已开始') {
      my.showToast({
        type: 'fail',
        content: '暂未开售',
        duration: 2000
      });
      return
    }
    this.postCardPay(info, nums)
  },

  // 明信片购买
  postCardPay(buyNum, nums) {
    console.log(buyNum, nums);
    const that = this
    const nowMode = this.data.nowMode === '明信片抽取'
    const { ipId: id, currentBoxNo: no } = this.data
    if (!id || !no || !buyNum) return
    if (this.data.isLoading) return
    // 明信片/金币不足 拦截
    nums = nums ? nums : buyNum
    if (nowMode && nums > this.data.postcardInfo.postcardTotal) {
      my.showToast({
        content: '明信片不足',
      })
      return
    } else if(!nowMode && buyNum * this.data.IpInfo.everyDrawPrice > this.data.userAccountInfo.coin) {
      my.showToast({
        content: '金币不足',
      })
      return
    }
    this.setData({
      isLoading: true
    })
    my.showLoading({
      content: '加载中...',
    });
    const coinAmount = nowMode ? 0 : this.data.userAccountInfo.coin
    let couponId = ''
    // 确定当前选中的优惠券
    this.data.selectCoupons.forEach((item)=>{
      if (item.buyNum === buyNum) {
        couponId = item.id
      }
    })
    let params = {
      accountAmount: 0,
      coinAmount: coinAmount,
      currentBox: no,
      goodsId: id,
      number: buyNum,
      couponId: nowMode ? couponId : '',
      usePostcard: nowMode,
    }
    // 再来n抽用数据
    // app.globalData.payPrevInfo = params

    // console.log(params);
    createRewardOrder(cloud, params).then(res => {
      const { data } = my.getStorageSync({ key: 'SKIP_ANIMATION' })
      let times = 200
      if (data && !data.skip) {
        this.animationOpen()
        times = 2500
      }
      this.setData({
        buyNum,
        // showOpen: false,
        isLoading: false
      })
      setTimeout(()=>{
        const { orderDo: { id } = {} } = res || {}
        if (id) {
          that.confirmPayOrder(res)
        } else {
          my.hideLoading({
            page: that
          });
        }
      }, times)
      
    }).catch((error) => {
      my.hideLoading({
        page: this
      });
      this.setData({
        isLoading: false,
        showOpen: false,
      })
    })
  },

  /**
   * 确认支付
   */
  payConfirm(detail) {
    let data = {
      "accountAmount": detail.deductionAmount,
      "magicCoinAmount": detail.deductionMagicCoin,
      "coinAmount": detail.deductionCoin,
      "couponId": detail.couponId,
      "currentBox": this.data.currentBoxNo,
      "goodsId": this.data.ipId,
      "number": this.data.buyNum
    }
    my.showLoading({
      mask: true
    })
    createRewardOrder(cloud, data).then(res => {
      // if (res.prepayId) {
      //   this.openWxPay(res)
      // } else {
      //   this.confirmPayOrder(res)
      // }
      this.confirmPayOrder(res)
      my.hideLoading()
    })
  },

  /**
   * 确认支付订单
   * @param {} info 
   */
  confirmPayOrder(info) {
    const { orderDo: { id } = {} } = info || {}
    let data = {
      orderId: +id,
    }
    payOrder(cloud, data).then(res => {
      this.getRewardRes(info)
      // 刷新数据
      this.getUserAcountInfo()
      // 列表刷新速度过快，会有滚动问题
      // this.getChallengeList()

      my.hideLoading()
    }).catch(e => {
      my.alert({
        content: e.message,
      })
      my.hideLoading()
      this.requestAllData()
    })
  },

  // 购买次数/淘宝
  goBuy() {
    console.log(this.data.postcardInfo);
    my.tb.openDetail ({
      itemId: this.data.postcardInfo.numIid,
      success: (res) => {
        console.log(res);
      },
      fail: (res) => {
        console.log(res);
        // my.alert({ content: "fail - " + res.errorMessage });
      },
    });
    // const url = this.data.postcardInfo.url
    // my.navigateTo({
    //   url: `/pages/webview/webview?url=${encodeURIComponent(url)}`,
    // })
  },
  // 去会员卡
  onMemberCard() {
    my.navigateTo({
      url: `/pages/user/memberCard/index`,
    })
  },

  /**
   * 预览图片
   */
  // previewImage(e) {
  //   let img = e.currentTarget.dataset.img
  //   my.previewImage({
  //     urls: [img]
  //   })
  // },
  /**
   * 打开图片弹窗
   */
  openImageModal(e) {
    const { good } = e.currentTarget.dataset
    this.setData({
      currentGoods: {
        title: good.name,
        img: good.img,
        retrievePrice: good.retrievePrice,
        type: good.type,
        probability: good.probability,
      },
      showImageModal: true,
    })
  },

  /**
   * 获取结果
   */
  getRewardRes(info) {
    getRewardResult(cloud, info.orderDo.id).then(res => {
      this.dealRewardRes(res.orderGoodsDoList)
      this.requestAllData()
      my.hideLoading()
    })
  },

  /**
   * 处理中奖结果
   */
  dealRewardRes(list, type) {
    // 试一次提示
    if (type === 'try') {}
    let goods = [];
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      if (element.rewardType === 'LAST' || element.rewardType === 'FIRST' || element.rewardType.indexOf('CJ_') !== -1) {
        continue
      }
      let goodData = {
        img: element.picUrl,
        price: element.retrievePrice,
        word: this.data.rewardTypeMap[element.rewardType],
        number: element.number,
        name: element.goodsName || element.rewardName,
      }
      goods.push(goodData)
    }
    this.showAwardRes(goods, type)
  },

  /**
   * 关闭订单
   */
  closeOrder(info) {
    closeOrder({
      orderId: info.orderDo.id
    }).then(res => {
      // console.log(res)
    })
  },

  /**
   * 显示中奖结果
   */
  showAwardRes(list, num) {
    this.awardResDialogRef.show(list, num || this.data.buyNum);
  },
  // 关闭抽赏弹窗
  closeAwardRes() {
    this.setData({
      showOpen: false,
    })
  },

  /**
   * 显示用户服务协议条款
   */
  showBuyRule() {
    this.setData({
      noticeTitle: '用户服务协议条款',
      noticeWord: this.data['USER_BUY_PACT']
    })
    this.noticeDialogRef.show();
  },

  /**
   * 显示购买说明
   */
  showRule() {
    this.setData({
      noticeTitle: this.data.noticeTitle || '购买说明',
      noticeWord: this.data['INF_BUY_DESC']
    })
    this.noticeDialogRef.show();
  },

  /**
   * 显示支付页面
   */
  showPay(e) {
    let num = Number(e.currentTarget.dataset.num)
    // let data = this.data.IpInfo
    // data.buyNum = num
    const IpInfo = { ...this.data.IpInfo, buyNum: num };
    this.data.buyNum = num
  },

  /**
   * 请求数据
   */
  requestGoodData() {
    const that = this
    my.showLoading({
      mask: true,
    })
    return new Promise((success, fail) => {
      getIpAwardDetail(cloud, { id: this.data.ipId, no: this.data.currentBoxNo }).then(res => {
        if (!res[0].onShelf) {
          my.confirm({
            content: '商品已下架',
            complete() {
              my.switchTab({
                url: '/pages/reward/index/index',
              })
            }
          })
        }
        that.dealIpDetail(res)
        success(true);
      }).catch((e) => {
        fail(e)
      })
    })
  },

  /**
   * 处理IP详情
   */
  dealIpDetail(list) {
    list.sort((a, b) => {
      var order = [
        // 'SP', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
        'UR', 'SSR', 'SR', 'R', 'N'
      ]
      return order.indexOf(a.rewardType) - order.indexOf(b.rewardType)
    })
    let allWeight = 0;
    let weightMap = {};
    let rewardTypeNames = ['全部']
    let probInfo = []
    for (let i = 0; i < list.length; i++) {
      const ele = list[i]
      allWeight += ele.likeNumber
      if (weightMap.hasOwnProperty(ele.rewardTypeName)) {
        weightMap[ele.rewardTypeName] += ele.likeNumber
      } else {
        weightMap[ele.rewardTypeName] = ele.likeNumber
        rewardTypeNames.push(ele.rewardTypeName)
      }
      this.data.rewardTypeMap[ele.rewardType] = ele.rewardTypeName
    }
    let arr = []
    list.forEach(item => {
      arr.push({
        name: item.rewardName,
        type: item.rewardTypeName,
        img: item.rewardImage,
        likeNumber: item.likeNumber,
        retrievePrice: item.retrievePrice,
      })
    })

    let probabilitys = 0
    let count1 = 0
    let probabilityMap = {};
    for (const key in weightMap) {
      let probability = ''
      count1++; 
      if(count1 == Object.keys(weightMap).length){
        probability = imath.accSub(100000, probabilitys)
      }else{
        probability = parseInt(imath.accMul(imath.accDiv(weightMap[key], allWeight), 100000)) // parseInt(weightMap[key] / allWeight * 100000)
        probabilitys += probability
      }
      probInfo.push({
        type: key,
        probability: `概率：${imath.toFixed(imath.accDiv(probability, 1000), 2)}%`
      })
      probabilityMap[key] = `${imath.toFixed(imath.accDiv(probability, 1000), 2)}%`
    }

    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      let probability = imath.accMul(imath.accDiv(element.likeNumber, allWeight), 100) // parseInt(element.likeNumber / allWeight * 100000)
      element.probability = `${imath.toFixed(probability, 2)}%` // `概率：${probability / 1000}'%`

      // for (let j = 0; j < probInfo.length; j++) {
      //   const ele = probInfo[j];
      //   if(ele.type == element.type){
      //     element.probability = ele.probability
      //     break;
      //   }
      // }
    }

    this.setData({
      goods: arr,
      baseGood: list,
      rewardTypeNames: rewardTypeNames,
      loading: false,
      probInfo: probInfo,
      probabilityMap,
    })
    my.hideLoading()
  },

  /**
   * 请求中奖记录数据
   */
  requestAwardListData(searchWord) {
    my.showLoading({
      mask: true,
    })
    let data = {
      goodsId: this.data.ipId,
      currentBox: this.data.currentBoxNo,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    }
    if (this.data.rewardTypeChoseIndex != 0) {
      data.rewardTypeName = this.data.rewardTypeNames[this.data.rewardTypeChoseIndex]
    }
    if (searchWord) {
      data.rewardName = this.data.searchWord
    }
    getRewardRecords(cloud, data).then(res => {
      const { records = [] } = res || {}
      this.dealAwardList(records)
      my.hideLoading()
    })
  },

  /**
   * 处理中奖记录
   */
  dealAwardList(list, type) {
    let arr = []

    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      let nos = [];
      if (element.sequenceStr.indexOf('-') > -1) {
        // const [start, end] = element.sequenceStr.split('-');
        // 原方式遍历会出问题 转成纯数字数组
        let list = element.sequenceStr.split('-');
        list = list.map(Number);
        const  [start, end] = list;
        for(let i = start; i <= end; i++) {
          nos.push(i);
        }
      } else {
        nos = element.sequenceStr.split(',');
      }
      for (let j = 0; j < element.number; j++) {
        let data = {
          name: element.nickname,
          goodType: this.data.rewardTypeMap[element.rewardType],
          goodName: element.rewardName,
          getTime: element.createTime,
          head: element.avatarUrl,
          position: element.position,
          no: nos[element.number - j - 1],
          sp: (element.retrievePrice >= 100 || element.rewardType === 'FIRST' || element.rewardType === 'LAST' || element.rewardType.indexOf('CJ_') != -1),
          avatarBorderUrl: element.avatarBorderUrl,
          level: element.level,
          memberCardTag: element.memberCardTag
        }
        arr.push(data)
      }
    }
    // awardListBox.append(arr)
    this.setData({
      // awardList: arr,
      loading: false
    })
    if (type === 'challenge') {
      if (arr.length > 100) {
        arr = arr.slice(0, 99)
      }
      this.setData({
        animationTime: arr.length,
        rewardChallengeList: arr,
      })

      // console.log(arr);
      // 性能不好，停用此方法
      // this.getScrollList(arr)
      return
    }
    // console.log(this.data.awardList, arr);
    // this.data.awardList.length === 0 &&  ??
    if (arr.length != 0) {
      const awardList = [...this.data.awardList, ...arr]
      this.setData({
        awardList
      })
    }
  },

  /**
   * 判断是否需要授权
   */
  jadgeAuth() {
    const userInfo = getUserInfo()
    if (!userInfo.nickname) {
      this.setData({
        showAuthMask: true
      })
    } else {
      this.setData({
        showAuthMask: false,
        showAuth: false
      })
    }
  },

  /**
   * 限售条件
   */
  isShowConditionTip(saleDate, memberLevelMin, currentUserMemberLevel) {
    const currentTimeStamp = new Date().getTime();
    const saleDateTimeStamp = new Date(saleDate.replace(/-/g, '/')).getTime();
    let conditionTipText = '';
    let showConditionTip = false;
    if (saleDateTimeStamp > currentTimeStamp) {
      conditionTipText = `${saleDate.split(' ')[0].replace(/-/g, '.')}开售`;
      showConditionTip = true;
    } else if (memberLevelMin > (currentUserMemberLevel || 0)) {
      conditionTipText = `VIP等级${memberLevelMin}以上可购买`;
      showConditionTip = true;
    }
    return { showConditionTip, conditionTipText }
  },

  /**
   * 请求IP详情
   */
  requestIpDetail() {
    return new Promise((success, fail) => {
      getIpDetail(cloud, this.data.ipId).then(res => {
        const { goodsIpDo = {}, postcardDo = {}, postcardTotal = 0  } = res || {}
        goodsIpDo.saleDate = goodsIpDo.saleDate.split(' ')[0]
        // res.data.goodsIpDo.saleDate = res.data.goodsIpDo.saleDate.split(' ')[0]
        if (!goodsIpDo.onShelf) {
          my.confirm({
            content: '商品已下架',
            complete() {
              // my.navigateBack(-1)
              my.switchTab({
                url: '/pages/reward/index/index',
              })
            }
          })
        }
        my.setNavigationBar({
          title: goodsIpDo.goodsName
        })
        const { showConditionTip, conditionTipText } = this.isShowConditionTip(goodsIpDo.saleDate, goodsIpDo.memberLevelMin, goodsIpDo.currentUserMemberLevel)
        this.getNotice('INF_BUY_DESC', goodsIpDo)
        const postcardInfo = {
          ...postcardDo,
          postcardTotal
        }
        this.setData({
          bagDevilInfo: res ? (res.bagDevilDo || {}) : {},
          showConditionTip, 
          conditionTipText,
          IpInfo: goodsIpDo,
          postcardInfo,
          lotteryNum: goodsIpDo.rewardNumberConf ? goodsIpDo.rewardNumberConf.split(',') : [],
          useGoodsCoupon: goodsIpDo.useGoodsCoupon,
          rewardType: goodsIpDo.rewardType,
          // 清理缓存
          btnsListNum: JSON.parse(JSON.stringify(this.data.btnsList)),
          selectCoupons: [],
        })
        // 判断能不能使用卡券
        if (goodsIpDo.useGoodsCoupon) {
          // 获取券列表
          this.getCList()
        }
        this.stop()
        // 是否开启计时器
        this.filterTime()
        success()
      }).catch((error) => {
        my.hideLoading()
        fail(error)
      })
    })
  },

  /**
   * 请求所有数据
   */
  requestAllData() {
    if (this.data.choseType == 3) {
      this.resetPageSize()
      this.requestGoodData().then(res => {
        this.requestAwardListData();
      });
    } else {
      let funcA = this.requestIpDetail()
      let funcB = this.requestGoodData()
      Promise.all([funcA, funcB]).then(res => {
        if (!this.data.IpInfo.isBagDevilType) {
          this.data.noticeInfoItems = []
          this.data.noticeCount = 0
          // this.requestNoticeInfo()
        } else {
          this.getDevilInfo();
          this.dealUpInfo();
        }
      });
    }
  },

  /**
   * 处理Up信息
   */
  dealUpInfo(){
    let times = 0;
    let every = this.data.bagDevilInfo.eachRoundWeights
    let base = this.data.bagDevilInfo.likeNumber
    let type = this.data.bagDevilInfo.rewardType
    let now = 1
    let list = this.data.baseGood
    let info = this.data.devilInfo
    info.ups = []
    info.upsNum = 0

    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      if (element.rewardType == type){
        now = element.likeNumber
        break;
      }
    }
    times = parseInt((now - base) / every)
    info.upsNum = times - 8
    times = times > 9 ? 9 : times

    for (let i = 0; i < times; i++) {
      info.ups.push('1')
    }
    
    this.setData({
      devilInfo: info
    })
  },

  /**
   * 处理魔王信息
   */
  dealDevilInfo(data){
    let info = { ...this.data.devilInfo || {} }
    const { avatarUrl, nickname, downOrderId, createTime } = data || {}
    // console.log(createTime);
    if (downOrderId === null) {
      info = { ...this.data.devilInfo, avatarUrl, nickname, downOrderId }
      info.time = '已占领' + timeFormatter(createTime.replace(/-/g,'/'))
    }
    this.setData({
      devilInfo: info
    })
  },

  /**
   * 获取魔王信息
   */
  getDevilInfo(){
    let data = {
      pageSzie: 1,
      pageNo: 1,
      goodsId: this.data.ipId,
      currentBox: this.data.currentBoxNo,
    }
    getDevilInfo(cloud, data).then(res => {
      const { records = [] } = res || {}
      this.dealDevilInfo(records[0])
    })
  },

  /**
   * 请求飘屏幕信息
   */
  requestNoticeInfo() {
    var count = this.data.noticeCount
    if (count < this.data.rewardTypeNames.length && this.data.noticeInfoItems.length < 6) {
      this.requestAwardInfo(count).then(res => {
        this.requestNoticeInfo()
        this.data.noticeCount++
      })
    } else {
      this.setData({
        noticeInfo: this.data.noticeInfoItems
      })
    }
  },

  /**
   * 请求中奖信息
   */
  requestAwardInfo(index) {
    return new Promise((resolve, reject) => {
      my.showLoading({
        mask: true,
      })
      let data = {
        goodsId: this.data.ipId,
        currentBox: this.data.currentBoxNo,
        pageNo: 1,
        pageSize: 6 - this.data.noticeInfoItems.length,
        rewardTypeName: this.data.rewardTypeNames[index]
      }
      getRewardRecords(cloud, data).then(res => {
        let list = this.data.noticeInfoItems
        list = list.concat(res.records)
        this.data.noticeInfoItems = list
        my.hideLoading()
        resolve()
      })
    })
  },
  // 挑战记录
  getChallengeList() {
    return new Promise((resolve, reject) => {
      let data = {
        goodsId: this.data.ipId,
        currentBox: this.data.currentBoxNo,
        pageNo: 1,
        pageSize: 100,
      }
      getRewardRecords(cloud, data).then(res => {
        this.dealAwardList(res.records, 'challenge')
        // this.setData({
        //   rewardChallengeList: res
        // })
        resolve()
      })
    })
  },

  /**
   * 获取公告
   */
  async getNotice(key, goodsIpDo) {
    if (goodsIpDo) {
      if (this.data.getRule) return
      const { rewardType, isPoints, openGift, hasDeficit } = goodsIpDo
      const { YIFAN_SHANG, SHUANGSUIJI, LEIWANG, QUANJU, QUANWANG, WUXIAN_MOWANG, POINT } = rules.urls
      let current = { title: '', url: '' }
      if (rewardType === 0 && isPoints === 0) { // 一番赏
        key = 'reward_one_rule'
      } else if(rewardType === 1 && !hasDeficit && isPoints === 0) { // 双随机
        key = 'reward_two_rule'
      } else if(rewardType === 2 && openGift === OPEN_GIFT.ON && isPoints === 0) { // 拳王
        key = 'reward_quanwang_rule'
      } else if(rewardType === 2 && isPoints === 1) { // 积分
        key = 'reward_point_rule'
      } else if(rewardType === 2 && isPoints === 0) { // 全局赏
        key = 'reward_all_rule'
      } else if(rewardType === 3) { // 无限赏 || 魔王赏
        key = 'reward_mowang_rule'
      } else if(hasDeficit && rewardType === 1 && isPoints === 0) { // 雷王
        key = 'reward_lw_rule'
      } else if (isPoints === 1) { // 积分赏
        key = 'reward_point_rule'
      }
      getNotice(cloud, key).then(res => {
        let text = ''
        parse(res.keyValue, (err, htmlData) => {
          // console.log(err, htmlData);
          if (!err) {
            text = htmlData
          }
        })
        this.setData({
          noticeTitle: res.keyName,
          INF_BUY_DESC: text || res.keyValue,
          isRichText: true,
          getRule: true,
        })
      })

      return;
    }
    if (key === 'USER_BUY_PACT') {
      this.data[key] = agreementWord
      return
    }
    getNotice(cloud, key).then(res => {
      this.data[key] = res.keyValue
    })
  },

  /**
   * 开始请求数据
   */
  requestReadyData() {
    this.jadgeAuth()
    // this.requestIpDetail()
    // this.getChallengeList()
    this.requestAllData()
    this.getUserAcountInfo()
    // 获取店铺id
    this.getStoreOwnerId();
    // 淘宝初始化问题严重
    const filters = [ {label: "扭蛋池预览",val: 1,act: "act"}, {label: "中赏记录",val: 3, act: ""}]
    this.setData({
      filters,
    })
  },

  /**
   * 初始化中奖记录的页面
   */
  initAwardListBox() {
    // awardListBox = createRecycleContext({
    //   id: 'awardListBox',
    //   dataKey: 'awardList',
    //   page: this,
    //   itemSize: () => {
    //     return {
    //       width: awardListBox.transformRpx(694),
    //       height: awardListBox.transformRpx(96)
    //     }
    //   }
    // })

    // let query = my.createSelectorQuery();
    // query.select('.switchBox').boundingClientRect(rect => {
    //   let height = rect.height;
    //   // console.log(height)
    //   this.setData({
    //     awardListHeight: height
    //   })
    // }).exec();
  },

  /**
   * 不能移动
   */
  noMove() {
    return
  },
  
  /**
   * 获取用户账户信息
   */
  getUserAcountInfo() {
    userDetail(cloud).then(res => {
      this.setData({
        userAccountInfo: res
      })
      // console.log(res);
    })
  },

  // 获取券列表
  getCList() {
    batchCouponList(cloud, {
      singleAmountEqual: this.data.IpInfo.everyDrawPrice,
      amountEqualSet: [1,3,5,10],
      expireAsc: true,
    }).then(res => {
      let btnsListNum = this.data.btnsListNum
      let btnsList = this.data.btnsList
      let selectCoupons = []
      
      if (Object.keys(res.couponUserMap).length === 0) {
        btnsListNum = JSON.parse(JSON.stringify(btnsList))
      } else {
        btnsList.forEach((item, i)=>{
          let ele = 0
          if (res.couponUserMap.hasOwnProperty(item)) {
            selectCoupons.push({
              buyNum: item,
              couponId: res.couponUserMap[item].couponId,
              id: res.couponUserMap[item].id
            })
            ele = imath.accSub(item, res.couponUserMap[item].reduceAmountNum)
            btnsListNum[i] = parseInt(ele)
          } else {
            btnsListNum[i] = item
          }
        })
      }
      
      // console.log(selectCoupons);
      this.setData({
        btnsListNum,
        selectCoupons,
        couponTotal: res.couponSize || 0,
        couponUserMap: res.couponUserMap
      })
      // console.log(res);
    })
  },
  // 关闭优惠券弹窗
  closePayCoupon() {
    this.setData({
      showPayCoupon: false
    })
  },

  /**
   * 魔王榜
   */
  async getDemonList(){
    const userInfo = getUserInfo()
    const data = await getDemonList(cloud, { goodsId: this.data.ipId, currentBox: this.data.currentBoxNo });
    const { button: bottom, list: demonList, top = {} } = data;
    this.setData({
      showDemonModal: true,
      top,
      bottom: bottom || { nickname: userInfo.nickname, avatarUrl: userInfo.avatarUrl || '/images/icon/common/head.png', avatarBorderUrl: userInfo.avatarBorderUrl || '' },
      demonList
    })
  },

  /**
   * 打开魔王榜弹窗
   */
  openDemonModal() {
    // this.getDemonList();
    my.navigateTo({
      url: `/pages/reward/demon/demon?goodsId=${this.data.ipId}&currentBox=${this.data.currentBoxNo}`
    })
  },

  // 获取noticeDialo实例
  saveNoticeDialogRef(ref) {
    this.noticeDialogRef = ref
  },

  defaultDialogRef(ref) {
    this.defaultRef = ref
  },
  
  payCouponRef(ref) {
    this.payCouponRef = ref
  },

  // 获取awardResDialog实例
  saveAwardResDialogRef(ref) {
    this.awardResDialogRef = ref
  },

  // 规则弹窗
  showDialog() {
    this.setData({
      noticeTitle: this.data.noticeTitle || '购买说明',
      noticeWord: this.data['INF_BUY_DESC']
    })
    this.defaultRef.show()
  },
  // 关闭公共弹窗
  closeRuleDialog() {
    this.setData({
      showDefaultDialog: false
    })
  },

  // 选择模式
  onChooseMode() {
    this.setData({
      showChooseMask: !this.data.showChooseMask
    })
  },
  closeChoose(e) {
    let nowMode = this.data.nowMode
    if (e.currentTarget.dataset.info) {
      nowMode = e.currentTarget.dataset.info.name
    }
    
    this.setData({
      nowMode,
      modeImg: nowMode === '金币抽取' ? '/images/reward/inf/modeCoin.png' : '/images/reward/inf/modeCard.png',
      showChooseMask: false,
    })
  },

  // 显示减免券列表
  chooseCoupon() {
    const { nowMode } = this.data
    if (nowMode === '金币抽取') {
      my.showToast({
        content: '仅明信片抽取模式可用',
      })
      return
    }
    const IpInfo = { ...this.data.IpInfo };
    this.payCouponRef.show({ IpInfo });
  },
  // 显示任务弹窗
  showTask() {
    this.setData({
      showDailyTaskDialog: true
    })
  },
  // 关闭弹窗
  closeDialog(key) {
    this.setData({
      [key]: false
    })
  },
  // 获取淘宝店铺信息
  async getTaoBaoStoreInfo() {
    const { followed, followPoint } = await fetchTaoBaoStoreInfo(cloud);
    this.setData({
      showFollowDialog: !followed,
      followModalContent: `关注店铺既得${followPoint}积分哦！`,
      followPoint,
      followStore: followed
    })
  },
  // 获取商户拥有者id
  async getStoreOwnerId() {
    const { keyValue } = await getNotice(cloud, 'TB_SALE_ID');
    this.setData({
      storeOwnerId: +keyValue || null
    }, () => {
      // 获取店铺信息
      this.getTaoBaoStoreInfo()
    })
  },

  // 滚动数据
  getScrollList(arr) {
    let lineArray = arr;
    // let lineArray = [
    //   {name: '111'},
    //   {name: '111'},
    //   {name: '111'},
    // ];
    if (lineArray.length > 3) {
      // 当行数大于5的时候滚动轮播
      this.setData({
        totalHeight: 5 * 40
      })
      let that = this
      interval1 = setInterval(function () {
        that.setData({
          move: that.data.move + 1,
        })
      }, 60)
      interval2 = setInterval(function () {
        let detail = []
        for (let i = 1; i < that.data.rewardChallengeList.length; i++) {
          detail.push(that.data.rewardChallengeList[i])
        }
        detail.push(that.data.rewardChallengeList[0])
        that.setData({
          rewardChallengeList: detail,
          move: 0,
        })

      }, 2400)
      // 684/18 = 38(一行的高度)
    } else {
      this.setData({
        totalHeight: lineArray.length * 40 + 40
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.noticeDialog = this.selectComponent('#noticeDialog')
    // this.awardResDialog = this.selectComponent('#awardResDialog')
    this.initAwardListBox()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (options.id) app.globalData.choseIp.id = options.id
    // if (options.no) app.globalData.choseIp.no = options.no
    this.setData({
      ipId: +options.id,
      currentBoxNo: options.no ? +options.no : 1
    }, () => {
      this.requestReadyData();
      this.ifCollect();
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // // 获取当前小程序的页面栈
    // const pages = getCurrentPages();
    // // 数组中索引最大的页面--当前页面
    // const currentPage = pages[pages.length-1] || {};
    // const options = currentPage.options || {};
    this.getChallengeList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(interval1)
    clearInterval(interval2)
    this.stop()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(interval1)
    clearInterval(interval2)
    this.stop()
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
  onShareAppMessage: function (obj) {
    const { from } = obj
    const { openId = '' } = getUserInfo();
    console.log(from);
    if (from === 'menu') {
      return {
        title: this.data.IpInfo.goodsName,
        path: `pages/reward/infInfo/infInfo?id=${this.data.ipId}&no=${this.data.currentBoxNo}&pid=${openId}`,
        // imageUrl: this.data.IpInfo.mediumImage
        imageUrl: 'https://chujiangupload.oss-cn-beijing.aliyuncs.com/tb-static/special-img/reward/share2.png',
      }
    } 
    return {
      title: '核玩扭蛋机', // 标题
      desc: '邀请好友赢积分~', // 描述
      path: `pages/reward/index/index?pid=${openId}`,
      imageUrl: 'https://chujiangupload.oss-cn-beijing.aliyuncs.com/tb-static/special-img/reward/share2.png',
      success(res){
        console.log('success', res);
      },
      fail(res){
        console.log('fail',res)
      },
    }
  },

  /**
   * 关闭弹窗
   */
  imageModalClose: function ()  {
    this.setData({
      currentImgUrl: '',
      showImageModal: false,
    })
  },
  /**
   * 关闭魔王榜弹窗
   */
  closeDemonModal() {
    this.setData({
      showDemonModal: false
    })
  }
})