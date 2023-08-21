import { collectList, delCollect } from '../../../../common/api/user'
const app = getApp();
const { cloud, setChoseIp } = app

Page({
  data: {
    isLoading: false,
    isEnd: false,
    pageNo: 1,
    pageSize: 10,
    total: 0,
    records: []
  },
  onLoad(query) {
    if (app.globalData.isLogin === 1) {
      this.getList()
    } else {
      app.watch(() => {
        this.getList()
      })
    }
  },
  onShow() { },
  //请求数据
  getList(pageNo = 1) {
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
    collectList(cloud, params).then(res => {
      const { records = [], total = 0 } = res || {}
      if (records.length) {
        const list = this.formatList(records)
        const allList = this.data.records.concat(list)
        let isEnd = false
        let newPageNo = pageNo
        if (list.length < this.data.pageSize) {
          isEnd = true
        } else {
          newPageNo = pageNo + 1
        }
        this.setData({
          isEnd,
          total,
          pageNo: newPageNo,
          records: allList
        })
      } else {
        this.setData({
          isEnd: true
        })
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
  //格式化数据
  formatList(data = []) {
    if (data.length < 1) return []
    const arr = []
    data.forEach(item => {
      arr.push({
        id: item.id,
        boxNumber: item.boxNumber,
        goodsId: item.goodsId,
        name: item.goodsName,
        img: item.goodsImage,
        num: item.inventoryNumber,
        total: item.rewardNumber,
        rewardType: item.rewardType,
        sellOut: item.inventoryNumber === 0
      })
    })
    return arr
  },
  /**
   * 获取更多
   */
  requestMoreData() {
    const { pageNo, isEnd } = this.data
    if (isEnd) return
    this.getList(pageNo)
  },
  // 去商品详情
  gotoIpDetail(e) {
    const { boxNumber = 1, goodsId } = e.currentTarget.dataset.info
    setChoseIp({
      id: goodsId,
      no: boxNumber
    })
    my.navigateTo({
      url: `/pages/reward/infInfo/infInfo?id=${goodsId}&no=${boxNumber}`
    })
  },
  // 删除收藏
  delCollect(e) {
    const { boxNumber, goodsId } = e.currentTarget.dataset.info
    if (this.data.isLoading) return
    this.setData({
      isLoading: true
    })
    my.showLoading({
      content: '加载中...',
    });
    let params = {
      boxNumber,
      goodsId
    }
    delCollect(cloud, params).then(res => {
      this.setData({
        isEnd: false,
        isLoading: false,
        pageNo: 1,
        records: []
      })
      this.getList()
      my.showToast({
        type: 'success',
        content: '取消收藏成功',
        duration: 3000
      });
      my.hideLoading({
        page: this // 防止执行时已经切换到其它页面，page指向不准确
      });
      this.setData({
        isLoading: false
      })
    }).catch(e => {
      my.hideLoading()
    })
  }
})