// components/nav/nav.js
const app = getApp()
Component({
  props: {
    // 背景是否统一为渐变黑
    bgBack: {
      type: Boolean,
      value: true
    },
    // 标题
    navTitle: {
      type: String,
      value: ''
    },
    // 标题颜色
    titleColor: {
      type: String,
      value: '#fff'
    },
    // 是否显示左侧按钮
    isShow: {
      type: Boolean,
      value: true
    },
    // 是否显示左侧返回按钮
    isBack:{
      type: Boolean,
      value: true
    },
    // 返回层级 默认为1
    pageNum: {
      type: Number,
      value: 1
    },
    from: {
      type: String,
      value: ''
    }
  },
  data: {
    capsule: {}
  },
  lifetimes:{
      //判断是否有上一级页面，如果有显示返回按钮（isBack参数）否则不显示
    attached: function() {
        this.setData({
          isBack:getCurrentPages().length === 1?false:true
        })
    }
  },
  ready() {
      //获取机型状态栏信息
    const {
      statusBarHeight,
    } = app.globalData.systemInfo
    const navBarHeight = statusBarHeight;
    // console.log(app.globalData)
    const capsule = wx.getMenuButtonBoundingClientRect()
    this.setData({
      statusBarHeight,
      navBarHeight,
      left: app.globalData.windowWidth - capsule.right, //胶囊据右边距离
      capsule: capsule
    })
  },
  methods: {
    // 返回层级 默认为1
    back(e) {
      if (this.data.from === 'account') {
        try {
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          prevPage.getAccount();
        } catch (error) {
          console.log(error);
        }
      }
      wx.navigateBack({
        delta: e.currentTarget.dataset.num
      })
    },
    // 跳转到首页
    toIndex() {
      wx.switchTab({
        url: '/pages/reward/index/index'
      })
    }
  }
})
