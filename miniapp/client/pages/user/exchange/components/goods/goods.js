// components/goods/goods.js

Component({
  /**
   * 组件的属性列表
   */
  props: {
    info: {},
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列
   */
  methods: {
    gotoDetail(e) {
      console.log('gotoDetail')
      const info = this.props.info
      console.log('info', info)
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
        // app.globalData.choseIp = {
        //   id: info.id,
        //   no: info.currentSaleBoxNumber || 1
        // }
        my.navigateTo({
          url: `/pages/reward/infInfo/infInfo?id=${info.id}&no=${info.currentSaleBoxNumber || 1}`,
        })
      }
    },
  }
})