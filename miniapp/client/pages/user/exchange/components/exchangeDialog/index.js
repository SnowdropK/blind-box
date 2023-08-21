// components/exchangeDialog/index.js

Component({
  /**
   * 组件的属性列表
   */
  props: {
    title: '',
    info: ''
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    list: [{}, {}, {}, {},{},{},{},{}],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 关闭弹窗
     */
    close(){
      this.setData({
        show: false
      })
    },
    /**
     * 显示弹窗
     */
    show(list){
      this.setData({
        show: true,
        list
      })
    },
    /**
     * 阻止滑动
     */
    stopScroll(){
      return false;
    }
  }
})
