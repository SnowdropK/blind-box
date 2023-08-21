import { fetchNotice } from '../../../../common/api/notice.js'
import { postcardList } from '../../../../common/api/user'

const app = getApp();
const { cloud } = app 

Page({
  data: {
    isLoading: false,
    count: 0,
    pageNo: 1,
    pageSize: 20,
    isEnd: false,
    list: []
  },
  onLoad(query) {
    const { count = 0 } = query
    this.setData({
      count
    })
    if (app.globalData.isLogin === 1) {
      this.requestData(1)
    } else {
      app.watch(() => {
        this.requestData(1)
      })
    }
  },
  onShow() { },
  //获取数据
  requestData(pageNo) {
    if (this.data.isLoading) return
    this.setData({
      isLoading: true
    })
    my.showLoading({
      content: '加载中...',
    });
    let params = {
      pageNo,
      pageSize: this.data.pageSize
    }
    postcardList(cloud, params).then(res => {
      const { records = [] } = res
      let newList = this.data.list.concat(records)
      let isEnd = false
      let newPageNo = pageNo
      if (records.length < this.data.pageSize) {
        isEnd = true
      } else {
        newPageNo = pageNo + 1
      }
      this.setData({
        list: newList,
        isEnd,
        pageNo: newPageNo
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
  //获取更多数据
  requestMoreData() {
    const { pageNo, isEnd } = this.data
    if (isEnd) return
    this.requestData(pageNo)
  },
  // 去淘宝店铺购买明信片
  toBuy() {
    this.getNotice('TB_ALL_SHOP_URL')
  },
  // 获取店铺url/商品id
  async getNotice(key) {
    await fetchNotice(cloud, key).then(res => {
      this.data[key] = res.keyValue
      // 跳淘宝商品详情页
      my.tb.openDetail ({
      itemId: res.keyValue,
      success: (res) => {
        console.log(res);
      },
      fail: (res) => {
        console.log(res);
        // my.alert({ content: "fail - " + res.errorMessage });
      },
    });
      // my.navigateTo({
      //   url: `/pages/webview/webview?url=${encodeURIComponent(res.keyValue)}`,
      // })
    })
  },
  // 积分兑换
  toPointStore() {
    my.navigateTo({
      url: '/packageA/pages/user/store/store'
    })
  },
  //去首页
  toHome() {
    my.switchTab({
      url: '/pages/reward/index/index'
    })
  }
})