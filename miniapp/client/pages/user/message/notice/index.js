import { NOTICE_INFO_MAP } from '../../../../consts/index'
import { getMessage } from '../../../../common/api/user.js'

const app = getApp();
const { cloud } = app;


Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    logo: '',
    type: '',
    messageParams: {
      pageNo: 1,
      pageSize: 10
    },
    noticeList: [],
    scrollHeight: 0,
    loading: true
  },

  goBack() {
    my.navigateBack({
      delta: 1
    })
  },
  onLoad(options) {
    const { type = '' } = options;
    const { title = '', img } =  NOTICE_INFO_MAP[type] || {};
    my.setNavigationBar({
      title
    })
    this.setData({
      type,
      title,
      logo: img || ''
    });
    this.getScrollHeight();
    if (app.globalData.isLogin === 1) { // 登录已完成
      this.getList({type});
    } else {
      app.watch(() => {
        this.getList({type});
      })
    }
  },
  onShow() {
    if(this.data.type) {
      this.getList({ pageNo: 1, type: this.data.type });
    }
  },
  /**
   * 滚动区高度
   */
  getScrollHeight() {
    const that = this;
    my.getSystemInfo({
      success: function(res) {
        const windowHeight = res.windowHeight;
        const rect = my.createSelectorQuery().select('.commonNoticeScrollBox').boundingClientRect();
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
   * 消息列表
   * @param {*} params 
   */
  async getList(params = {}) {
    my.showLoading({
      title: '加载中',
    })
    this.setData({
      loading: true
    })
    const messageInfo = await getMessage(cloud, { ...this.data.messageParams, ...params });
    const noticeList = (messageInfo || {}).records || [];
    const messageParams = { ...this.data.messageParams, ...params };
    this.setData({
      noticeList: messageParams.pageNo === 1 ? [ ...noticeList ] : [ ...this.data.noticeList, ...noticeList ],
      messageParams,
      loading: false
    })
    my.hideLoading()
  },
  /**
   * 请求更多数据
   */
  requestMoreData() {
    this.getList({ pageNo: this.data.messageParams.pageNo + 1 })
  },
})

