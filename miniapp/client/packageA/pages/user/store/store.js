import { fetchNotice } from '../../../../common/api/notice'
import { pointPostcardList, pointExchangePostcard, pointExchange, userDetail } from '../../../../common/api/user'

const app = getApp();
const { cloud } = app 

Page({
  data: {
    noticeWord: '公告',//公告通知
    point: 0,//积分
    isLoading: false,
    postcardList: [],
    couponList: [],
    changeType: 2, // 兑换类型：1-优惠券；2-明信片, 不传默认为1
    filters: [{
      label: "兑换明信片",
      val: 2,
      act: "act"
    }, {
      label: "兑换减免券",
      val: 1,
      act: ""
    }],
  },
  onLoad(query) {
    const { count } = query
    this.setData({
      point: count
    })
    if (app.globalData.isLogin === 1) {
      this.initPointsData()
      this.getNotice()
      this.requestData()
    } else {
      app.watch(() => {
        this.initPointsData()
        this.getNotice()
        this.requestData()
      })
    }
  },
  onShow() { },
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
  // 初始化数据
  initPointsData() {
    const filters = [{
      label: "兑换明信片",
      val: 2,
      act: "act"
    }, {
      label: "兑换减免券",
      val: 1,
      act: ""
    }]
    this.setData({
      filters
    })
  },
  //获取公告
  getNotice() {
    fetchNotice(cloud, 'POINT_RULE').then(res => {
      const { keyValue = '' } = res || {}
      this.setData({
        noticeWord: keyValue
      })
    })
  },
  //获取数据
  requestData() {
    if (this.data.isLoading) return
    this.setData({
      isLoading: true
    })
    my.showLoading({
      content: '加载中...',
    });
    pointPostcardList(cloud, {
      changeType: this.data.changeType,
    }).then(res => {
      console.log(res);
      this.setData({
        postcardList: res.postcardList || [],
        couponList: res.list || [],
        point: res.point
      })
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
  //查看积分
  gotoPointRecord() {
    my.navigateTo({
      url: `/packageA/pages/user/pointRecord/pointRecord?count=${this.data.point}`
    })
  },
  //获取notice实例
  noticeRef(ref) {
    this.noticeDialog = ref
  },
  // 显示提示弹窗
  showNoticeDialog() {
    this.noticeDialog.show();
  },
  //积分兑换
  exchange(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    if (this.data.isLoading) return
    this.setData({
      isLoading: true
    })
    my.showLoading({
      content: '加载中...',
    });
    let url = ''
    if (this.data.changeType === 1) {
      url = pointExchange(cloud, { id, num: 1 })
    } else {
      url = pointExchangePostcard(cloud, { id, num: 1 })
    }
    url.then(res => {
      my.hideLoading({
        page: this
      });
      setTimeout(() => {
        my.showToast({
          type: 'success',
          content: '兑换成功',
          duration: 2000
        });
      }, 200);
      this.setData({
        isLoading: false
      })
      this.getUserDetail()
      this.requestData()
    }).catch(e => {
      my.hideLoading()
    })
  },
  // 切换兑换卡
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
      filters: arr,
      changeType: chose.val
    })

    this.requestData()
  },
  //获取当前用户详情
  getUserDetail() {
    userDetail(cloud).then(res => {
      const { point = 0 } = res || {}
      this.setData({
        point
      })
    })
  },
})