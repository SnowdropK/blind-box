import { userPoint } from '../../../../common/api/user'
const { cloud } = getApp();

Page({
  data: {
    filters: [{
      label: "全部",
      val: '',
    }, {
      label: "收入",
      val: 'INCREASE',
    }, {
      label: "花费",
      val: 'DECREASE',
    }],
    pointAccount: 0,
    isLoading: false,
    tradeType: '',
    pageNo: 1,//当前页
    pageSize: 20,//一页数
    isEnd: false,//是否请求完
    records: []
  },
  onLoad(query) {
    const { count = 0 } = query || {}
    this.setData({
      pointAccount: count
    })
    this.getPoint({
      pageNo: 1,
      pageSize: 20
    })
  },
  onShow() { },
  /**
   * 获取积分明细
   */
  getPoint({ pageNo = 1, pageSize = 20, tradeType = null }) {
    if (this.data.isLoading) return
    this.setData({
      isLoading: true
    })
    my.showLoading({
      content: '加载中...',
    });
    let params = {
      pageNo,
      pageSize
    }
    if (tradeType) {
      params['tradeType'] = tradeType
    }
    userPoint(cloud, params).then(res => {
      const { records = [], total } = res || {}
      if (records.length) {
        const list = this.formatPoints(records)
        const allList = this.data.records.concat(list)
        let isEnd = false
        let newPageNo = pageNo
        if (list.length < pageSize) {
          isEnd = true
        } else {
          newPageNo = pageNo + 1
        }
        this.setData({
          total,
          isEnd,
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
  /**
   * 格式化数据
   */
  formatPoints(data = []) {
    if (data.length < 1) return []
    const arr = []
    data.forEach(item => {
      arr.push({
        type: item.tradeType == 1 ? "收入" : '花费',
        tradeDesc: item.tradeDesc,
        creatTime: item.createTime,
        num: item.point
      })
    })
    return arr
  },
  /**
   * 获取更多商品
   */
  requestMoreData() {
    const { pageNo, pageSize, tradeType, isEnd } = this.data
    if (isEnd) return
    this.getPoint({
      pageNo,
      pageSize,
      tradeType
    })
  },
  /**
  * 切换分类
  */
  changeCategory(e) {
    if (this.data.isLoading) return
    const { currentTarget: { dataset: { val: id = '' } = {} } = {} } = e || {}
    if (id !== this.data.tradeType) {
      this.setData({
        pageNo: 1,//当前页
        isEnd: false,//是否请求完
        tradeType: id,
        records: []
      })
      this.getPoint({
        pageNo: 1,
        pageSize: 20,
        tradeType: id
      })
    }
  },
})