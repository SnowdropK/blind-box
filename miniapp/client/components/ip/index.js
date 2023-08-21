Component({
  /**
   * 组件的属性列表
   */
  props: {
    info: {},
    isInf: false,
  },

  /**
   * 组件的初始数据
   */
  data: {
    OPEN_GIFT: {
      OFF: 0, // 拳王赏：未开启赠品
      ON: 1 // 拳王赏：开启赠品
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 去详情页面
     */
    gotoDetail() {
      const info = this.props.info
      // if (info.sellOut) return
      if (!info.id) return;
      if (info.isPoints === 1) {
        if (info.rewardType === 3) {
          my.navigateTo({
            url: `/pages/reward/infInfo/infInfo?id=${info.id}&no=${info.currentSaleBoxNumber || 1}`,
          });
        }
        return;
      }
      if (info.type === "link") {
        //跳转外链
        if (info.jumpValue.indexOf('http') > -1) {
          let url = info.jumpValue;
          my.navigateTo({
            url: `/pages/web-view/web-view?url=${encodeURIComponent(url)}`,
          });
        }
      } else {
        // app.globalData.choseIp = {
        //   id: info.id,
        //   no: info.currentSaleBoxNumber || 1
        // }
        if (this.props.isInf) {
          my.navigateTo({
            url: `/pages/reward/infInfo/infInfo?id=${info.id}&no=${info.currentSaleBoxNumber || 1}`,
          })
          return;
        }
      }
    },
  }
})