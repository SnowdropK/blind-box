// 常量
import { NOTICE_TYPE_MAP } from '../../../consts/index'
// utils
import { accAdd } from '../../../common/js/base/math'
// service
import { getUnreadCount, getMessage, markNoticeRead } from '../../../common/api/user'

const app = getApp();
const { cloud } = app;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeLogos: [
      { id: NOTICE_TYPE_MAP.SYSTEM, title: '系统通知', img: './images/system.png', num: 0 },
      // { id: NOTICE_TYPE_MAP.ACTIVITY, title: '活动通知', img: './images/activity.png', num: 0 },
      // { id: NOTICE_TYPE_MAP.REWARD, title: '抽赏通知', img: './images/reward.png', num: 0 }
    ],
    noticeList: [],
    activityMsgUnreadCount: 0, 
    rewardMsgUnreadCount: 0, 
    sysMsgUnreadCount: 0,
    sumCount: 0,
    messageParams: {
      pageNo: 1,
      pageSize: 10
    },
    scrollHeight: 0,
    loading: true
  },
  onLoad() {
    // if (app.globalData.hasLogin) { // 登录已完成
    //   this.getUnreadCount();
    //   this.getList();
    // } else {
    //   app.watch(() => {
    //     this.getUnreadCount();
    //     this.getList();
    //   })
    // }
    this.getScrollHeight();
  },
  onShow() {
    this.getUnreadCount();
    this.getList({ pageNo: 1 });
  },
  /**
   * 滚动区高度
   */
  getScrollHeight() {
    const that = this;
    my.getSystemInfo({
      success: function(res) {
        const windowHeight = res.windowHeight;
        const rect = my.createSelectorQuery().select('.messageScrollBox').boundingClientRect();
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
   * 未读数据
   */
  async getUnreadCount() {
    const { unreadCountInfo } =  await getUnreadCount(cloud);
    const { sysMsgUnreadCount, activityMsgUnreadCount, rewardMsgUnreadCount } = unreadCountInfo || {};
    const sumCount = accAdd(accAdd(activityMsgUnreadCount, rewardMsgUnreadCount), sysMsgUnreadCount);
    const nextNoticeLogos = this.data.noticeLogos.map((item, index) => {
      item.num = [sysMsgUnreadCount, activityMsgUnreadCount, rewardMsgUnreadCount][index]
      return item;
    });
    this.setData({
      sumCount,
      noticeLogos: nextNoticeLogos,
    })
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
    const { records } = await getMessage(cloud, { ...this.data.messageParams, ...params });
    const messageParams = { ...this.data.messageParams, ...params }
    const noticeList = records || [];
    this.setData({
      noticeList: messageParams.pageNo === 1 ? [...noticeList] : [ ...this.data.noticeList, ...noticeList ],
      messageParams,
      loading: false
    });
    my.hideLoading()
  },
   /**
   * 请求更多数据
   */
  requestMoreData() {
    this.getList({ pageNo: this.data.messageParams.pageNo + 1 })
  },
  /**
   * 查看消息
   */
  goToNotice(e) {
    const { item } = e.currentTarget.dataset
    my.navigateTo({
      url: `/pages/user/message/notice/index?type=${item.id}`,
    })
  },
  /**
   * 清除未读消息
   * @param {*} msgId 
   * @param {*} type 
   */
  async markNoticeRead() {
    await markNoticeRead(cloud);
    my.showToast({
      type: 'success',
      content: '成功清除未读消息',
    });
    this.getUnreadCount();
    this.getList({ pageNo: 1 });
  },
  /**
   * 清除未读消息
   */
  clearNotice() {
    const that = this
    my.confirm({
      title: '提示',
      content: '请确定清除未读消息？',
      success (res) {
        if (res.confirm) {
          that.markNoticeRead()
        }
      }
    })
  }
})

