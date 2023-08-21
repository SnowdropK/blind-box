import { fetchBanners as getNewBannerList, fetchIps as getIpList, fetchTaoBaoStoreInfo, followTaoBaoStore, getUnlimitCategoryList } from '../../../common/api/reward.js'
import { fetchNotice } from '../../../common/api/notice'

const app = getApp();
const { cloud, getUserInfo } = app

Page({

  /**
   * 页面的初始数据
   */
  data: {
    filters: [],
    banners: [{
      img: '/images/banner.jpg',
      id: null
    }],
    Ips: [],
    noticeWord: "公告",
    params: {
      pageNo: 1,
      pageSize: 8,
      rewardType: 3
    },
    infoForm: {
      categoryId: null,
      goodsMark: null, //0-无 1-火爆 2-推荐 3-售罄
      goodsName: null,
      isRecommend: null, //0-否 1-是
      rewardType: null //0-一番赏 1-双随机 2-吃鸡
    },
    loading: true,
    newDialogShow: false,
    filters2: [{
      label: "发售",
      param: 'saleDateSort',
      value: ''
    },{
      label: "热度",
      param: 'browseCountSort',
      value: ''
    },{
      label: "价格",
      param: 'priceSort',
      value: ''
    }],
    filterIndex2: -1,
    // showAdvertiseDialog: false,
    showFollowDialog: false,
    // bannerData: {},
    level: null,
    sumCount: 0,
    showEndTip: false,
    scrollHeight: 0,
    scrollLoading: false,
    taskX: 750,
    taskY: 1100,
    showExpand: false,
    storeOwnerId: '',
    showDailyTaskDialog: false,
    followPoint: 0,
    followStore: false
  },

  // 监听轮播变化
  changeSwiper(e) {
    this.setData({
      newIndex: e.detail.current || 0
    })
  },

  /**
   * 去详情页面
   */
  gotoDetail(e) {
    let info = e.target.dataset.info || {}
    // if (info.sellOut) return
    if (!info.id) return
    if (info.type === "link") {
      //跳转外链
      if (info.jumpValue.indexOf('http') > -1) {
        let url = info.jumpValue;
        my.navigateTo({
          url: `/pages/webview/webview?url=${encodeURIComponent(url)}`,
        });
      }
    } else {
      // 无限赏
      my.navigateTo({
        url: `/pages/reward/infInfo/infInfo?id=${info.id}&no=${info.currentSaleBoxNumber || 1}`,
      })
    }
  },

  /**
   * 筛选
   */
  switchFilter(e){
    const { item = {}, index } = e.target.dataset;
    // let info = this.data.filters2
    // let item = info[index]
    
    const nextFilters2 = this.data.filters2.map(filterItem => {
      if (item.param === filterItem.param) {
        if (item.value == 'DESC') {
          filterItem.value = 'ASC'
        } else {
          filterItem.value = item.value == 'ASC' ? '' : 'DESC'
        }
      } else {
        filterItem.value = ''
      }
      return filterItem;
    })

    this.setData({
      filterIndex2: item.value == 'DESC' ? index : (item.value == 'ASC' ? -1 : index),
      filters2: nextFilters2,
      showEndTip: false,
      showExpand: !this.data.showExpand
    }, () => {
      const params = { pageNo: 1, [item.param]: item.value == 'DESC' ? 'ASC' : (item.value == 'ASC' ? '' : 'DESC')};
      this.requestData(params);
    })
  },

  /**
   * 分类
   */
  switchView(e) {
    const { item = {} } = e.target.dataset;
    const nextFilters = this.data.filters.map(filterItem => {
      if (item.val === filterItem.val) {
        filterItem.act = item.act ? '' : 'act'
      } else {
        filterItem.act = ''
      }
      return filterItem;
    })

    this.setData({
      filters: nextFilters,
      showEndTip: false,
      searchWord: ''
    }, () => {
      this.requestData({ pageNo: 1, categoryId: item.act ? '' : item.val })
    })
  },

  /**
   * 获取类目数据
   */
  async getCategoryList() {
    const data = await getUnlimitCategoryList(cloud);
    if (data && data.length > 0) {
      let arr = []
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        let imgUrl = (element.imageUrl && element.imageUrl.indexOf('http') > -1) ? element.imageUrl : "/images/icon/common/head.png";
        arr.push({
          label: element.name,
          val: element.id,
          act: '',
          img: imgUrl,
          new: element.isNew
        })
      }
      this.setData({
        filters: arr
      })
    }
  },

  /**
   * 搜索IP
   */
  searchIp(e) {
    const { type } = e.target.dataset;
    // const loadingType = type && type === 'scroll' ? 'scrollLoading' : 'loading';
    this.setData({showEndTip: false}, () => {
      this.requestData({ pageNo: 1 })
    })
  },

  /**
   * 请求更多数据
   */
  requestMoreData() {
    const params = {
      pageNo: this.data.params.pageNo + 1
    }
    this.requestData(params)
  },

  /**
   * 渲染banner
   */
  renderBanner(data) {
    if (data.length <= 0) return
    let arr = []
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      arr.push({
        img: element.bannerImage || '/images/banner.jpg',
        id: element.id,
        sellOut: element.goodsMark == 3,
        currentSaleBoxNumber: element.currentSaleBoxNumber,
        type: 'wxapp', //代表跳转小程序内页
      })
    }
    //合并banner
    if (arr.length > 0) {
      let olderBanner = JSON.parse(JSON.stringify(this.data.banners));
      let newBanner = olderBanner.concat(arr);
      this.setData({
        banners: newBanner
      })
    }
  },

  /**
   * 获取banner list 需要和之前的banner列表合并
   * @param {*} barr bannerlist 
   */
  getNewbannerList() {
    getNewBannerList(cloud).then(res => {
      let data = [ ...res ];
      if (data.length > 0) {
        let arr = []
        for (let i = 0; i < data.length; i++) {
          const element = data[i];
          let imgUrl = (element.bannerUrl && element.bannerUrl.indexOf('http') > -1) ? element.bannerUrl : '/images/banner.jpg';
          arr.push({
            img: imgUrl,
            id: element.id,
            jumpType: element.jumpType,
            jumpValue: element.jumpValue,
            type: 'link', //代表跳转外链
          })
        }
        this.setData({
          banners: arr
        })
      }
    })
  },

  /**
   * 渲染列表
   */
  renderList(pageNo, data) {
    const nextIps = pageNo && pageNo === 1 ? [] : this.data.Ips;
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      // 过滤隐藏的ip
      if (element.isHide) {
        continue;
      }
      let now = new Date(new Date().toLocaleDateString()).getTime();
      let date = element.saleDate ? new Date(element.saleDate.replace(/-/g, '/')).getTime() : now;
      nextIps.push({
        id: element.id,
        name: element.goodsName,
        new: (i == 0 || i == 1),
        saleOpen: element.saleOpen,
        img: element.smallImage,
        date: element.saleDate ? element.saleDate.split(' ')[0] : '待定',
        price: element.everyDrawPrice || '待定',
        num: element.onSaleBoxNumber,
        total: element.boxNumber,
        isPoints: element.isPoints,
        sellOut: element.goodsMark == 3,
        rewardType: element.rewardType,
        currentSaleBoxNumber: element.currentSaleBoxNumber,
        hasDeficit: element.hasDeficit,
        isBagDevilType: element.isBagDevilType,
        browseCount: element.browseCount,
        label: date > now ? '预售' : '现货',
        mode: element.mode,
        openGift: element.openGift,
        rewardOrderBagDevilRecordDo: element.rewardOrderBagDevilRecordDo || {}
      })
    }
    this.setData({
      Ips: nextIps,
      loading: false,
      showEndTip: false
    })
  },

  /**
   * 过滤已选择筛选条件参数
   * @param {*} params 
   */
  filterParams(params, resetParams = {}) {
    const SORT_KEY = ['saleDateSort', 'browseCountSort', 'priceSort'];
    const filters = SORT_KEY.filter(key => resetParams[key]);
    const currentKey = filters[0] || '';
    if (!!currentKey) {
      SORT_KEY.forEach(key => {
        if (key !== currentKey) {
          delete params[key];
        }
      })
    }
    return params;
  },

  /**
   * 请求数据
   */
  requestData(resetParams = {}, loadingType = 'loading') {
    if (this.data.loading && this.data.params.pageNo !== 1) return;
    // 到底了则无需再请求
    if (this.data.showEndTip) return;
    // isPoints: 0
    const params = { ...this.filterParams(this.data.params, resetParams), ...resetParams };
    this.setData({
      resetParams,
      [loadingType]: true
    })
    my.showLoading({
      mask: true,
    })
    getIpList(cloud, params).then(res => {
      const { records = [] } = res || {};
      // params.pageNo = records.length > 0 ? params.pageNo : this.data.params.pageNo
      my.hideLoading();
      this.setData({
        params
      }, () => {
        if (records.length > 0 || params.pageNo === 1 ) {
          this.renderList(params.pageNo, records);
        } else {
          this.setData({
            [loadingType]: false,
            scrollLoading: false,
            showEndTip: true
          })
        }
      })
    }).catch(() => {
      my.hideLoading()
      this.setData({
        [loadingType]: false
      })
    })
  },

  async requestBanner(params) {
    params.isPoints = 0
    getIpList(cloud, params).then(res => {
      const { records = [] } = res || {};
      this.renderBanner(records);
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
        const rect = my.createSelectorQuery().select('.rewardIndexScrollBox').boundingClientRect();
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

  // 获取淘宝店铺信息
  async getTaoBaoStoreInfo() {
    const { followed, followPoint, followSwitch } = await fetchTaoBaoStoreInfo(cloud);
    this.setData({
      showFollowDialog: followSwitch && !followed,
      followModalContent: `关注店铺即得${followPoint}积分哦！`,
      followPoint,
      followStore: followed
    })
  },

  /**
   * 获取商户拥有者id
   */
  async getStoreOwnerId() {
    const { keyValue } = await fetchNotice(cloud, 'TB_SALE_ID');
    this.setData({
      storeOwnerId: +keyValue || ''
    })
  },

  /**
   * 关闭弹窗
   */
  closeDialog(key) {
    this.setData({
      [key]: false
    })
  },

  // 关注淘宝店铺：接口
  async followTaoBaoStore() {
    await followTaoBaoStore(cloud)
    this.setData({
      showFollowDialog: false
    })
  },

  /**
   * 关注淘宝店铺
   */
  goToFollow() {
    // 关注
    my.tb.favorShop({
      id: this.data.storeOwnerId,
      success: (res) => {
        my.alert({ content: '关注淘宝店铺成功！' });
        this.followTaoBaoStore();
      },
      fail: (res) => {
        const { errorMessage = '' } = res || {};
        my.alert({ content: JSON.stringify(errorMessage) })
      }
    })
    // 取消关注
    // my.tb.unFavorShop ({
    //   id: this.data.storeOwnerId,
    //   success: (res) => {
    //     my.alert({ content: "取消关注淘宝店铺成功" });
    //   },
    //   fail: (res) => {
    //     my.alert({ content: "fail - " + res.error });
    //   }
    // });
  },

  /**
   * 获取开屏广告
   */
  // async getBanner() {
  //   const bannerVisitTime = my.getStorageSync('bannerVisitTime') || null;
  //   const data = await getBanner(cloud);
  //   if (!bannerVisitTime) {
  //     my.setStorageSync('bannerVisitTime', `${new Date().getTime()}`);
  //     this.setData({
  //       bannerData: data || {},
  //       showAdvertiseDialog: true
  //     })
  //     return;
  //   }
  //   const { showTimeGap } = data || {};
  //   const showTimeGapStamp = imath.accMul(+showTimeGap, 3600000)
  //   const currentTimeGapStamp = imath.accSub(new Date().getTime(), +bannerVisitTime)
  //   if (currentTimeGapStamp >= showTimeGapStamp) {
  //     my.setStorageSync('bannerVisitTime', `${new Date().getTime()}`);
  //     this.setData({
  //       bannerData: data,
  //       showAdvertiseDialog: true
  //     })
  //   }
  // },

  //pid 邀请进入
  postRebate(pid) {
    setTimeout(() => {
      getApp().authUser(pid)
    }, 400)
  },
  //初始化
  onInit() {
    // const userInfo = getUserInfo()
    // const isShow = getGuide() || false
    // let isNew = false
    // if (userInfo && userInfo.isNew) {
    //   isNew = userInfo.isNew
    // }
    // this.setData({
    //   showGuide: isShow,
    //   isNewUserDialog: isNew
    // })
    // this.requestReadyData()
  },
  //监听登录
  watchLogin(value) {
    if (value === 1) {
      this.onInit()
    } else {
      my.showToast({
        type: 'fail',
        content: '用户登陆失败，请刷新！',
        duration: 3000
      });
      my.hideLoading({
        page: this // 防止执行时已经切换到其它页面，page指向不准确
      });
      this.setData({
        isLoading: false
      })
    }
  },

  handleExpand() {
    this.setData({
      showExpand: !this.data.showExpand,
    })
  },

  // 前往战令
  goToWarOrder() {
    my.navigateTo({
      url: `/packageA/pages/ladder/ladder`,
    });
  },
  // 显示任务弹窗
  showTask() {
    this.setData({
      showDailyTaskDialog: true
    })
  },

  /**
   * 刚开始请求数据
   */
  requestReadyData() {
    this.requestData({ goodsMark: 0 });
    // 获取店铺id
    this.getStoreOwnerId();
    // 获取店铺信息
    this.getTaoBaoStoreInfo();
    this.requestBanner({ isRecommend: 1, pageNo: 1, pageSize: 5 });
    this.getNewbannerList();
    this.getCategoryList();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options = {}) {
    my.hideTabBar();
    const pid = options.pid || '';
    this.postRebate(pid)
    this.getScrollHeight();

    // this.getBanner();
    this.requestReadyData();

    // app.watch(() => {
    //   this.watchLogin()
    // })
    // if (app.globalData.isLogin === 1) {
    //   this.getBanner();
    //   this.requestReadyData();
    // } else {
    //   setTimeout(() => {
    //     this.setData({
    //       loading: app.globalData.userState !== 1
    //     })
    //   }, 1000);
    //   app.watch(() => {
    //     this.getBanner();
    //     this.requestReadyData();
    //   })
    // }
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
  // onShareAppMessage: function () {
  //   return app.onShareAppMessage()
  // }
  
  // .js
  // 唤起分享面板
  // showSharePanel(){
  //   my.showSharePanel();
  // },
  // 页面分享事件处理函数
  onShareAppMessage () {
    const { openId = '' } = getUserInfo();
    return {
      title: '核玩扭蛋机', // 标题
      desc: '邀请好友赢积分~', // 描述
      path: `pages/reward/index/index?pid=${openId}`, // 分享的小程序页面
      imageUrl: 'https://chujiangupload.oss-cn-beijing.aliyuncs.com/tb-static/special-img/reward/share2.png',
      success(res){
        console.log('success', res);
      },
      fail(res){
        console.log('fail',res)
      },
    }
  },
})