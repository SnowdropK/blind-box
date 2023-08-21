import { NOTICE_INFO_MAP, NOTICE_TYPE_MAP } from '../../../../consts/index'
import parse from 'mini-html-parser2'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    NOTICE_INFO_MAP,
    NOTICE_TYPE_MAP,
    content: '',
    scrollHeight: 0,
    createTime: ''
  },
  goBack() {
    my.navigateBack({
      delta: 1
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
        const rect = my.createSelectorQuery().select('.systemScrollBox').boundingClientRect();
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
  onLoad() {
    this.getScrollHeight();
    const { data: { content = "", createTime = "", updateTime = '' } } = my.getStorageSync({ key: 'systemNoticeRichText' });
    let nextContent = ''
    parse(content, (err, htmlData) => {
      console.log('htmlData', htmlData)
      if (!err) {
        nextContent = htmlData
      }
    })
    this.setData({
      createTime,
      updateTime,
      content: nextContent
    })
  },
})

